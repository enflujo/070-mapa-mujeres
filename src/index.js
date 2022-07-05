import './scss/estilos.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import zonaHoraria from 'dayjs/plugin/timezone';
import 'dayjs/locale/es-mx';
import mapboxgl from 'mapbox-gl';
import { numeroRandom } from './utilidades/ayudas';

// Importar imágenes
import violenciaPolicial from './imgs/fotos/violencia_policial_BN.png';
import puercos from './imgs/fotos/puercos_violadores_BN.png';
import libre from './imgs/fotos/libre_no_valiente_BN.png';
import camino from './imgs/fotos/popayan_camino_a_casa_BN.png';
import perdon from './imgs/fotos/ni_perdon_BN.png';
import piropo from './imgs/fotos/no_quiero_su_piropo_pirobo_web_BN.png';
import respondemos from './imgs/fotos/respondemos_todas7_BN.png';

// Importar íconos
import icAcoso from './imgs/iconos/acoso_rojo.svg';
import icRobo from './imgs/iconos/robo_rojo.svg';
import icAgresionSexual from './imgs/iconos/abuso_rojo2.svg';
import icDesaparicion from './imgs/iconos/desaparicion_rojo.svg';
import icViolenciaPolicial from './imgs/iconos/violencia_policial_rojo.svg';

dayjs.extend(utc);
dayjs.extend(zonaHoraria);
dayjs.locale('es-mx');
dayjs.tz.setDefault('America/Bogota');

const imagenes = [violenciaPolicial, puercos, libre, camino, perdon, piropo, respondemos];

const iconos = {
  Robo: icRobo,
  'Violencia sexual': icAgresionSexual,
  'Violencia policial': icViolenciaPolicial,
  Desaparición: icDesaparicion,
  'Acoso callejero': icAcoso,
};

const imagen = document.createElement('img');
imagen.classList.add('imagen');

const token = process.env.MAPBOX_TOKEN;
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

let ratonX;
let ratonY;

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
  container: 'mapa', // ID del contenedor
  style: 'mapbox://styles/enflujo/cl4zwt7c8001b14mm7funs1ib', //'mapbox://styles/enflujo/cl44ov8i8000214rodtnuvshe',
  // URL del estilo
  center: [-74.13, 4.67], // posición inicial del mapa [long, lat]
  zoom: 10.3, // zoom inicial
});

document.addEventListener('mousemove', (e) => {
  ratonX = e.clientX;
  ratonY = e.clientY;
});

async function inicio() {
  const respuesta = await fetch('https://mujeres.enflujo.com/items/casos');
  const { data: datos } = await respuesta.json();

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

    // Información de la etiqueta
    let fecha = caso.fecha ? fechaJS.format('MMMM D, YYYY') : 'desconocida';
    fecha = fecha.charAt(0).toUpperCase() + fecha.slice(1);
    const edad = caso.edad ? caso.edad : 'desconocida';
    const enlace = caso.enlace ? caso.enlace : '';
    console.log(caso.id, enlace);
    const hechos = caso.descripcion ? caso.descripcion : '';

    caso.tipo_de_agresion.sort();
    const tiposDeAgresion = caso.tipo_de_agresion.join(', ').toUpperCase();
    let estadoDesaparicion = '';
    if (caso.tipo_de_agresion.includes('Desaparición') && caso.aparecio === true) {
      estadoDesaparicion = '(Ya apareció)';
    } else {
      estadoDesaparicion = '';
    }
    const infoCaso = `${tiposDeAgresion} <br> ${fecha} <br> Edad: ${edad} <br> 
    <div id="hechos">${hechos} ${estadoDesaparicion}</div> <br> <a href="${enlace}" target="_blank">Fuente<a/> `;

    // TODO: ¿pasar el enlace de las imágenes a Directus?
    // No se si sea necesario ya que de momento son muy pocos iconos.
    el.className = 'marcador';
    // Toca pensar si los iconos cambian según el grupo de categorías. -> Sí cambian
    // Por ahora pongo el primero de la lista.
    el.style.backgroundImage = `url(${iconos[caso.tipo_de_agresion[0]]})`;
    el.style.width = `${ancho}px`;
    el.style.height = `${alto}px`;

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

    // Ubicar el marcador de cada caso
    if (caso.lugar) {
      new mapboxgl.Marker(el).setLngLat(caso.lugar.coordinates).addTo(mapa);
    }
  });
}

inicio();

console.log('..:: EnFlujo ::..');
