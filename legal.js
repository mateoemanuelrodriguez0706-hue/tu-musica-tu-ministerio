/* Completa las páginas legales con los datos de config.js. Si falta un dato, lo marca como PENDIENTE. */
(function () {
  var C = window.SITE_CONFIG || {};
  var pend = function (v) { return !v || /PENDIENTE|^AAAA/i.test(String(v)); };
  var vals = {
    titular: C.titular, paisTitular: C.paisTitular, email: C.email,
    fechaActualizacionLegal: C.fechaActualizacionLegal,
    precioTexto: (C.moneda || 'USD') + ' ' + (C.precio != null ? C.precio : '')
  };
  Array.prototype.forEach.call(document.querySelectorAll('[data-c]'), function (el) {
    var k = el.getAttribute('data-c'), v = vals[k];
    if (pend(v)) { el.textContent = 'PENDIENTE: ' + k; el.className = 'pend'; }
    else if (k === 'email') { var a = document.createElement('a'); a.href = 'mailto:' + v; a.textContent = v; el.appendChild(a); }
    else el.textContent = v;
  });
  var med = !pend(C.metaPixelId) || !pend(C.clarityId);
  Array.prototype.forEach.call(document.querySelectorAll('[data-solo-medicion]'), function (el) { el.hidden = !med; });
  Array.prototype.forEach.call(document.querySelectorAll('[data-sin-medicion]'), function (el) { el.hidden = med; });
})();
