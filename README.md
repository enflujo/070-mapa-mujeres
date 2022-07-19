# Mapa de agresiones a mujeres en el espacio público de Bogotá en 2022

Investigación desarrollada en colaboración con [Cerosetenta](https://cerosetenta.uniandes.edu.co/).

Este mapa hace parte del especial 'Calles Peligrosas: Violencias contra las mujeres en el espacio público de Bogotá' publicado por Cerosetenta. Es un ejercicio de visibilización, sistematización y análisis sobre las distintas violencias que enfrentan las mujeres en el espacio público de la ciudad. Si has sufrido o conoces otros casos de acoso callejero, abuso sexual o desaparición y quisieras sumar tu voz al mapa, te invitamos a llenar [este formulario](https://docs.google.com/forms/d/e/1FAIpQLSfFiJmGgXuFWQVnxVCbr7bRuPkO2DE7k4km-H1_ybgiZ_lN0g/viewform).

## Equipo

Investigación principal: Laura Ramos Rico

Idea y coinvestigación: Lina Vargas Fonseca

Programación: Antonia Bustamante y Juan Camilo González

Diseño: Julián Camilo García y Antonia Bustamante

---

## Desarrollo

- Para cargar los datos en la base de datos del proyecto usamos [Directus](https://directus.io/).
- Para dibujar el mapa usamos [Mapbox](https://www.mapbox.com/). Es necesario crear un archivo .env con un token de Mapbox para cargar el proyecto y cargar el estilo correspondiente en el archivo _index.js_. En ese mismo archivo pueden configurarse las coordenadas donde se centra el mapa inicialmente y el zoom.
