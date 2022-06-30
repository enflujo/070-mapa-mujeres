import './scss/estilos.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import zonaHoraria from 'dayjs/plugin/timezone';
import 'dayjs/locale/es-mx';
import mapboxgl from 'mapbox-gl';
import iconos from './utilidades/iconos';
import { numeroRandom } from './utilidades/ayudas';

// Importar imágenes
import violencia_policial from './imgs/fotos/violencia_policial_BN.png';
import puercos from './imgs/fotos/puercos_violadores_BN.png';
import libre from './imgs/fotos/libre_no_valiente_BN.png';
import camino from './imgs/fotos/popayan_camino_a_casa_BN.png';
import carcel from './imgs/fotos/carcel_agresor_BN.png';
import perdon from './imgs/fotos/ni_perdon_BN.png';
import piropo from './imgs/fotos/no_quiero_su_piropo_pirobo_web_BN.png';
import respondemos from './imgs/fotos/respondemos_todas7_BN.png';

// Importar íconos
import ic_desaparicion from './imgs/iconos/mano_violeta.png';
import ic_violencia_sexual from './imgs/iconos/violencia_sexual.png';

dayjs.extend(utc);
dayjs.extend(zonaHoraria);
dayjs.locale('es-mx');
dayjs.tz.setDefault('America/Bogota');

const imagenes = [violencia_policial, puercos, libre, camino, carcel, perdon, piropo, respondemos];

/* const iconos = {
  Robo: ic_robo,
  'Violencia sexual': ic_violencia_sexual,
  'Violencia policial': violencia_policial,
  Desaparición: ic_desaparicion,
}; */

const token = process.env.MAPBOX_TOKEN;
const cuerpo = document.getElementById('contenedor');
const titulo = document.getElementById('titulo');
const etiqueta = document.getElementById('etiqueta');
const informacionEtiqueta = document.getElementById('informacion');
// TODO: ¿Botón para cerrar o solo mouseleave?
const cerrar = document.getElementById('cerrar');

let etiquetaVisible = false;

let ratonX;
let ratonY;

// Crear nuevo mapa usando un estilo y un token de MapBox
mapboxgl.accessToken = token;

const mapa = new mapboxgl.Map({
  container: 'mapa', // ID del contenedor
  style: 'mapbox://styles/enflujo/cl4zwt7c8001b14mm7funs1ib', //'mapbox://styles/enflujo/cl44ov8i8000214rodtnuvshe',
  // URL del estilo
  center: [-74.0791, 4.6462], // posición inicial del mapa [long, lat]
  zoom: 10, // zoom inicial
});

document.addEventListener('mousemove', (e) => {
  ratonX = e.clientX;
  ratonY = e.clientY;
});

async function inicio() {
  const respuesta = await fetch('https://mujeres.enflujo.com/items/casos');
  const { data: datos } = await respuesta.json();

  datos.forEach((caso) => {
    // Crear un elemento del DOM para cada marcador.
    const el = document.createElement('div');
    const ancho = 30;
    const alto = 30;
    const fechaJS = dayjs(caso.fecha);

    /* const imagen = document.createElement('img');
    imagen.classList.add('imagen'); */

    // Información de la etiqueta
    let fecha = caso.fecha ? fechaJS.format('MMMM D, YYYY h:mm A') : 'desconocida';
    fecha = fecha.charAt(0).toUpperCase() + fecha.slice(1);
    const edad = caso.edad ? caso.edad : 'desconocida';
    const enlace = caso.enlace ? caso.enlace : '';
    const hechos = caso.descripcion ? caso.descripcion : '';

    caso.tipo_de_agresion.sort();
    const tiposDeAgresion = caso.tipo_de_agresion.join(', ').toUpperCase();
    const infoCaso = `${tiposDeAgresion} <br> ${fecha} <br> Edad: ${edad} <br>  <div id="hechos">${hechos}</div> <br> <a href="${enlace}" >Fuente<a/>`;

    // TODO: ¿pasar el enlace de las imágenes a Directus?
    // No se si sea necesario ya que de momento son muy pocos iconos.
    el.className = 'marcador';
    // Toca pensar si los iconos cambian según el grupo de categorías. -> Sí cambian
    // Por ahora pongo el primero de la lista.
    el.style.backgroundImage = `url(${iconos[caso.tipo_de_agresion[0]]})`;
    // el.style.backgroundImage = 'url(https://www.citypng.com/public/uploads/preview/-41601583586iyyvcbwc2i.png)';
    el.style.width = `${ancho}px`;
    el.style.height = `${alto}px`;

    el.addEventListener('mousedown', () => {
      // Agregar una etiqueta que muestre la información de cada caso al pasar el ratón
      if (etiquetaVisible) {
        etiqueta.style.visibility = 'visible';
      } else if (!etiquetaVisible) {
        etiqueta.style.visibility = 'hidden';
      }

      //etiqueta.style.top = `${ratonY - 80}px`;
      //etiqueta.style.left = `${ratonX}px`;

      informacionEtiqueta.innerHTML = infoCaso;

      titulo.style.display = 'none';

      // Mostrar una imagen sobrepuesta al mapa relacionada con el tipo de agresión
      // cuerpo.appendChild(imagen);
      // let num = numeroRandom(0, imagenes.length - 1);

      // imagen.src = imagenes[num];
      // imagen.style.visibility = 'visible';

      etiquetaVisible = !etiquetaVisible;
    });

    cerrar.addEventListener('mousedown', () => {
      titulo.style.display = 'block';
      etiqueta.style.visibility = 'hidden';
      // imagen.style.opacity = 0.05;

      console.log('miau');
    });

    // Ubicar el marcador de cada caso
    new mapboxgl.Marker(el).setLngLat(caso.lugar.coordinates).addTo(mapa);
  });
}

inicio();

console.log('..:: EnFlujo ::..');
