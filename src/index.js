import './scss/estilos.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

const token = process.env.MAPBOX_TOKEN;
const contenedorMapa = document.getElementById('mapa');
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

document.addEventListener('mousemove', posicionRaton);
function posicionRaton(e) {
  ratonX = e.clientX;
  ratonY = e.clientY;
}

fetch('https://mujeres.enflujo.com/items/casos').then(function (respuesta) {
  respuesta.json().then(function (datos) {
    // TODO Reemplazar i>7 por la longitud de la lista de casos
    for (let i = 0; i < 7; i++) {
      //  console.log(datos.data[i]);

      // Crear un elemento del DOM para cada marcador.
      const el = document.createElement('div');
      const ancho = 30;
      const alto = 30;
      const caso = datos.data[i];

      const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let fechaJS = new Date(caso.fecha);

      // Información de la etiqueta
      let fecha = `${caso.fecha ? fechaJS.toLocaleDateString('es-CO', opciones) : 'desconocida'}`;
      let edad = `${caso.edad ? caso.edad : 'desconocida'}`;
      let tiposDeAgresion = [];
      if (caso.tipo_de_agresion.length > 1) {
        tiposDeAgresion = caso.tipo_de_agresion.map((agresion) => {
          return ` ${agresion}`;
        });
      } else {
        tiposDeAgresion = caso.tipo_de_agresion[0];
      }

      const infoCaso = `${tiposDeAgresion} <br> ${fecha} <br> Edad: ${edad}`;

      // TODO: ¿pasar el enlace de las imágenes a Directus?
      el.className = 'marcador';
      el.style.backgroundImage = `url(https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.vexels.com%2Fmedia%2Fusers%2F3%2F163428%2Fisolated%2Fpreview%2F7360ca8520660d6e6eb4d68bd4ed7224-icono-del-d-iacute-a-de-la-mujer-by-vexels.png&f=1&nofb=1)`;
      el.style.width = `${ancho}px`;
      el.style.height = `${alto}px`;
      el.style.backgroundSize = '100%';

      // Agregar una etiqueta que muestre la información de cada caso al pasar el ratón
      const etiqueta = document.createElement('div');
      etiqueta.classList.add('etiqueta');
      etiqueta.innerHTML = infoCaso;

      el.addEventListener('mouseenter', () => {
        etiqueta.style.visibility = 'visible';
        etiqueta.style.top = `${ratonY - 80}px`;
        etiqueta.style.left = `${ratonX}px`;

        contenedorMapa.append(etiqueta);
      });

      el.addEventListener('mouseleave', () => {
        etiqueta.style.visibility = 'hidden';
      });

      // Ubicar el marcador de cada caso
      new mapboxgl.Marker(el).setLngLat(caso.lugar.coordinates).addTo(mapa);
    }

    return datos;
  });
});

console.log('..:: EnFlujo ::..');
