import { isLoggedIn, logout } from "./Auth.js";
import { afficherModale, cacherModale } from "./Modale.js";
import { getWorks, getCategories } from "./apiService.js";

/* =======================
   Variables globales
======================= */
const loginButton = document.getElementById("login-logout");
const editionMode = document.querySelector(".edit-mode");
const filtres = document.querySelector(".filter");
const boutonModifier = document.querySelector(".portfolio-header-modifier");
const overlay = document.querySelector(".overlay");
const closeModale = document.getElementById("close-modale");
const backModale = document.getElementById("back-modale");

let projetsGlobal = [];

/* =======================
   Fonctions récupération
======================= */
async function recupererProjets() {
  const projets = await getWorks();
  projetsGlobal = projets;
  return projets;
}

async function recupererCategories() {
  return await getCategories();
}

/* =======================
   Affichage projets
======================= */
function afficherProjets(projets) {
  const galerie = document.querySelector(".gallery");
  galerie.innerHTML = "";
  projets.forEach((projet) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = projet.imageUrl;
    img.alt = projet.title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = projet.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    galerie.appendChild(figure);
  });
}

/* =======================
   Affichage filtres
======================= */
function afficherFiltres(categories) {
  const boutonTous = creerBoutonFiltre("Tous", "tous", true);
  filtres.appendChild(boutonTous);

  categories.forEach((categorie) => {
    const bouton = creerBoutonFiltre(categorie.name, categorie.id);
    filtres.appendChild(bouton);
  });

  activerFiltres();
}

function creerBoutonFiltre(label, dataId, actif = false) {
  const bouton = document.createElement("button");
  const span = document.createElement("span");
  span.textContent = label;
  bouton.appendChild(span);
  bouton.classList.add("filtres__button");
  if (actif) bouton.classList.add("filtres__button--active");
  bouton.setAttribute("data-id", dataId);
  bouton.setAttribute("id", `bouton-${dataId}`);
  return bouton;
}

function activerFiltres() {
  const boutonsFiltres = document.querySelectorAll(".filtres__button");
  boutonsFiltres.forEach((bouton) => {
    bouton.addEventListener("click", (e) => {
      boutonsFiltres.forEach((b) =>
        b.classList.remove("filtres__button--active")
      );
      e.currentTarget.classList.add("filtres__button--active");
      filtrerProjets(e.currentTarget.getAttribute("data-id"));
    });
  });
}

function filtrerProjets(idCategorie) {
  const projetsFiltres =
    idCategorie === "tous"
      ? projetsGlobal
      : projetsGlobal.filter((p) => p.categoryId == idCategorie);
  afficherProjets(projetsFiltres);
}

/* =======================
   Gestion mode édition
======================= */
function gererModeEdition() {
  if (isLoggedIn()) {
    passerEnModeEdition();
  } else {
    passerEnModeLecture();
  }
}

function passerEnModeEdition() {
  filtres.style.display = "none";
  boutonModifier.style.display = "flex";
  loginButton.textContent = "logout";
  editionMode.style.display = "flex";
}

function passerEnModeLecture() {
  editionMode.style.display = "none";
  filtres.style.display = "flex";
  boutonModifier.style.display = "none";
  loginButton.textContent = "login";
}

/* =======================
   Évènements login/logout
======================= */
loginButton.addEventListener("click", () => {
  if (isLoggedIn()) {
    logout();
    window.location.reload();
  } else {
    window.location.href = "login.html";
  }
});

/* =======================
   Évènements modale
======================= */
boutonModifier.addEventListener("click", () => {
  afficherModale(projetsGlobal, rafraichirProjets);
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) cacherModale();
});

closeModale.addEventListener("click", () => cacherModale());

backModale.addEventListener("click", () => {
  backModale.classList.add("hidden");
  afficherModale(projetsGlobal, rafraichirProjets);
});

/* =======================
   Rafraîchir projets
======================= */
async function rafraichirProjets() {
  const projets = await recupererProjets();
  afficherProjets(projets);
  projetsGlobal = projets;
  return projets;
}

/* =======================
   Initialisation
======================= */
async function init() {
  const projets = await recupererProjets();
  const categories = await recupererCategories();
  afficherProjets(projets);
  afficherFiltres(categories);
  gererModeEdition();
}

init();
