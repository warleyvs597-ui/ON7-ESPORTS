const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'✕':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));document.getElementById('year').textContent=new Date().getFullYear();

// Carrossel de artes dos campeonatos confirmados.
const CONFIRMED_IMG_IDS = ["4iDcXaW","scMFioT","ottZ3o1","RmhkK2D","mALwmlM","OyRH9vT","MyAxnNa","70patZ9","K7lbF3E","c43xH8K","TADyGwt","rZIZDKl","q6JEE3W","AGgwL04","PxT3Drm","weGMpAR","M9NGPs9"];
const confirmedTrack = document.getElementById('confirmed-track');
const confirmedCounter = document.getElementById('confirmed-counter');
if (confirmedTrack) {
  let confirmedIndex = 0;
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
  document.querySelector('.confirmed-prev')?.addEventListener('click', () => {
    confirmedTrack.scrollBy({left: -confirmedTrack.clientWidth * 0.82, behavior: 'smooth'});
  });
  document.querySelector('.confirmed-next')?.addEventListener('click', () => {
    confirmedTrack.scrollBy({left: confirmedTrack.clientWidth * 0.82, behavior: 'smooth'});
  });
  confirmedTrack.addEventListener('scroll', updateConfirmedCounter, {passive:true});
  window.addEventListener('resize', updateConfirmedCounter);
  updateConfirmedCounter();
}
