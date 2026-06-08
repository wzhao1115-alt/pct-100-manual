/**
 * PCT-100 产品说明书网站 — 高级交互脚本
 * 滚动动画 · 粒子背景 · 返回顶部 · 数字动画 · 导航特效
 */
(function () {
  'use strict';

  // ==================== 背景动态光斑 ====================
  function createBgOrbs() {
    var colors = ['rgba(0,212,255,0.06)', 'rgba(179,136,255,0.05)', 'rgba(0,230,118,0.04)'];
    for (var i = 0; i < 3; i++) {
      var orb = document.createElement('div');
      orb.className = 'bg-orb orb-' + (i + 1);
      document.body.appendChild(orb);
    }
  }

  // ==================== 移动端导航 ====================
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var open = !links.classList.contains('open');
      links.classList.toggle('open');
      toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    var anchors = links.querySelectorAll('a');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }

    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // 导航栏滚动阴影
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 10) navbar.classList.add('scrolled');
          else navbar.classList.remove('scrolled');
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ==================== 滚动入场动画 (Intersection Observer) ====================
  function initRevealAnimations() {
    var elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    for (var i = 0; i < elements.length; i++) {
      observer.observe(elements[i]);
    }
  }

  // ==================== 返回顶部按钮 ====================
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '&#8593;';
    btn.setAttribute('aria-label', '返回顶部');
    document.body.appendChild(btn);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 500) btn.classList.add('visible');
          else btn.classList.remove('visible');
          ticking = false;
        });
        ticking = true;
      }
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== 平滑滚动锚点 ====================
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        var id = this.getAttribute('href').substring(1);
        var target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  // ==================== FAQ 手风琴 ====================
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    for (var i = 0; i < items.length; i++) {
      (function (item) {
        var q = item.querySelector('.faq-q');
        if (!q) return;
        q.addEventListener('click', function () {
          var wasOpen = item.classList.contains('open');
          // 关闭其他
          var openItems = document.querySelectorAll('.faq-item.open');
          for (var j = 0; j < openItems.length; j++) {
            openItems[j].classList.remove('open');
          }
          // 切换当前
          if (!wasOpen) item.classList.add('open');
        });
      })(items[i]);
    }
  }

  // ==================== 数字滚动动画 ====================
  function animateNumber(el, target, duration) {
    if (!el) return;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initStatNumbers() {
    var stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          if (target) animateNumber(el, target, 1500);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    for (var i = 0; i < stats.length; i++) {
      observer.observe(stats[i]);
    }
  }

  // ==================== 鼠标跟踪光晕（Hero 区域） ====================
  function initHeroGlow() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      hero.style.setProperty('--mx', x + 'px');
      hero.style.setProperty('--my', y + 'px');
    });
  }

  // ==================== 卡片悬停 3D 微倾斜 ====================
  function initCardTilt() {
    var cards = document.querySelectorAll('.card[data-tilt]');
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          var cx = rect.width / 2;
          var cy = rect.height / 2;
          var rx = (y - cy) / cy * 5;
          var ry = (x - cx) / cx * -5;
          card.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
        });
        card.addEventListener('mouseleave', function () {
          card.style.transform = '';
        });
      })(cards[i]);
    }
  }

  // ==================== 粒子 Canvas 背景（Hero） ====================
  function initParticles() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'particles';
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    hero.insertBefore(canvas, hero.firstChild);

    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 50;
    var w, h;

    function resize() {
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particleCount; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,' + p.alpha + ')';
        ctx.fill();
      }

      // 画连线
      for (var i = 0; i < particleCount; i++) {
        for (var j = i + 1; j < particleCount; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(0,212,255,' + (0.08 * (1 - dist / 100)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    draw();
  }

  // ==================== 激活导航当前页 ====================
  function highlightCurrentNav() {
    var links = document.querySelectorAll('.nav-links a');
    var path = window.location.pathname;
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href && path.indexOf(href.replace(/^\//, '')) !== -1) {
        links[i].classList.add('active');
      } else if (href === 'index.html' && (path === '/' || path.endsWith('/') || path.endsWith('index.html'))) {
        links[i].classList.add('active');
      }
    }
  }

  // ==================== 键盘导航快捷键 ====================
  function initKeyboardNav() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 't' || e.key === 'T') {
        // 按 T 返回顶部
        if (!e.target.closest('input, textarea')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  }

  // ==================== 启动所有功能 ====================
  function init() {
    createBgOrbs();
    initNav();
    initRevealAnimations();
    initBackToTop();
    initSmoothScroll();
    initFaq();
    initStatNumbers();
    initHeroGlow();
    initCardTilt();
    initParticles();
    highlightCurrentNav();
    initKeyboardNav();
  }

  // DOM 就绪后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
