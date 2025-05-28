import { isLoggedIn, logout } from "./Auth.js";

const loginButton = document.getElementById("login-logout");
const editionMode = document.querySelector(".edit-mode");

let projetsGlobal = [];
let filtres = document.querySelector(".filter");
const boutonModifier = document.querySelector(".portfolio-header-modifier");

async function recupererProjets() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const projets = await reponse.json();
  projetsGlobal = projets;
  return projets;
}

function afficherProjets(projets) {
  const galerie = document.querySelector(".gallery");
  galerie.innerHTML = "";

  for (let i = 0; i < projets.length; i++) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = projets[i].imageUrl;
    img.alt = projets[i].title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = projets[i].title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    galerie.appendChild(figure);
  }
}

async function recupererCategories() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  const categories = await reponse.json();
  return categories;
}

function afficherFiltres(categories) {
  const filtres = document.querySelector(".filter");

  const boutonTous = document.createElement("button");
  const spanTous = document.createElement("span");
  spanTous.textContent = "Tous";
  boutonTous.appendChild(spanTous);
  boutonTous.classList.add("filtres__button", "filtres__button--active");
  boutonTous.setAttribute("id", "bouton-tous");
  boutonTous.setAttribute("data-id", "tous");
  filtres.appendChild(boutonTous);

  for (let i = 0; i < categories.length; i++) {
    const bouton = document.createElement("button");
    const span = document.createElement("span");
    span.textContent = categories[i].name;
    bouton.appendChild(span);
    bouton.classList.add("filtres__button");
    bouton.setAttribute("id", `bouton-${categories[i].id}`);
    bouton.setAttribute("data-id", categories[i].id);
    filtres.appendChild(bouton);
  }

  const boutonsFiltres = document.querySelectorAll(".filtres__button");

  boutonsFiltres.forEach((bouton) => {
    bouton.addEventListener("click", (e) => {
      boutonsFiltres.forEach((b) =>
        b.classList.remove("filtres__button--active")
      );
      e.currentTarget.classList.add("filtres__button--active");

      const idCategorie = e.currentTarget.getAttribute("data-id");

      if (idCategorie === "tous") {
        afficherProjets(projetsGlobal);
      } else {
        const projetsFiltres = projetsGlobal.filter(
          (projet) => projet.categoryId == idCategorie
        );
        afficherProjets(projetsFiltres);
      }
    });
  });
}

async function init() {
  const projets = await recupererProjets();
  const categories = await recupererCategories();
  afficherProjets(projets);
  afficherFiltres(categories);
}
init();

if (isLoggedIn()) {
  filtres.style.display = "none";
  boutonModifier.style.display = "flex";
  loginButton.textContent = "logout";
  editionMode.style.display = "flex";
} else {
  editionMode.style.display = "none";
  filtres.style.display = "flex";
  boutonModifier.style.display = "none";
  loginButton.textContent = "login";
}

loginButton.addEventListener("click", () => {
  if (isLoggedIn()) {
    logout();
    window.location.reload();
  } else {
    window.location.href = "login.html";
  }
});

const overlay = document.querySelector(".overlay");
const modale = document.querySelector(".modale");
const modaleContent = document.querySelector(".modale-container");
const backModale = document.getElementById("back-modale");
const closeModale = document.getElementById("close-modale");
function afficherModale() {
  overlay.style.display = "block";
  overlay.classList.remove("hidden");
  backModale.classList.add("hidden");
  closeModale.classList.remove("hidden");

  // On insère juste la structure de la modale
  modaleContent.innerHTML = `
    <h2>Galerie photo</h2>
    <div class="gallery-modale"></div>
    <button id="modale-btn" class="modale-btn"><span>Ajouter une photo</span></button>
  `;

  // Puis on insère les projets dans la div
  const galerieModale = modaleContent.querySelector(".gallery-modale");

  galerieModale.innerHTML = ""; // pour être propre

  projetsGlobal.forEach((projet) => {
    const figure = document.createElement("figure");

    // Création de l'icône SVG
    const deleteButton = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    deleteButton.setAttribute("width", "9");
    deleteButton.setAttribute("height", "11");
    deleteButton.setAttribute("viewBox", "0 0 9 11");
    deleteButton.setAttribute("fill", "none");
    deleteButton.classList.add("delete-icon");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z"
    );
    path.setAttribute("fill", "white");
    deleteButton.appendChild(path);

    // Ajout du comportement de suppression
    deleteButton.addEventListener("click", () => {
      figure.remove(); // supprime juste du DOM, pas de l'API
    });

    const img = document.createElement("img");
    img.src = projet.imageUrl;
    img.alt = projet.title;

    figure.appendChild(deleteButton);
    figure.appendChild(img);
    galerieModale.appendChild(figure);
  });

  modale.style.display = "flex";

  const modaleBtn = document.getElementById("modale-btn");
  modaleBtn.addEventListener("click", () => {
    backModale.classList.remove("hidden");
    afficherAjouterPhoto();
  });
}

function afficherAjouterPhoto() {
  modaleContent.innerHTML = ""; // reset propre

  const uploadBox = document.createElement("div");
  uploadBox.classList.add("upload-box");

  // ⬇️ Création du SVG directement en innerHTML
  const svgIcon = document.createElement("div");
  svgIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none">
  <path d="M63.5517 15.8879C64.7228 15.8879 65.681 16.8461 65.681 18.0172V60.5768L65.0156 59.7118L46.9165 36.2894C46.3176 35.5042 45.3727 35.0517 44.3879 35.0517C43.4031 35.0517 42.4715 35.5042 41.8594 36.2894L30.8136 50.5824L26.7546 44.8998C26.1557 44.0614 25.1975 43.569 24.1595 43.569C23.1214 43.569 22.1632 44.0614 21.5644 44.9131L10.9178 59.8183L10.319 60.6434V60.6034V18.0172C10.319 16.8461 11.2772 15.8879 12.4483 15.8879H63.5517ZM12.4483 9.5C7.75048 9.5 3.93103 13.3195 3.93103 18.0172V60.6034C3.93103 65.3012 7.75048 69.1207 12.4483 69.1207H63.5517C68.2495 69.1207 72.069 65.3012 72.069 60.6034V18.0172C72.069 13.3195 68.2495 9.5 63.5517 9.5H12.4483ZM23.0948 35.0517C23.9337 35.0517 24.7644 34.8865 25.5394 34.5655C26.3144 34.2444 27.0186 33.7739 27.6118 33.1807C28.2049 32.5876 28.6755 31.8834 28.9965 31.1083C29.3175 30.3333 29.4828 29.5027 29.4828 28.6638C29.4828 27.8249 29.3175 26.9943 28.9965 26.2192C28.6755 25.4442 28.2049 24.74 27.6118 24.1468C27.0186 23.5537 26.3144 23.0831 25.5394 22.7621C24.7644 22.4411 23.9337 22.2759 23.0948 22.2759C22.2559 22.2759 21.4253 22.4411 20.6503 22.7621C19.8752 23.0831 19.171 23.5537 18.5779 24.1468C17.9847 24.74 17.5142 25.4442 17.1931 26.2192C16.8721 26.9943 16.7069 27.8249 16.7069 28.6638C16.7069 29.5027 16.8721 30.3333 17.1931 31.1083C17.5142 31.8834 17.9847 32.5876 18.5779 33.1807C19.171 33.7739 19.8752 34.2444 20.6503 34.5655C21.4253 34.8865 22.2559 35.0517 23.0948 35.0517Z" fill="#B9C5CC"/>
</svg>
  `;
  svgIcon.classList.add("upload-icon");

  // Input et bouton
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "file-input";
  fileInput.accept = "image/png, image/jpeg";
  fileInput.hidden = true;

  const labelImage = document.createElement("label");
  labelImage.setAttribute("for", "file-input");
  labelImage.classList.add("upload-btn");
  labelImage.textContent = "+ Ajouter photo";

  const info = document.createElement("p");
  info.classList.add("upload-info");
  info.textContent = "jpg, png : 4mo max";

  // Ajout au bloc
  uploadBox.appendChild(svgIcon);
  uploadBox.appendChild(labelImage);
  uploadBox.appendChild(fileInput);
  uploadBox.appendChild(info);

  // Ajout à la modale
  modaleContent.appendChild(uploadBox);
}
function cacherModale() {
  overlay.style.display = "none";
  modale.style.display = "none";
}

boutonModifier.addEventListener("click", () => {
  afficherModale();
});
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    cacherModale();
  }
});
closeModale.addEventListener("click", () => {
  cacherModale();
});

backModale.addEventListener("click", () => {
  backModale.classList.add("hidden");
  afficherModale();
});
