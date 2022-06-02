import './scss/estilos.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import iconos from './utilidades/iconos';

// Importar imágenes
import violencia_policial from './imgs/violencia_policial.jpeg';
import violencia_sexual from './imgs/violadores.jpg';
import desaparicion from './imgs/desaparicion.png';
import robo from './imgs/robo.jpeg';

const imagenes = {
  Robo: robo,
  'Violencia sexual': violencia_sexual,
  'Violencia policial': violencia_policial,
  Desaparición: desaparicion,
};

const token = process.env.MAPBOX_TOKEN;
const titulo = document.getElementById('titulo');
const etiqueta = document.getElementById('etiqueta');
// Imagen
// const contenedorMapa = document.getElementById('mapa');
const imagen = document.getElementById('imagen');
let ratonX;
let ratonY;

// Crear nuevo mapa usando un estilo y un token de MapBox
mapboxgl.accessToken = token;

const mapa = new mapboxgl.Map({
  container: 'mapa', // ID del contenedor
  style: 'mapbox://styles/enflujo/cl3kdh8bp006b14lowcxmiwyd', //'mapbox://styles/enflujo/cl3kdh8bp006b14lowcxmiwyd', // URL del estilo
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
    const fechaJS = new Date(caso.fecha);

    // Información de la etiqueta
    const fecha = caso.fecha ? fechaJS.toLocaleDateString('es-CO', opciones) : 'desconocida';
    const edad = caso.edad ? caso.edad : 'desconocida';

    caso.tipo_de_agresion.sort();
    const tiposDeAgresion = caso.tipo_de_agresion.join(', ');
    const infoCaso = `${tiposDeAgresion} <br> ${fecha} <br> Edad: ${edad}`;

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
      etiqueta.innerHTML = infoCaso;
      etiqueta.style.visibility = 'visible';
      etiqueta.style.top = `${ratonY - 80}px`;
      etiqueta.style.left = `${ratonX}px`;

      titulo.style.display = 'none';

      // Mostrar una imagen sobrepuesta al mapa relacionada con el tipo de agresión
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
