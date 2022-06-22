import './scss/estilos.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import zonaHoraria from 'dayjs/plugin/timezone';
import 'dayjs/locale/es-mx';
import mapboxgl from 'mapbox-gl';
import iconos from './utilidades/iconos';

// Importar imágenes
import violencia_policial from './imgs/fotos/violencia_policial.jpeg';
import violencia_sexual from './imgs/fotos/violadores.jpg';
import desaparicion from './imgs/fotos/desaparicion.png';
import robo from './imgs/fotos/robo.jpeg';

// Importar íconos
import ic_desaparicion from './imgs/iconos/mano_violeta.png';
import ic_violencia_sexual from './imgs/iconos/violencia_sexual.png';

dayjs.extend(utc);
dayjs.extend(zonaHoraria);
dayjs.locale('es-mx');
dayjs.tz.setDefault('America/Bogota');

const imagenes = {
  Robo: robo,
  'Violencia sexual': violencia_sexual,
  'Violencia policial': violencia_policial,
  Desaparición: desaparicion,
};

// const iconos = {
//   Robo: ic_robo,
//   'Violencia sexual': ic_violencia_sexual,
//   'Violencia policial': violencia_policial,
//   Desaparición: ic_desaparicion,
// };

const token = process.env.MAPBOX_TOKEN;
const cuerpo = document.getElementById('contenedor');
const titulo = document.getElementById('titulo');
const etiqueta = document.getElementById('etiqueta');
const informacionEtiqueta = document.getElementById('informacion');

let ratonX;
let ratonY;

// Crear nuevo mapa usando un estilo y un token de MapBox
mapboxgl.accessToken = token;

const mapa = new mapboxgl.Map({
  container: 'mapa', // ID del contenedor
  style: 'mapbox://styles/enflujo/cl44ov8i8000214rodtnuvshe',
  // URL del estilo
  center: [-74.0791, 4.5462], // posición inicial del mapa [long, lat]
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
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaJS = dayjs(caso.fecha);

    const imagen = document.createElement('img');
    imagen.classList.add('imagen');

    // Información de la etiqueta
    const fecha = caso.fecha ? fechaJS.format('MMMM D, YYYY h:mm A') : 'desconocida';
    const edad = caso.edad ? caso.edad : 'desconocida';
    const enlace = caso.enlace ? caso.enlace : '';
    const hechos = caso.descripcion ? caso.descripcion : '';

    caso.tipo_de_agresion.sort();
    const tiposDeAgresion = caso.tipo_de_agresion.join(', ');
    const infoCaso = `${tiposDeAgresion} <br> ${fecha} <br> Edad: ${edad} <br>  <span id="hechos">${hechos}</span> <br> <a href="${enlace}" >Fuente<a/>`;

    // TODO: ¿pasar el enlace de las imágenes a Directus?
    // No se si sea necesario ya que de momento son muy pocos iconos.
    el.className = 'marcador';
    // Toca pensar si los iconos cambian según el grupo de categorías. -> Sí cambian
    // Por ahora pongo el primero de la lista.
    el.style.backgroundImage = `url(${iconos[caso.tipo_de_agresion[0]]})`;
    el.style.width = `${ancho}px`;
    el.style.height = `${alto}px`;

    el.addEventListener('mouseenter', () => {
      // Agregar una etiqueta que muestre la información de cada caso al pasar el ratón
      etiqueta.style.visibility = 'visible';
      etiqueta.style.top = `${ratonY - 80}px`;
      etiqueta.style.left = `${ratonX}px`;

      informacionEtiqueta.innerHTML = infoCaso;

      // TODO: ¿Botón para cerrar o solo mouseleave?
      const cerrar = document.getElementById('cerrar');

      titulo.style.display = 'none';

      // Mostrar una imagen sobrepuesta al mapa relacionada con el tipo de agresión
      cuerpo.appendChild(imagen);
      imagen.src = imagenes[caso.tipo_de_agresion[0]];
      imagen.style.visibility = 'visible';
    });

    el.addEventListener('mouseleave', () => {
      titulo.style.display = 'block';
      etiqueta.style.visibility = 'hidden';
      imagen.style.visibility = 'hidden';
    });

    // Ubicar el marcador de cada caso
    new mapboxgl.Marker(el).setLngLat(caso.lugar.coordinates).addTo(mapa);
  });
}

inicio();

console.log('..:: EnFlujo ::..');
