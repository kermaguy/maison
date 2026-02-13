// Gestion présence
function markPresence(status) {
  const log = document.getElementById('presence-log');
  const now = new Date().toLocaleString();
  const msg = status === 'serai' ? `Je serai présent à ${now} 🕒` : `Je suis présent à ${now} ✅`;
  const p = document.createElement('p');
  p.textContent = msg;
  log.appendChild(p);
}

// Données de test pour les sections
const reminders = [
  { text: 'Sortir la poubelle 🗑️ (recyclable) - Lundi' },
  { text: 'Arroser les plantes 🌱 - Tous les jours' }
];

const outings = [
  { text: 'Musée du Louvre 🖼️ - Paris, site web: https://www.louvre.fr, 📍48.8606,2.3376' },
  { text: 'Randonnée accessible 🚶‍♂️ - Parc National, itinéraire facile' }
];

const tasks = [
  { text: 'Réparer la porte du garage 🚪' },
  { text: 'Peindre le mur de la cuisine 🎨' }
];

const garden = [
  { text: 'Planter tomates 🍅 - Mars' },
  { text: 'Tailler rosiers 🌹 - Novembre' }
];

const shopping = [
  { text: 'Ampoules 💡' },
  { text: 'Papier WC 🧻' },
  { text: 'Charbon de bois 🔥' }
];

const info = [
  { text: 'Médecin 🏥: Dr Martin - 06 12 34 56 78' },
  { text: 'Vétérinaire 🐶: Clinique Vet - 01 23 45 67 89' },
  { text: 'Garage 🚗: Garage Auto - 09 87 65 43 21' }
];

// Fonction d'affichage
function populateList(listId, items) {
  const ul = document.getElementById(listId);
  items.forEach(i => {
    const li = document.createElement('li');
    li.textContent = i.text;
    ul.appendChild(li);
  });
}

populateList('reminder-list', reminders);
populateList('outing-list', outings);
populateList('tasks-list', tasks);
populateList('garden-list', garden);
populateList('shopping-list', shopping);
populateList('info-list', info);

// PWA install prompt (optionnel)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(() => {
    console.log('Service Worker enregistré ✅');
  });
}
