/* ======================================================
   CONFIG
   ====================================================== */
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTUz-PAgFnrsYOrAAcuBTU2eQQ-55BMF5sNjFg1ZzPcLDvF-Cj7yc9Sf5tyqBw9-EjC-ULYFf38F9_a/pub?gid=418231519&single=true&output=csv";

let sorties = [];

/* ======================================================
   LOAD CSV (PapaParse)
   ====================================================== */
Papa.parse(CSV_URL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(results) {
    sorties = results.data.map(r => sanitizeSortie(r));
    populateTypeFilter();
    renderSorties(sorties);
  },
  error: function(err){
    console.error("Erreur PapaParse", err);
    document.getElementById("displayArea").innerHTML = "<p style='color:#900'>Erreur de chargement des sorties.</p>";
  }
});

/* clean keys/values */
function sanitizeSortie(r){
  return {
    Titre: (r["Titre"] || "").trim(),
    Distance: (r["Distance"] || "").trim(),
    Photo: (r["Photo illustration"] || "").trim(),
    Type: (r["Type"] || "").trim(),
    Adresse: (r["Adresse"] || "").trim(),
    Animaux: (r["Animaux acceptés"] || "").trim(),
    Avis: (r["Avis"] || "").trim(),
    Horaires: (r["Horaires d’ouverture"] || "").trim(),
    Numero: (r["Numéro de téléphone"] || "").trim(),
    Site: (r["Site web"] || "").trim(),
    AccesPMR: (r["Accès PMR"] || "").trim(),
    Description: (r["Courte présentation"] || "").trim()
  };
}

/* ======================================================
   RENDER
   ====================================================== */
function renderSorties(list){
  const area = document.getElementById("displayArea");
  area.innerHTML = "";
  if(!list.length){
    area.innerHTML = "<p style='text-align:center;color:#666'>Aucune sortie trouvée.</p>";
    return;
  }

  list.forEach((r, idx) => {
    const card = document.createElement("article");
    card.className = "sortie-card";

    const imgHTML = r.Photo
      ? `<img src="${escapeHtml(r.Photo)}" alt="${escapeHtml(r.Titre)}" class="sortie-img" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="no-img">Aucune image</div>`;

    card.innerHTML = `
      ${imgHTML}
      <div class="sortie-content">
        <h2 class="sortie-title">${escapeHtml(r.Titre)}</h2>
        <p><strong>Type :</strong> ${escapeHtml(r.Type)}</p>
        <p><strong>Distance :</strong> ${escapeHtml(r.Distance)} km</p>
        <p><strong>Adresse :</strong> ${escapeHtml(r.Adresse)}</p>
        <p><strong>Animaux :</strong> ${escapeHtml(r.Animaux)}</p>
        <p><strong>Horaires :</strong> ${escapeHtml(r.Horaires)}</p>
        <p><strong>Numéro :</strong> ${escapeHtml(r.Numero)}</p>
        <p><strong>Site :</strong> <a href="${escapeHtml(r.Site)}" target="_blank">${escapeHtml(r.Site)}</a></p>
        <p><strong>Accès PMR :</strong> ${escapeHtml(r.AccesPMR)}</p>
        <p>${nl2br(escapeHtml(r.Description))}</p>
      </div>
    `;
    area.appendChild(card);
  });
}

/* ======================================================
   FILTRE TYPE
   ====================================================== */
function populateTypeFilter(){
  const sel = document.getElementById("filterType");
  const types = Array.from(new Set(sorties.map(r => r.Type).filter(Boolean))).sort();
  types.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  });
}

document.getElementById("filterType").addEventListener("change", (e) => {
  const val = e.target.value;
  if(!val) return renderSorties(sorties);
  renderSorties(sorties.filter(r => r.Type === val));
});

/* ======================================================
   SEARCH
   ====================================================== */
document.getElementById("quickSearch").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = sorties.filter(r => {
    return (r.Titre||"").toLowerCase().includes(q) ||
           (r.Description||"").toLowerCase().includes(q) ||
           (r.Type||"").toLowerCase().includes(q);
  });
  renderSorties(filtered);
});

/* ======================================================
   UTIL
   ====================================================== */
function escapeHtml(s){ if(!s) return ""; return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"); }
function nl2br(s){ return (s||"").replace(/\r\n|\r|\n/g,"<br>"); }
