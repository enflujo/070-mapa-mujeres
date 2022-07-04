# Mapa de agresiones a mujeres en el espacio público de Bogotá en 2022

## Recomendaciones antes de publicar

Agregar algunos descriptores sobre el sitio para personalizar la vista cuando se comparte en redes y resultados en busquedas.

En el `index.html` dentro del `<head>` se puede usar algo como esto (hay más opciones, este es un ejemplo genérico que sirve en muchos casos):

```html
<meta name="description" content="Una descripción corta del sitio." />

<!-- Tags OG: Facebook, Whatsapp, etc... -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://..." />
<meta property="og:title" content="Título..." />
<meta property="og:description" content="Descripción..." />
<meta property="og:image" content="https://...(debe ser una ruta completa: https://... y no './...')" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:site" content="@..." />
<meta property="twitter:url" content="https://..." />
<meta property="twitter:title" content="Título..." />
<meta property="twitter:description" content="Descripción..." />
<meta property="twitter:image" content="https://...(debe ser una ruta completa: https://... y no './...')" />
<meta property="twitter:image:alt" content="texto alternativo a imagen" />
```
