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


// Efeitos de cursor e iluminação do mouse removidos.


// Carrossel dos resultados oficiais da Team ON7.
// Para publicar um novo campeonato, adicione um item a RESULTS_DATA com a imagem da tabela.
const RESULTS_DATA = [
  {
    championship: 'COPA BRASIL (CLASSIFICATÓRIA)',
    placement: 1,
    booyahs: 4,
    points: 271,
    kills: 183,
    image: 'https://i.imgur.com/vXgeBHf.jpg',
    source: 'https://imgur.com/vXgeBHf'
  },
  {
    championship: 'COPA AKATSUKI (SEMI FINAL)',
    placement: 1,
    booyahs: 2,
    points: 99,
    kills: 66,
    image: 'https://i.imgur.com/iZdKRMw.png',
    source: 'https://imgur.com/iZdKRMw'
  }
];
const resultsTrack = document.getElementById('results-track');
const resultsCounter = document.getElementById('results-counter');
const resultsPrev = document.querySelector('.results-prev');
const resultsNext = document.querySelector('.results-next');
if (resultsTrack && resultsCounter && resultsPrev && resultsNext) {
  let resultIndex = 0;
  const renderResult = () => {
    if (!RESULTS_DATA.length) {
      resultsCounter.textContent = '0 RESULTADOS';
      resultsPrev.disabled = true;
      resultsNext.disabled = true;
      return;
    }
    const item = RESULTS_DATA[resultIndex];
    const slide = document.createElement('article');
    slide.className = 'results-slide';
    const info = document.createElement('div');
    info.className = 'results-info';
    const camp = document.createElement('div');
    camp.className = 'results-camp';
    camp.textContent = item.championship;
    info.appendChild(camp);
    [['PONTOS', item.points], ['ABATES', item.kills], ...(item.placement != null ? [['COLOCAÇÃO', item.placement]] : []), ...(item.booyahs != null ? [['BOOYAHS', item.booyahs]] : [])].forEach(([label, value]) => {
      const stat = document.createElement('div');
      stat.className = 'results-stat';
      const name = document.createElement('span');
      name.className = 'results-label';
      name.textContent = label;
      const number = document.createElement('strong');
      number.className = 'results-value';
      number.textContent = value;
      stat.append(name, number);
      info.appendChild(stat);
    });
    const image = document.createElement('img');
    image.className = 'results-image';
    image.src = item.image;
    image.alt = 'Tabela de resultados - ' + item.championship;
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      const extensions = ['.png', '.jpeg', '.webp', '.gif'];
      let attempt = 0;
      const tryNext = () => {
        if (attempt < extensions.length) {
          image.src = 'https://i.imgur.com/vXgeBHf' + extensions[attempt++];
        } else {
          const link = document.createElement('a');
          link.href = item.source;
          link.target = '_blank';
          link.rel = 'noopener';
          link.textContent = 'ABRIR COMPROVANTE NO IMGUR ↗';
          link.className = 'results-image-fallback';
          image.replaceWith(link);
        }
      };
      tryNext();
    }, { once: true });
    slide.append(info, image);
    resultsTrack.replaceChildren(slide);
    resultsCounter.textContent = String(resultIndex + 1).padStart(2, '0') + ' / ' + String(RESULTS_DATA.length).padStart(2, '0');
    resultsPrev.disabled = RESULTS_DATA.length < 2;
    resultsNext.disabled = RESULTS_DATA.length < 2;
  };
  resultsPrev.addEventListener('click', () => {
    if (!RESULTS_DATA.length) return;
    resultIndex = (resultIndex - 1 + RESULTS_DATA.length) % RESULTS_DATA.length;
    renderResult();
  });
  resultsNext.addEventListener('click', () => {
    if (!RESULTS_DATA.length) return;
    resultIndex = (resultIndex + 1) % RESULTS_DATA.length;
    renderResult();
  });
  renderResult();
}


// Carrossel de parcerias oficiais da ON7.
// Para adicionar uma parceria, inclua nome, imagem e Instagram neste array.
const PARTNERSHIPS_DATA = [];
const partnershipsTrack = document.getElementById('partnerships-track');
const partnershipsCounter = document.getElementById('partnerships-counter');
const partnershipsPrev = document.querySelector('.partnerships-prev');
const partnershipsNext = document.querySelector('.partnerships-next');
if (partnershipsTrack && partnershipsCounter && partnershipsPrev && partnershipsNext) {
  let partnershipIndex = 0;
  const renderPartnership = () => {
    if (!PARTNERSHIPS_DATA.length) {
      partnershipsTrack.innerHTML = '<div class="partnerships-empty"><span>ON7</span><strong>NOSSAS PARCERIAS</strong><p>Em breve, novidades e parceiros que fazem parte da nossa história!</p></div>';
      partnershipsCounter.textContent = '0 PARCERIAS';
      partnershipsPrev.disabled = true;
      partnershipsNext.disabled = true;
      return;
    }
    const item = PARTNERSHIPS_DATA[partnershipIndex];
    const slide = document.createElement('article');
    slide.className = 'partnerships-slide';
    const imageWrap = document.createElement('div');
    imageWrap.className = 'partnerships-image-wrap';
    const image = document.createElement('img');
    image.className = 'partnerships-image';
    image.src = item.image;
    image.alt = 'Imagem da parceria ' + item.name;
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      const fallback = document.createElement('div');
      fallback.className = 'partnerships-image-fallback';
      fallback.textContent = item.name;
      image.replaceWith(fallback);
    }, { once: true });
    imageWrap.appendChild(image);
    const info = document.createElement('div');
    info.className = 'partnerships-info';
    const message = document.createElement('p');
    message.className = 'partnerships-message';
    message.append('A ON7 em parceria com a: ');
    const partnerName = document.createElement('strong');
    partnerName.textContent = item.name;
    message.appendChild(partnerName);
    const instagram = document.createElement('a');
    instagram.className = 'partnerships-instagram';
    instagram.href = item.instagram;
    instagram.target = '_blank';
    instagram.rel = 'noopener';
    instagram.textContent = 'VER INSTAGRAM DA PARCERIA ↗';
    info.append(message, instagram);
    slide.append(imageWrap, info);
    partnershipsTrack.replaceChildren(slide);
    partnershipsCounter.textContent = String(partnershipIndex + 1).padStart(2, '0') + ' / ' + String(PARTNERSHIPS_DATA.length).padStart(2, '0');
    partnershipsPrev.disabled = PARTNERSHIPS_DATA.length < 2;
    partnershipsNext.disabled = PARTNERSHIPS_DATA.length < 2;
  };
  partnershipsPrev.addEventListener('click', () => {
    if (!PARTNERSHIPS_DATA.length) return;
    partnershipIndex = (partnershipIndex - 1 + PARTNERSHIPS_DATA.length) % PARTNERSHIPS_DATA.length;
    renderPartnership();
  });
  partnershipsNext.addEventListener('click', () => {
    if (!PARTNERSHIPS_DATA.length) return;
    partnershipIndex = (partnershipIndex + 1) % PARTNERSHIPS_DATA.length;
    renderPartnership();
  });
  renderPartnership();
}
