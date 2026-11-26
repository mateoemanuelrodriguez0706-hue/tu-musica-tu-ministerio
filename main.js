/* Tu música, tu ministerio — lógica de la landing. Lee todo de config.js (window.SITE_CONFIG). */
(function () {
  'use strict';
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function vacio(v) { return !v || /PENDIENTE|^AAAA/i.test(String(v)); }
  function valida(url) { return /^https:\/\/[^\s]+$/i.test(url || ''); }

  /* ---------- precio ---------- */
  var moneda = C.moneda || 'USD';
  var precio = C.precio != null ? C.precio : 29;
  $$('[data-precio]').forEach(function (el) { el.textContent = moneda + ' ' + precio; });
  $$('[data-precio-num]').forEach(function (el) { el.textContent = precio; });
  var cur = $('.pc-precio .cur'); if (cur) cur.textContent = moneda;
  if (C.mostrarPrecioRegular && C.precioRegular && C.precioRegular > precio) {
    var pr = $('#precioRegular');
    pr.innerHTML = 'Precio regular: <s>' + moneda + ' ' + C.precioRegular + '</s>';
    pr.hidden = false;
  }
  // Oferta temporal: solo con fecha real y vigente
  if (C.oferta && C.oferta.activa && /^\d{4}-\d{2}-\d{2}$/.test(C.oferta.fechaFin || '')) {
    var fin = new Date(C.oferta.fechaFin + 'T23:59:59');
    if (fin > new Date()) {
      var f = fin.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
      var of = $('#oferta'); of.textContent = (C.oferta.texto || 'Oferta válida hasta el') + ' ' + f; of.hidden = false;
    }
  }

  /* ---------- botones de compra ---------- */
  var checkout = valida(C.hotmartUrl) ? C.hotmartUrl : null;
  if (!checkout) $('#devAviso').hidden = false;
  $$('[data-cta]').forEach(function (a) {
    var origen = a.getAttribute('data-cta');
    if (checkout) {
      a.href = checkout;
      a.rel = 'noopener';
    }
    a.addEventListener('click', function () {
      track('InitiateCheckout', { content_name: 'Tu musica tu ministerio', value: precio, currency: moneda, origen: origen });
    });
  });

  /* ---------- contacto ---------- */
  if (!vacio(C.instagram)) $$('[data-ig]').forEach(function (a) { a.href = 'https://www.instagram.com/' + String(C.instagram).replace(/^@/, '') + '/'; a.hidden = false; });
  if (!vacio(C.whatsapp) && /^\d{8,15}$/.test(C.whatsapp)) $$('[data-wa]').forEach(function (a) { a.href = 'https://wa.me/' + C.whatsapp; a.hidden = false; });
  if (!vacio(C.email) && /@/.test(C.email)) $$('[data-email]').forEach(function (a) { a.href = 'mailto:' + C.email; a.hidden = false; });
  var anio = $('#anio'); if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- menú ---------- */
  var btn = $('#menuBtn'), menu = $('#menu');
  if (btn) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }); });
  }

  /* ---------- barra fija en celular ---------- */
  var sticky = $('#stickyCta'), hero = $('.hero'), precioSec = $('#precio'), finalSec = $('.final');
  if ('IntersectionObserver' in window && sticky) {
    var vis = { hero: true, precio: false, final: false };
    var upd = function () {
      var show = !vis.hero && !vis.precio && !vis.final;
      sticky.classList.toggle('show', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      var l = $('a', sticky); if (l) l.tabIndex = show ? 0 : -1;
    };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { vis[e.target === hero ? 'hero' : e.target === precioSec ? 'precio' : 'final'] = e.isIntersecting; });
      upd();
    }, { threshold: 0.05 });
    [hero, precioSec, finalSec].forEach(function (el) { if (el) io.observe(el); });
    // Evento ViewContent cuando se ve el precio (solo si hay medición aceptada)
    var vc = false;
    new IntersectionObserver(function (es) {
      if (!vc && es[0].isIntersecting) { vc = true; track('ViewContent', { content_name: 'Precio', value: precio, currency: moneda }); }
    }, { threshold: 0.4 }).observe(precioSec);
  }

  /* ---------- medición + consentimiento ---------- */
  var hayMedicion = !vacio(C.metaPixelId) || !vacio(C.clarityId);
  var KEY = 'tmtm_consent';
  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var activo = false;

  function track(evento, datos) {
    if (!activo || !window.fbq) return;
    try { window.fbq('track', evento, datos || {}); } catch (e) {}
  }
  window.__track = track;

  function cargarMedicion() {
    if (activo) return; activo = true;
    if (!vacio(C.metaPixelId) && /^\d{6,20}$/.test(C.metaPixelId)) {
      /* Código base del píxel de Meta (oficial), cargado solo con consentimiento */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', C.metaPixelId);
      window.fbq('track', 'PageView');
    }
    if (!vacio(C.clarityId) && /^[a-z0-9]{6,20}$/i.test(C.clarityId)) {
      (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, 'clarity', 'script', C.clarityId);
    }
  }

  var banner = $('#cookies'), prefs = $('#cookiePrefs');
  if (hayMedicion) {
    if (prefs) prefs.hidden = false;
    var c = getConsent();
    if (c === 'si') cargarMedicion();
    else if (c !== 'no') banner.hidden = false;
    $('#ckSi').addEventListener('click', function () { setConsent('si'); banner.hidden = true; cargarMedicion(); });
    $('#ckNo').addEventListener('click', function () { setConsent('no'); banner.hidden = true; });
    if (prefs) prefs.addEventListener('click', function () { banner.hidden = false; });
  }
})();
