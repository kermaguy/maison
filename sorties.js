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

  list.forEach((r, idx)=>{
    const card = document.createElement("article");
    card.className = "sortie-card";

    const imgHTML = r.Photo
      ? `<img src="${escapeHtml(r.Photo)}" alt="${escapeHtml(r.Titre)}" class="sortie-img" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="no-img">Aucune image</div>`;

    card.innerHTML = `
      ${imgHTML}
      <div class="sortie-content">
        <h2 class="sortie-title">${escapeHtml(r.Titre)}</h2>
        <p class="sortie-sub">Type :</p> <p>${escapeHtml(r.Type)}</p>
        <p class="sortie-sub">Distance :</p> <p>${escapeHtml(r.Distance)} km</p>
        <p class="sortie-sub">Adresse :</p> <p>${escapeHtml(r.Adresse)}</p>
        <p class="sortie-sub">Animaux :</p> <p>${escapeHtml(r.Animaux)}</p>
        <p class="sortie-sub">Horaires :</p> <p>${escapeHtml(r.Horaires)}</p>
        <p class="sortie-sub">Numéro :</p> <p>${escapeHtml(r.Numero)}</p>
        <p class="sortie-sub">Site :</p> <p><a href="${escapeHtml(r.Site)}" target="_blank">${escapeHtml(r.Site)}</a></p>
        <p class="sortie-sub">Accès PMR :</p> <p>${escapeHtml(r.AccesPMR)}</p>
        <p class="sortie-sub">Description :</p> <p>${nl2br(escapeHtml(r.Description))}</p>

        <div class="sortie-buttons">
          <button class="btn-print" onclick="printSortie(${idx})">🖨️ Imprimer</button>
          <button class="btn-whatsapp" onclick="shareWhatsAppSortie(${idx})">📱 WhatsApp</button>
        </div>
      </div>
    `;
    area.appendChild(card);
  });
}

// Fonctions utilitaires
function escapeHtml(s){ if(!s) return ""; return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"); }
function nl2br(s){ return (s||"").replace(/\r\n|\r|\n/g,"<br>"); }

// Imprimer une sortie
function printSortie(idx){
  const r = sorties[idx];
  if(!r) return;
  const win = window.open("", "_blank", "width=800,height=900");
  const html = `
    <html>
      <head>
        <title>${escapeHtml(r.Titre)}</title>
        <style>
          body{ font-family: Georgia, 'Times New Roman', serif; padding:24px; color:#111; }
          h1{ font-size:24px; margin-bottom:8px; }
          img{ max-width:100%; height:auto; border-radius:8px; margin-bottom:12px; }
          h2{ font-size:18px; margin-top:12px; color:#333; }
          p{ white-space:pre-wrap; }
        </style>
      </head>
      <body>
        ${ r.Photo ? `<img src="${escapeHtml(r.Photo)}" alt="">` : '' }
        <h1>${escapeHtml(r.Titre)}</h1>
        <p>${nl2br(escapeHtml(r.Description))}</p>
      </body>
    </html>
  `;
  win.document.write(html);
  win.document.close();
}

// WhatsApp share
function shareWhatsAppSortie(idx){
  const r = sorties[idx];
  if(!r) return;
  const text = `Sortie: ${r.Titre}%0AType: ${r.Type}%0ADistance: ${r.Distance} km%0AAdresse: ${r.Adresse}%0AVoir la page: ${encodeURIComponent(window.location.href)}`;
  const url = `https://wa.me/?text=${text}`;
  window.open(url,'_blank');
}
