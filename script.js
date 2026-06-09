/* DANE ARTYKUŁÓW */
const articlesData = [
  {
    id: 0,
    title: "AI Outsourcing",
    desc: "Scale engineering teams faster with AI.",
    img: "https://picsum.photos/600/300?1",
    fullText: "Sztuczna inteligencja rewolucjonizuje podejście do outsourcingu technologicznego. Dzięki automatyzacji powtarzalnych zadań, zespoły mogą skupić się na architekturze i logice biznesowej. Współpraca z programistami AI pozwala na redukcję kosztów operacyjnych nawet o 40% oraz skraca czas wdrożenia produktu na rynek."
  },
  {
    id: 1,
    title: "DevOps Trends",
    desc: "Kubernetes and automation dominate.",
    img: "https://picsum.photos/600/300?2",
    fullText: "Konteneryzacja i GitOps to obecnie fundamenty nowoczesnej infrastruktury. W 2026 roku widzimy jeszcze większy nacisk na bezpieczeństwo automatyzacji (DevSecOps) oraz optymalizację kosztów chmurowych za pomocą sztucznej inteligencji, która przewiduje zapotrzebowanie na zasoby maszynowe."
  },
  {
    id: 2,
    title: "Remote Teams",
    desc: "Global talent access and flexibility.",
    img: "https://picsum.photos/600/300?3",
    fullText: "Zarządzanie rozproszonymi zespołami inżynierskimi wymaga odpowiednich narzędzi i kultury organizacyjnej. Dostęp do globalnej puli talentów pozwala firmom budować zespoły niezależnie od barier geograficznych. Kluczem do sukcesu staje się asynchroniczna komunikacja."
  }
];

let currentArticleId = null;

/* LOGIKA HAMBURGERA */
const hamburger = document.querySelector('.hamburger');
const navList = document.getElementById('dropdown-menu');

hamburger.onclick = (e) => {
  e.stopPropagation();
  navList.classList.toggle('active');
};

document.onclick = () => {
  navList.classList.remove('active');
};

/* DARK MODE */
const root = document.documentElement;
const themeBtn = document.querySelector('.theme-btn');

if (localStorage.getItem('theme') === 'dark') {
  root.setAttribute('data-theme', 'dark');
  themeBtn.textContent = 'Light';
}

themeBtn.onclick = () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    themeBtn.textContent = 'Dark';
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeBtn.textContent = 'Light';
  }
};

/* NAWIGACJA WIDOKAMI */
const mainView = document.getElementById('main-view');
const articleView = document.getElementById('article-view');
const singleArticleContent = document.getElementById('single-article-content');

function showHome() {
  articleView.classList.remove('active');
  mainView.style.display = 'grid';
  currentArticleId = null;
  navList.classList.remove('active');
  window.scrollTo(0, 0);
}

function showArticle(id) {
  currentArticleId = id;
  const art = articlesData.find(a => a.id === id);
  
  singleArticleContent.innerHTML = `
    <img src="${art.img}" alt="${art.title}">
    <h2>${art.title}</h2>
    <p><strong>Podsumowanie:</strong> ${art.desc}</p>
    <p>${art.fullText}</p>
  `;
  
  mainView.style.display = 'none';
  articleView.classList.add('active');
  navList.classList.remove('active');
  window.scrollTo(0, 0);
  renderComments();
}

document.getElementById('back-btn').onclick = showHome;
document.getElementById('logo-home').onclick = (e) => { e.preventDefault(); showHome(); };
document.getElementById('nav-home').onclick = (e) => { e.preventDefault(); showHome(); };
document.getElementById('nav-articles').onclick = (e) => { 
  e.preventDefault(); 
  showHome();
  document.getElementById('articles-container').scrollIntoView({ behavior: 'smooth' });
};
document.getElementById('nav-tech').onclick = (e) => { 
  e.preventDefault(); 
  showHome();
  document.getElementById('tech-sidebar').scrollIntoView({ behavior: 'smooth' });
};

/* GENEROWANIE KART (CRUD - Read) */
const cardsGrid = document.getElementById('cards-grid');

function renderCards() {
  cardsGrid.innerHTML = '';
  articlesData.forEach(art => {
    const articleTag = document.createElement('article');
    articleTag.className = 'card';
    articleTag.innerHTML = `
      <img src="${art.img}" alt="${art.title}">
      <h3>${art.title}</h3>
      <p>${art.desc}</p>
    `;
    articleTag.onclick = () => showArticle(art.id);
    cardsGrid.appendChild(articleTag);
  });
}

renderCards();

/* KOMENTARZE (CRUD) */
let comments = JSON.parse(localStorage.getItem('project_comments')) || [];
const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');

function renderComments() {
  commentsList.innerHTML = '';
  const filtered = comments.filter(c => c.articleId === currentArticleId);
  
  if(filtered.length === 0) {
    commentsList.innerHTML = '<p style="color:gray; padding: 10px 0;">Brak komentarzy pod tym artykułem. Napisz pierwszy!</p>';
    return;
  }

  filtered.forEach((c) => {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <strong>${escapeHTML(c.name)}</strong> <span style="color:var(--primary)">(${c.rating}/10)</span><br>
      <p style="margin: 5px 0;">${escapeHTML(c.text)}</p>
      <button class="delete-btn" onclick="deleteComment('${c.id}')">Usuń komentarz</button>
    `;
    commentsList.appendChild(div);
  });
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* DODAWANIE KOMENTARZA (CRUD - Create) */
commentForm.onsubmit = (e) => {
  e.preventDefault();
  
  const newComment = {
    id: Date.now().toString(),
    articleId: currentArticleId,
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    rating: document.getElementById('rating').value,
    text: document.getElementById('text').value
  };

  comments.push(newComment);
  localStorage.setItem('project_comments', JSON.stringify(comments));
  commentForm.reset();
  renderComments();
};

/* USUWANIE KOMENTARZA (CRUD - Delete) */
window.deleteComment = (id) => {
  comments = comments.filter(c => c.id !== id);
  localStorage.setItem('project_comments', JSON.stringify(comments));
  renderComments();
};

/* OBSERVER ANIMACJI KART */
const cards = document.querySelectorAll('.card');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.1 });

cards.forEach(c => observer.observe(c));