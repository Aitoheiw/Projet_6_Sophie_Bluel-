import { deleteWork, createWork, getCategories } from "./apiService.js";
import { getToken } from "./Auth.js";

/* ========================
   Variables globales
======================== */
const overlay = document.querySelector(".overlay");
const modale = document.querySelector(".modale");
const modaleContent = document.querySelector(".modale-container");
const backModale = document.getElementById("back-modale");
const closeModale = document.getElementById("close-modale");

/* ========================
   Affiche la modale principale
======================== */
export function afficherModale(projetsGlobal, rafraichirProjets) {
  afficherOverlay();
  construireContenuModale();

  const galerieModale = modaleContent.querySelector(".gallery-modale");
  galerieModale.innerHTML = "";

  projetsGlobal.forEach((projet) => {
    const figure = document.createElement("figure");

    const deleteButton = creerBoutonSuppression(
      projet,
      rafraichirProjets,
      projetsGlobal
    );
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
    const uploadBox = afficherAjouterPhoto();
    afficherAjouterPhotoForm(uploadBox, rafraichirProjets);
  });
}

function afficherOverlay() {
  overlay.style.display = "block";
  overlay.classList.remove("hidden");
  backModale.classList.add("hidden");
  closeModale.classList.remove("hidden");
}

function construireContenuModale() {
  modaleContent.innerHTML = `
    <h2>Galerie photo</h2>
    <div class="gallery-modale"></div>
    <button id="modale-btn" class="modale-btn"><span>Ajouter une photo</span></button>
  `;
}

function creerBoutonSuppression(projet, rafraichirProjets, projetsGlobal) {
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

  deleteButton.addEventListener("click", () =>
    gererSuppression(projet, rafraichirProjets)
  );

  return deleteButton;
}

async function gererSuppression(projet, rafraichirProjets) {
  if (!confirmerSuppression()) return;

  try {
    const response = await deleteWork(projet.id, getToken());
    if (response.ok) {
      const projetsMaj = await rafraichirProjets();
      afficherModale(projetsMaj, rafraichirProjets);
    } else {
      alert("Erreur lors de la suppression.");
    }
  } catch (err) {
    console.error("Erreur API :", err);
    alert("Erreur réseau.");
  }
}

function confirmerSuppression() {
  return confirm("Confirmer la suppression de ce projet ?");
}

/* ========================
   Affiche le formulaire d'ajout
======================== */
export function afficherAjouterPhoto() {
  modaleContent.innerHTML = "";

  const uploadBox = document.createElement("div");
  uploadBox.classList.add("upload-box");

  const svgIcon = document.createElement("div");
  svgIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none">
  <path d="M63.5517 15.8879C64.7228 15.8879 65.681 16.8461 65.681 18.0172V60.5768L65.0156 59.7118L46.9165 36.2894C46.3176 35.5042 45.3727 35.0517 44.3879 35.0517C43.4031 35.0517 42.4715 35.5042 41.8594 36.2894L30.8136 50.5824L26.7546 44.8998C26.1557 44.0614 25.1975 43.569 24.1595 43.569C23.1214 43.569 22.1632 44.0614 21.5644 44.9131L10.9178 59.8183L10.319 60.6434V60.6034V18.0172C10.319 16.8461 11.2772 15.8879 12.4483 15.8879H63.5517ZM12.4483 9.5C7.75048 9.5 3.93103 13.3195 3.93103 18.0172V60.6034C3.93103 65.3012 7.75048 69.1207 12.4483 69.1207H63.5517C68.2495 69.1207 72.069 65.3012 72.069 60.6034V18.0172C72.069 13.3195 68.2495 9.5 63.5517 9.5H12.4483ZM23.0948 35.0517C23.9337 35.0517 24.7644 34.8865 25.5394 34.5655C26.3144 34.2444 27.0186 33.7739 27.6118 33.1807C28.2049 32.5876 28.6755 31.8834 28.9965 31.1083C29.3175 30.3333 29.4828 29.5027 29.4828 28.6638C29.4828 27.8249 29.3175 26.9943 28.9965 26.2192C28.6755 25.4442 28.2049 24.74 27.6118 24.1468C27.0186 23.5537 26.3144 23.0831 25.5394 22.7621C24.7644 22.4411 23.9337 22.2759 23.0948 22.2759C22.2559 22.2759 21.4253 22.4411 20.6503 22.7621C19.8752 23.0831 19.171 23.5537 18.5779 24.1468C17.9847 24.74 17.5142 25.4442 17.1931 26.2192C16.8721 26.9943 16.7069 27.8249 16.7069 28.6638C16.7069 29.5027 16.8721 30.3333 17.1931 31.1083C17.5142 31.8834 17.9847 32.5876 18.5779 33.1807C19.171 33.7739 19.8752 34.2444 20.6503 34.5655C21.4253 34.8865 22.2559 35.0517 23.0948 35.0517Z" fill="#B9C5CC"/>
</svg>
  `;
  svgIcon.classList.add("upload-icon");

  const labelImage = document.createElement("label");
  labelImage.setAttribute("for", "file-input");
  labelImage.classList.add("upload-btn");
  labelImage.textContent = "+ Ajouter photo";

  const info = document.createElement("p");
  info.classList.add("upload-info");
  info.textContent = "jpg, png : 4 Mo max";

  uploadBox.append(svgIcon, labelImage, info);
  modaleContent.appendChild(uploadBox);

  return uploadBox;
}

function creerInputFichier(uploadBox, inputTitle, selectCategorie, ajoutBtn) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "file-input";
  fileInput.accept = "image/png, image/jpeg";
  fileInput.hidden = true;

  fileInput.addEventListener("change", () =>
    gererChangementFichier(
      fileInput,
      uploadBox,
      inputTitle,
      selectCategorie,
      ajoutBtn
    )
  );

  return fileInput;
}

function gererChangementFichier(
  fileInput,
  uploadBox,
  inputTitle,
  selectCategorie,
  ajoutBtn
) {
  uploadBox
    .querySelectorAll(".error-message-ajout-projet")
    .forEach((el) => el.remove());

  const fichier = fileInput.files[0];
  if (fichier) {
    const validTypes = ["image/jpeg", "image/png"];
    const tailleOK = fichier.size <= 4 * 1024 * 1024;

    if (!validTypes.includes(fichier.type)) {
      afficherErreur(
        uploadBox,
        "Seuls les fichiers JPG ou PNG sont autorisés."
      );
      fileInput.value = "";
      checkFormValidity(fileInput, inputTitle, selectCategorie, ajoutBtn);
      return;
    }
    if (!tailleOK) {
      afficherErreur(uploadBox, "La taille maximale est de 4 Mo.");
      fileInput.value = "";
      checkFormValidity(fileInput, inputTitle, selectCategorie, ajoutBtn);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImg = document.createElement("img");
      previewImg.src = e.target.result;
      previewImg.classList.add("preview-img");
      uploadBox.innerHTML = "";
      uploadBox.appendChild(previewImg);
    };
    reader.readAsDataURL(fichier);
  }
  checkFormValidity(fileInput, inputTitle, selectCategorie, ajoutBtn);
}

function afficherErreur(parent, message) {
  const err = document.createElement("p");
  err.classList.add("error-message-ajout-projet");
  err.textContent = message;
  parent.appendChild(err);
}
/* ========================
   Formulaire d'ajout complet
======================== */
export async function afficherAjouterPhotoForm(uploadBox, rafraichirProjets) {
  const modaleContent = document.querySelector(".modale-container");
  const modaleForm = document.createElement("form");

  // Création du titre
  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "title");
  labelTitle.textContent = "Titre";

  const inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.name = "title";
  inputTitle.id = "title";

  // Création des catégories
  const labelCategorie = document.createElement("label");
  labelCategorie.setAttribute("for", "categorie");
  labelCategorie.textContent = "Catégorie";
  labelCategorie.id = "label-categorie";

  const selectCategorie = await creerSelectCategorie();

  // Création du bouton
  const ajoutBtn = document.createElement("button");
  ajoutBtn.type = "submit";
  ajoutBtn.id = "ajout-btn";
  ajoutBtn.classList.add("modale-btn");
  ajoutBtn.textContent = "Valider";
  ajoutBtn.disabled = true;

  const fileInput = creerInputFichier(
    uploadBox,
    inputTitle,
    selectCategorie,
    ajoutBtn
  );

  uploadBox.appendChild(fileInput);

  // Ajout des écouteurs
  fileInput.addEventListener("change", () =>
    checkFormValidity(fileInput, inputTitle, selectCategorie, ajoutBtn)
  );
  inputTitle.addEventListener("input", () =>
    checkFormValidity(fileInput, inputTitle, selectCategorie, ajoutBtn)
  );
  selectCategorie.addEventListener("change", () =>
    checkFormValidity(fileInput, inputTitle, selectCategorie, ajoutBtn)
  );

  ajoutBtn.addEventListener("click", async (e) =>
    gererValidationAjout(
      e,
      modaleForm,
      inputTitle,
      selectCategorie,
      fileInput,
      ajoutBtn,
      rafraichirProjets
    )
  );

  modaleForm.append(
    labelTitle,
    inputTitle,
    labelCategorie,
    selectCategorie,
    ajoutBtn
  );
  modaleContent.appendChild(modaleForm);
}
function checkFormValidity(fileInput, inputTitle, selectCategorie, ajoutBtn) {
  const titre = inputTitle.value.trim();
  const cat = selectCategorie.value;
  const imgOK =
    fileInput.files[0] &&
    ["image/jpeg", "image/png"].includes(fileInput.files[0].type) &&
    fileInput.files[0].size <= 4 * 1024 * 1024;

  if (titre && cat && imgOK) {
    ajoutBtn.disabled = false;
    ajoutBtn.classList.add("btn-valide");
  } else {
    ajoutBtn.disabled = true;
    ajoutBtn.classList.remove("btn-valide");
  }
}

async function creerSelectCategorie() {
  const select = document.createElement("select");
  select.name = "categorie";
  select.id = "categorie";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  select.appendChild(defaultOption);

  try {
    const categories = await getCategories();
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch {
    const errorOpt = document.createElement("option");
    errorOpt.value = "";
    errorOpt.textContent = "Erreur de chargement";
    select.appendChild(errorOpt);
  }

  return select;
}

async function gererValidationAjout(
  e,
  modaleForm,
  inputTitle,
  selectCategorie,
  fileInput,
  ajoutBtn,
  rafraichirProjets
) {
  e.preventDefault();

  modaleForm
    .querySelectorAll(".error-message-ajout-projet")
    .forEach((el) => el.remove());

  const titre = inputTitle.value.trim();
  const catId = selectCategorie.value;
  const image = fileInput.files[0];

  let hasError = false;

  if (!image) {
    afficherErreur(fileInput.parentElement, "Veuillez ajouter une image.");
    hasError = true;
  }
  if (!titre) {
    afficherErreur(inputTitle, "Veuillez saisir un titre.");
    hasError = true;
  }
  if (!catId) {
    afficherErreur(selectCategorie, "Veuillez choisir une catégorie.");
    hasError = true;
  }

  if (hasError) return;

  const formData = new FormData();
  formData.append("title", titre);
  formData.append("category", catId);
  formData.append("image", image);

  try {
    const response = await createWork(formData, getToken());
    if (response.ok) {
      cacherModale();
      await rafraichirProjets();
    } else {
      console.error("Erreur lors de l'ajout.");
    }
  } catch (err) {
    console.error(err);
  }
}

/* ========================
   Cacher la modale
======================== */
export function cacherModale() {
  overlay.style.display = "none";
  modale.style.display = "none";
}
