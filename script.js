const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'✕':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));document.getElementById('year').textContent=new Date().getFullYear();

// Carrossel de artes dos campeonatos confirmados.
const CONFIRMED_IMG_IDS = ["4iDcXaW","scMFioT","ottZ3o1","RmhkK2D","mALwmlM","OyRH9vT","MyAxnNa","70patZ9","K7lbF3E","c43xH8K","TADyGwt","rZIZDKl","q6JEE3W","AGgwL04","PxT3Drm","weGMpAR","M9NGPs9","yZMGyEB","33NZuOW","vvPNwYW"];
const confirmedTrack = document.getElementById('confirmed-track');
const confirmedCounter = document.getElementById('confirmed-counter');
if (confirmedTrack) {
  let confirmedIndex = 0;
  let confirmedTargetIndex = 0;
  const imageExtensions = ['.jpg', '.png', '.jpeg', '.webp', '.gif'];
  CONFIRMED_IMG_IDS.forEach((id, index) => {
    const slide = document.createElement('div');
    slide.className = 'confirmed-slide';
    const img = document.createElement('img');
    img.alt = 'Arte do campeonato confirmado ' + (index + 1);
    img.loading = index < 2 ? 'eager' : 'lazy';
    let extensionIndex = 0;
    img.src = 'https://i.imgur.com/' + id + imageExtensions[extensionIndex];
    img.addEventListener('error', function retryImage() {
      extensionIndex += 1;
      if (extensionIndex < imageExtensions.length) {
        img.src = 'https://i.imgur.com/' + id + imageExtensions[extensionIndex];
      } else {
        const fallback = document.createElement('div');
        fallback.className = 'confirmed-fallback';
        fallback.textContent = 'Não foi possível carregar a prévia desta arte.';
        const link = document.createElement('a');
        link.href = 'https://imgur.com/' + id;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'ABRIR IMAGEM NO IMGUR ↗';
        fallback.appendChild(link);
        slide.replaceChildren(fallback);
      }
    });
    slide.appendChild(img);
    confirmedTrack.appendChild(slide);
  });
  const updateConfirmedCounter = () => {
    const slides = Array.from(confirmedTrack.children);
    if (!slides.length) return;
    const center = confirmedTrack.scrollLeft + confirmedTrack.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const currentDistance = Math.abs(center - slideCenter);
      if (currentDistance < distance) { distance = currentDistance; nearest = i; }
    });
    confirmedIndex = nearest;
    confirmedCounter.textContent = String(nearest + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  };
  const goToConfirmed = (index) => {
    const slides = Array.from(confirmedTrack.children);
    if (!slides.length) return;
    confirmedTargetIndex = Math.max(0, Math.min(slides.length - 1, index));
    const slide = slides[confirmedTargetIndex];
    const centeredLeft = slide.offsetLeft + slide.offsetWidth / 2 - confirmedTrack.clientWidth / 2;
    confirmedTrack.scrollTo({
      left: Math.max(0, centeredLeft),
      behavior: 'smooth'
    });
  };
  document.querySelector('.confirmed-prev')?.addEventListener('click', () => {
    goToConfirmed(confirmedTargetIndex - 1);
  });
  document.querySelector('.confirmed-next')?.addEventListener('click', () => {
    goToConfirmed(confirmedTargetIndex + 1);
  });
  confirmedTrack.addEventListener('scroll', updateConfirmedCounter, {passive:true});
  confirmedTrack.addEventListener('scrollend', () => {
    updateConfirmedCounter();
    confirmedTargetIndex = confirmedIndex;
  });
  window.addEventListener('resize', () => {
    goToConfirmed(confirmedTargetIndex);
    updateConfirmedCounter();
  });
  updateConfirmedCounter();
  requestAnimationFrame(() => goToConfirmed(0));
}


// Anima as seções quando entram na tela e exibe a abertura da ON7 uma vez por carregamento.
document.documentElement.classList.add('js-motion');
const revealItems = document.querySelectorAll('.section, .nation-section, .contact');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => {
    item.classList.add('reveal-ready');
    revealObserver.observe(item);
  });
}
const introScreen = document.getElementById('on7-intro-screen');
if (introScreen) {
  const finishIntro = () => introScreen.classList.add('is-done');
  window.setTimeout(finishIntro, 1450);
  introScreen.addEventListener('click', finishIntro, { once: true });
}


// TESTE VISUAL ON7 — cursor circular minimalista para mouse (não aparece em telas touch).
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const on7Cursor = document.createElement('div');
  on7Cursor.className = 'on7-cursor';
  on7Cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(on7Cursor);
  document.documentElement.classList.add('on7-custom-cursor-ready');

  window.addEventListener('pointermove', event => {
    on7Cursor.style.transform = 'translate3d(' + event.clientX + 'px,' + event.clientY + 'px,0) translate(-50%,-50%)';
    on7Cursor.classList.add('is-active');
  }, { passive: true });

  document.addEventListener('pointerover', event => {
    if (event.target.closest('a, button, [role="button"]')) {
      on7Cursor.classList.add('is-hovering');
    }
  });
  document.addEventListener('pointerout', event => {
    if (event.target.closest('a, button, [role="button"]') &&
        !event.relatedTarget?.closest('a, button, [role="button"]')) {
      on7Cursor.classList.remove('is-hovering');
    }
  });
  document.addEventListener('pointerleave', () => on7Cursor.classList.remove('is-active'));
  document.addEventListener('pointerenter', () => on7Cursor.classList.add('is-active'));
}
