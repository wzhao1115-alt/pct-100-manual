/**
 * PCT-100 产品说明书网站 — 共用交互脚本
 */
(function () {
  'use strict';

  // ========== 移动端导航菜单切换 ==========
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
    });

    // 点击导航链接后自动关闭菜单
    var links = navLinks.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    }

    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ========== FAQ 折叠/展开 ==========
  var faqItems = document.querySelectorAll('.faq-item');
  for (var j = 0; j < faqItems.length; j++) {
    (function (item) {
      var question = item.querySelector('.faq-q');
      if (!question) return;

      question.addEventListener('click', function () {
        // 关闭其他已打开的 FAQ
        var allOpen = document.querySelectorAll('.faq-item.open');
        for (var k = 0; k < allOpen.length; k++) {
          if (allOpen[k] !== item) {
            allOpen[k].classList.remove('open');
          }
        }
        // 切换当前项
        item.classList.toggle('open');
      });
    })(faqItems[j]);
  }

  // ========== 平滑滚动（导航锚点） ==========
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  for (var m = 0; m < anchorLinks.length; m++) {
    anchorLinks[m].addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').substring(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ========== 导航栏滚动阴影 ==========
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,.08)';
          } else {
            navbar.style.boxShadow = '';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
})();
