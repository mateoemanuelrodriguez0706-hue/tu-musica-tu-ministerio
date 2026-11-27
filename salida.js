/* Aviso al salir — se muestra una sola vez por visita. No cambia precios ni ofrece descuentos. */
(function () {
  'use strict';
  var m = document.getElementById('salida');
  if (!m) return;
  var KEY = 'tmtm_salida_visto', mostrado = false, ultimoFoco = null;
  function visto() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return mostrado; } }
  function marcar() { mostrado = true; try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }
  var inicio = Date.now(), maxScroll = 0;

  function abrir() {
    if (mostrado || visto() || Date.now() - inicio < 8000) return;
    marcar(); ultimoFoco = document.activeElement; m.hidden = false;
    var x = document.getElementById('salidaX'); if (x) x.focus();
    if (window.clarity) try { window.clarity('event', 'aviso_salida'); } catch (e) {}
  }
  function cerrar() { m.hidden = true; if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus(); }

  document.getElementById('salidaX').addEventListener('click', cerrar);
  m.addEventListener('click', function (e) { if (e.target === m) cerrar(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) cerrar(); });
  var faq = document.getElementById('salidaFaq'); if (faq) faq.addEventListener('click', cerrar);
  Array.prototype.forEach.call(m.querySelectorAll('[data-cta]'), function (a) { a.addEventListener('click', function () { m.hidden = true; }); });

  // Computadora: el mouse sale por arriba (hacia la barra de pestañas o el botón de cerrar)
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY <= 0) abrir();
  });
  // Celular: después de bajar al menos un 40 % de la página, sube rápido hacia arriba
  var lastY = window.scrollY, lastT = Date.now();
  window.addEventListener('scroll', function () {
    var y = window.scrollY, t = Date.now(), h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 0) maxScroll = Math.max(maxScroll, y / h);
    var vel = (lastY - y) / Math.max(1, t - lastT); // px por ms, positivo = sube
    if (maxScroll > 0.4 && vel > 2.5 && y > 300 && window.matchMedia('(max-width: 899px)').matches) abrir();
    lastY = y; lastT = t;
  }, { passive: true });
})();
