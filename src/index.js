import './scss/estilos.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import zonaHoraria from 'dayjs/plugin/timezone';
import 'dayjs/locale/es-mx';
import mapboxgl from 'mapbox-gl';
import { numeroRandom } from './utilidades/ayudas';
import datos from './utilidades/casos 20240117-143739.json';

// Importar imágenes. Necesario porque usamos Webpack
import violenciaPolicial from './imgs/fotos/violencia_policial_BN.png';
import puercos from './imgs/fotos/puercos_violadores_BN.png';
import libre from './imgs/fotos/libre_no_valiente_BN.png';
import camino from './imgs/fotos/popayan_camino_a_casa_BN.png';
import perdon from './imgs/fotos/ni_perdon_BN.png';
import piropo from './imgs/fotos/no_quiero_su_piropo_pirobo_web_BN.png';
import respondemos from './imgs/fotos/respondemos_todas7_BN.png';
import preciosa from './imgs/fotos/estas_preciosa_bn.jpg';
import felizDia from './imgs/fotos/feliz_el_dia_bn.jpg';
import laMujer from './imgs/fotos/la_mujer_de_bn.jpg';
import tuOpinion from './imgs/fotos/tu_opinion.jpg';
import noEsPiropo from './imgs/fotos/no_es_piropo_bn.jpg';
import noEstamosTodas from './imgs/fotos/no_estamos_todas_bn.jpg';
import noNaciMujer from './imgs/fotos/no_naci_mujer_bn.jpg';
import sororidad from './imgs/fotos/sororidad_bn.jpg';

// Traducir fecha a español y configurar la zona horaria
dayjs.extend(utc);
dayjs.extend(zonaHoraria);
dayjs.locale('es-mx');
dayjs.tz.setDefault('America/Bogota');

const imagenes = [
  violenciaPolicial,
  puercos,
  libre,
  camino,
  perdon,
  piropo,
  respondemos,
  preciosa,
  felizDia,
  laMujer,
  tuOpinion,
  noEsPiropo,
  noEstamosTodas,
  noNaciMujer,
  sororidad,
];

// Colores del marcador según el tipo de agresión
const colores = {
  Desaparición: 'rgba(153, 51, 255, 0.76)',
  Robo: 'rgba(255, 102, 255, 0.8)',
  'Violencia sexual': 'rgba(153, 0, 204, 0.7)',
  'Violencia policial': 'rgba(216, 108, 255, 0.8)',
  'Acoso callejero': 'rgba(255, 51, 153, 0.76)',
};

const imagen = document.createElement('img');
imagen.classList.add('imagen');

const token = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrYWlxNTYwMmFuM2twcW03bm11emxtIn0.yE-JIn-oRYILe5uMbAX4vg';
const cuerpo = document.getElementById('contenedor');
const titulo = document.getElementById('titulo');
const etiqueta = document.getElementById('etiqueta');
const informacionEtiqueta = document.getElementById('informacion');
const lienzo = document.getElementById('lienzo');
const cerrar = document.getElementById('cerrar');
const cerrarCreditos = document.getElementById('cerrarCreditos');
const creditos = document.getElementById('creditos');
const abrirCreditos = document.getElementById('acerca');
let etiquetaVisible = false;

cuerpo.style.display = 'block';

// Crear nuevo mapa usando un estilo y un token de MapBox
mapboxgl.accessToken = token;

function cerrarEtiqueta() {
  titulo.style.display = 'block';
  etiqueta.style.visibility = 'hidden';
  imagen.style.opacity = 0.05;
  imagen.src = '';
  lienzo.style.opacity = 0;
  etiquetaVisible = false;
}

const mapa = new mapboxgl.Map({
  // ID del contenedor
  container: 'mapa',
  // URL del estilo
  style: 'mapbox://styles/enflujo/cl4zwt7c8001b14mm7funs1ib',
  // posición inicial del mapa [long, lat]
  center: [-74.13, 4.67],
  // zoom inicial
  zoom: 10.3,
});

mapa.on('load', inicio);

async function inicio() {
  // URL donde se cargan los datos
  // const respuesta = await fetch('https://mujeres.enflujo.com/items/casos');
  // const { data: datos } = await respuesta.json();

  cerrar.innerText = 'x';

  document.body.addEventListener('click', (evento) => {
    if (etiquetaVisible) {
      if (!(etiqueta === evento.target || etiqueta.contains(evento.target))) {
        cerrarEtiqueta();
      }
    }

    if (creditos.classList.contains('visible')) {
      if (!(creditos === evento.target || creditos.contains(evento.target))) {
        creditos.classList.remove('visible');
      }
    }
  });

  cerrarCreditos.addEventListener('click', () => {
    creditos.classList.remove('visible');
  });

  abrirCreditos.addEventListener('click', (evento) => {
    evento.stopPropagation();
    creditos.classList.toggle('visible');
  });

  cerrar.addEventListener('click', cerrarEtiqueta);

  datos.forEach((caso) => {
    // Crear un elemento del DOM para cada marcador.
    const el = document.createElement('div');
    const ancho = 30;
    const alto = 30;
    const fechaJS = dayjs(caso.fecha);
    const colorFondo = colores[caso.tipo_de_agresion[0]];
    el.style.backgroundColor = colorFondo ? colorFondo : 'yellow'; //colorMarcador(caso);

    // Información de la etiqueta
    let fecha = caso.fecha ? fechaJS.format('MMMM D, YYYY') : 'desconocida';
    fecha = fecha.charAt(0).toUpperCase() + fecha.slice(1);
    const edad = caso.edad ? caso.edad : 'desconocida';
    const enlace = caso.enlace ? caso.enlace : '';
    const hechos = caso.descripcion ? caso.descripcion : '';

    caso.tipo_de_agresion.sort();
    const tiposDeAgresion = caso.tipo_de_agresion.join(', ').toUpperCase();
    let estadoDesaparicion = '';
    if (caso.tipo_de_agresion.includes('Desaparición') && caso.aparecio === true) {
      estadoDesaparicion = '(Ya apareció)';
    } else {
      estadoDesaparicion = '';
    }
    const infoCaso = `<div class="etiquetaTitulo">${tiposDeAgresion}</div> ${fecha} <br> Edad: ${edad} <br> 
    <div id="hechos">${hechos} ${estadoDesaparicion}</div> <br> <a href="${enlace}" target="_blank">Fuente<a/> `;

    el.className = 'marcador';
    el.style.width = `${ancho}px`;
    el.style.height = `${alto}px`;
    el.innerText = `${caso.nombre}`;

    // Mostrar etiqueta al hacer clic en un punto
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!etiquetaVisible) {
        etiqueta.style.visibility = 'visible';
        etiquetaVisible = true;
      }

      informacionEtiqueta.innerHTML = infoCaso;

      titulo.style.display = 'none';

      // Mostrar una imagen sobrepuesta al mapa relacionada con el tipo de agresión
      cuerpo.appendChild(imagen);

      let num = numeroRandom(0, imagenes.length - 1);
      lienzo.style.opacity = 0.1;
      imagen.src = imagenes[num];
      imagen.style.opacity = 0.9;
      imagen.style.visibility = 'visible';
    });

    el.addEventListener('mouseover', (e) => {
      el.innerText = `${caso.nombre}`;
    });

    // Ubicar el marcador de cada caso
    if (caso.lugar && caso.publicado === true) {
      new mapboxgl.Marker(el).setLngLat(caso.lugar.coordinates).addTo(mapa);
    }
  });
}

console.log('..:: EnFlujo ::..');
