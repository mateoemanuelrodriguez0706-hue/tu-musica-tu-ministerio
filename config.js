/* =====================================================================
   CONFIGURACIÓN CENTRAL DE LA WEB — «Tu música, tu ministerio»
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que hay que tocar para conectar la venta.
   Todo lo que diga "PENDIENTE" o esté vacío ("") todavía falta.
   Mientras falte el enlace de Hotmart, la web muestra un aviso arriba
   y los botones de compra llevan a la sección de precio (no a un link falso).
   ===================================================================== */
window.SITE_CONFIG = {

  /* --- VENTA ------------------------------------------------------- */
  // Pegá acá el enlace de pago (checkout) que te da Hotmart para el producto.
  // Ejemplo de forma (NO es real): "https://pay.hotmart.com/XXXXXXXX"
  hotmartUrl: "https://pay.hotmart.com/N108704032S",

  precio: 29,                 // precio de lanzamiento en USD
  moneda: "USD",
  precioRegular: 39,          // precio regular proyectado (NO se muestra si mostrarPrecioRegular = false)
  mostrarPrecioRegular: false, // poner true SOLO cuando el precio regular exista de verdad

  // Oferta temporal: solo se muestra si activa = true Y la fecha de fin todavía no pasó.
  // Usar solo con una fecha real. Formato de fecha: "AAAA-MM-DD".
  oferta: {
    activa: false,
    texto: "Precio de lanzamiento disponible hasta el",
    fechaFin: "AAAA-MM-DD"
  },

  /* --- CONTACTO ---------------------------------------------------- */
  // Instagram: solo el usuario, sin @. (Tomado de tus notas; verificalo.)
  instagram: "mr_produccion",
  // WhatsApp: número en formato internacional, solo dígitos. Ej.: "5491100000000" (NO es real).
  whatsapp: "5493413459128",
  // Correo de contacto/soporte que querés mostrar en la web y en las páginas legales.
  email: "mrproducciones54@gmail.com",

  /* --- DATOS LEGALES (páginas de privacidad y términos) ------------ */
  titular: "MR Producciones",           // nombre comercial o legal del vendedor
  paisTitular: "Argentina",
  fechaActualizacionLegal: "26 de noviembre de 2026",

  /* --- MEDICIÓN (opcional) ----------------------------------------- */
  // Dejar vacío si no se usa. Si se completa, aparece el aviso de cookies
  // y el píxel se carga SOLO si la persona acepta.
  metaPixelId: "",            // ID del píxel de Meta (solo números). NO se inventa: confirmalo antes.
  clarityId: "zkaoj4yqga",              // ID de proyecto de Microsoft Clarity (opcional)

  /* --- SITIO ------------------------------------------------------- */
  // URL pública final de la web (sirve para compartir). Ej.: "https://usuario.github.io/tu-musica-tu-ministerio/"
  urlSitio: "https://mateoemanuelrodriguez0706-hue.github.io/tu-musica-tu-ministerio/"
};
