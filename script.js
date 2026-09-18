(function () {
  'use strict';

  // WhatsApp de Martín: +54 9 3525 53-0200, en formato internacional sin signos.
  var TELEFONO = '5493525530200';

  // Píxel de Meta. Pegar acá los dígitos del ID y listo, no hay que tocar
  // nada más. Mientras esté vacío el píxel no carga y la página funciona
  // igual, así que no queda en un estado roto si se publica sin él.
  var PIXEL = '';
  var MENSAJE = 'Hola, vi el anuncio del poroto mung y quiero saber si entra en mi planteo.';

  // 1. Píxel de Meta, solo si hay ID cargado.
  if (PIXEL) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL);
    fbq('track', 'PageView');
  }

  // 2. Armar los enlaces a WhatsApp. Los botones con data-plan mandan el
  //    nombre del programa, así Martín sabe de entrada por cuál preguntan.
  var botones = document.querySelectorAll('[data-wa]');
  for (var i = 0; i < botones.length; i++) {
    var plan = botones[i].getAttribute('data-plan');
    var texto = plan
      ? 'Hola, tengo interés en el ' + plan + ' de poroto mung.'
      : MENSAJE;
    botones[i].setAttribute('href', 'https://wa.me/' + TELEFONO + '?text=' + encodeURIComponent(texto));
    // WhatsApp abre en pestaña nueva. Además de dejar la página atrás,
    // evita que la navegación corte el pedido del píxel antes de salir.
    botones[i].setAttribute('target', '_blank');
    botones[i].setAttribute('rel', 'noopener');
    // Avisa al píxel que alguien salió hacia WhatsApp. Sin esto no hay
    // forma de separar la fuga del anuncio de la fuga de la página.
    botones[i].addEventListener('click', function () {
      if (typeof fbq === 'function') {
        fbq('track', 'Contact', { content_name: this.getAttribute('data-plan') || 'general' });
      }
    });
  }

  // 3. Indicador de avance de lectura.
  var barraAvance = document.getElementById('progreso-barra');
  var pendiente = false;

  function avance() {
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    var leido = alto > 0 ? Math.min(window.scrollY / alto, 1) : 1;
    barraAvance.style.width = (leido * 100).toFixed(1) + '%';
    pendiente = false;
  }

  window.addEventListener('scroll', function () {
    if (!pendiente) {
      pendiente = true;
      window.requestAnimationFrame(avance);
    }
  }, { passive: true });

  window.addEventListener('resize', avance, { passive: true });
  avance();

  // 4. Ocultar la barra fija cuando el cierre ya está en pantalla,
  //    para que no queden dos botones iguales encimados.
  var barra = document.getElementById('barra');
  var cierre = document.getElementById('cta-final');

  if ('IntersectionObserver' in window && barra && cierre) {
    var observador = new IntersectionObserver(function (entradas) {
      barra.hidden = entradas[0].isIntersecting;
    }, { rootMargin: '0px 0px -80px 0px' });
    observador.observe(cierre);
  }
})();
