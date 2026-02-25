// ─── LOADER ───
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 800);
});

// ─── NAVBAR ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── HAMBURGER MENU ───
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// ─── ACTIVE NAV ───
const setActiveNav = () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
};
setActiveNav();

// ─── SCROLL ANIMATIONS ───
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up, .fade-in').forEach((el, i) => {
  observer.observe(el);
});

// Stagger children
document.querySelectorAll('.stagger-children').forEach(parent => {
  parent.children && [...parent.children].forEach((child, i) => {
    child.classList.add('fade-up');
    child.dataset.delay = i * 100;
    observer.observe(child);
  });
});

// ─── BACK TO TOP ───
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── FORM VALIDATION ───
const validateForm = (form) => {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group');
    if (!field.value.trim()) {
      group.classList.add('error');
      group.querySelector('.form-error').textContent = 'Field ini wajib diisi.';
      valid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      group.classList.add('error');
      group.querySelector('.form-error').textContent = 'Format email tidak valid.';
      valid = false;
    } else {
      group.classList.remove('error');
    }
  });
  return valid;
};

document.querySelectorAll('form').forEach(form => {
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (field.value.trim()) group.classList.remove('error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      const success = form.querySelector('.form-success');
      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Mengirim...';
      btn.disabled = true;
      setTimeout(() => {
        if (success) {
          success.style.display = 'block';
          success.innerHTML = '✅ Pesan Anda telah berhasil dikirim! Tim kami akan menghubungi Anda dalam 1×24 jam kerja.';
        }
        form.reset();
        btn.textContent = 'Kirim Pesan';
        btn.disabled = false;
        setTimeout(() => { if (success) success.style.display = 'none'; }, 6000);
      }, 1500);
    }
  });
});

// ─── COUNTER ANIMATION ───
const animateCounter = (el, target, suffix = '') => {
  let start = 0;
  const duration = 2000;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      const target = parseInt(entry.target.dataset.count);
      const suffix = entry.target.dataset.suffix || '';
      animateCounter(entry.target, target, suffix);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
