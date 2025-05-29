import { isLoggedIn, logout } from "./Auth.js";
import {
  afficherModale,
  afficherAjouterPhoto,
  cacherModale,
  afficherAjouterPhotoForm,
} from "./Modale.js";

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

async function recupererCategories() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  return await reponse.json();
}

function afficherFiltres(categories) {
  const boutonTous = document.createElement("button");
  const spanTous = document.createElement("span");
  spanTous.textContent = "Tous";
  boutonTous.appendChild(spanTous);
  boutonTous.classList.add("filtres__button", "filtres__button--active");
  boutonTous.setAttribute("id", "bouton-tous");
  boutonTous.setAttribute("data-id", "tous");
  filtres.appendChild(boutonTous);

  categories.forEach((categorie) => {
    const bouton = document.createElement("button");
    const span = document.createElement("span");
    span.textContent = categorie.name;
    bouton.appendChild(span);
    bouton.classList.add("filtres__button");
    bouton.setAttribute("id", `bouton-${categorie.id}`);
    bouton.setAttribute("data-id", categorie.id);
    filtres.appendChild(bouton);
  });

  const boutonsFiltres = document.querySelectorAll(".filtres__button");
  boutonsFiltres.forEach((bouton) => {
    bouton.addEventListener("click", (e) => {
      boutonsFiltres.forEach((b) =>
        b.classList.remove("filtres__button--active")
      );
      e.currentTarget.classList.add("filtres__button--active");
      const idCategorie = e.currentTarget.getAttribute("data-id");
      const projetsFiltres =
        idCategorie === "tous"
          ? projetsGlobal
          : projetsGlobal.filter((p) => p.categoryId == idCategorie);
      afficherProjets(projetsFiltres);
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
const closeModale = document.getElementById("close-modale");
const backModale = document.getElementById("back-modale");

boutonModifier.addEventListener("click", () =>
  afficherModale(projetsGlobal, rafraichirProjets)
);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) cacherModale();
});
closeModale.addEventListener("click", () => cacherModale());
backModale.addEventListener("click", () => {
  backModale.classList.add("hidden");
  afficherModale(projetsGlobal);
});

async function rafraichirProjets() {
  const projets = await recupererProjets();
  afficherProjets(projets);
  projetsGlobal = projets;
  return projets;
}
