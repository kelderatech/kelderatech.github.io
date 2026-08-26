// ============================================================
// Keldera Technologies — shared site behavior
// ============================================================

// --- services dropdown (desktop click/keyboard + mobile accordion) ---
(function(){
  var trigger = document.querySelector('.dropdown-trigger');
  var panel = document.querySelector('.dropdown-panel');
  var navItem = document.querySelector('.nav-item');
  if(trigger && panel && navItem){
    trigger.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = panel.classList.contains('wide-open');
      panel.classList.toggle('wide-open', !isOpen);
      trigger.classList.toggle('active', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
    document.addEventListener('click', function(e){
      if(!navItem.contains(e.target)){
        panel.classList.remove('wide-open');
        trigger.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        panel.classList.remove('wide-open');
        trigger.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // mobile accordion for the services submenu
  var mToggle = document.querySelector('.mobile-sub-toggle');
  var mPanel = document.querySelector('.mobile-sub-panel');
  if(mToggle && mPanel){
    mToggle.addEventListener('click', function(){
      var isOpen = mPanel.classList.contains('open');
      mPanel.classList.toggle('open', !isOpen);
      mToggle.classList.toggle('open', !isOpen);
    });
  }
})();

// --- mobile nav toggle ---
(function(){
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  var overlay = document.querySelector('.nav-overlay');
  if(!toggle || !links) return;

  function openMenu(){
    links.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    if(overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    links.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    if(overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    var mPanel = document.querySelector('.mobile-sub-panel');
    var mToggle = document.querySelector('.mobile-sub-toggle');
    if(mPanel) mPanel.classList.remove('open');
    if(mToggle) mToggle.classList.remove('open');
  }

  toggle.addEventListener('click', function(){
    if(links.classList.contains('open')){ closeMenu(); } else { openMenu(); }
  });
  if(overlay){ overlay.addEventListener('click', closeMenu); }
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeMenu();
  });
  // if resized back to desktop while menu is open, reset state
  window.addEventListener('resize', function(){
    if(window.innerWidth > 760) closeMenu();
  });
})();

// --- highlight active nav + tab links based on current page ---
(function(){
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .tab').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === path){ a.classList.add('active'); }
  });
  if(path === 'services.html'){
    var trig = document.querySelector('.dropdown-trigger');
    if(trig) trig.classList.add('current');
  }
})();

// --- scroll reveal ---
(function(){
  var els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function(el){ io.observe(el); });
})();

// --- animated metric count-up on the hero status card ---
(function(){
  var metrics = document.querySelectorAll('[data-count-to]');
  if(!metrics.length) return;
  var done = false;
  function run(){
    if(done) return;
    done = true;
    metrics.forEach(function(el){
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
      var duration = 1200;
      var start = null;
      function step(ts){
        if(!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var val = target * eased;
        el.textContent = val.toFixed(decimals) + suffix;
        if(progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var card = document.querySelector('.status-card');
  if(card && 'IntersectionObserver' in window){
    var io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting) run(); });
    }, { threshold: 0.3 });
    io2.observe(card);
  } else {
    run();
  }
})();

// --- contact form: builds a mailto so it works with no backend ---
(function(){
  var form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = form.querySelector('#name').value.trim();
    var email = form.querySelector('#email').value.trim();
    var company = form.querySelector('#company') ? form.querySelector('#company').value.trim() : '';
    var message = form.querySelector('#message').value.trim();

    var subject = encodeURIComponent('Consultation Request — ' + (company || name));
    var bodyLines = [
      'Name: ' + name,
      'Email: ' + email,
      company ? ('Company: ' + company) : null,
      '',
      message
    ].filter(Boolean);
    var body = encodeURIComponent(bodyLines.join('\n'));

    window.location.href = 'mailto:info@kelderatech.com?subject=' + subject + '&body=' + body;

    var status = document.getElementById('form-status');
    if(status){
      status.textContent = 'Opening your email client with the details filled in…';
      status.classList.add('show');
    }
  });
})();

// ============================================================
// CLIENT PORTAL CONFIG
// Replace PORTAL_URL with wherever you host the actual client
// portal backend (e.g. an Ubuntu server behind nginx + HTTPS).
// This static site never sees client credentials — it only
// links out to the real, separately-hosted portal.
// ============================================================
var KELDERA_PORTAL_URL = 'https://portal.keldera.com';

(function(){
  var btn = document.getElementById('portal-continue');
  if(!btn) return;
  btn.setAttribute('href', KELDERA_PORTAL_URL);
})();
