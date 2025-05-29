export function afficherModale(projetsGlobal, rafraichirProjets) {
  const overlay = document.querySelector(".overlay");
  const modale = document.querySelector(".modale");
  const modaleContent = document.querySelector(".modale-container");
  const backModale = document.getElementById("back-modale");
  const closeModale = document.getElementById("close-modale");

  overlay.style.display = "block";
  overlay.classList.remove("hidden");
  backModale.classList.add("hidden");
  closeModale.classList.remove("hidden");

  modaleContent.innerHTML = `
    <h2>Galerie photo</h2>
    <div class="gallery-modale"></div>
    <button id="modale-btn" class="modale-btn"><span>Ajouter une photo</span></button>
  `;

  const galerieModale = modaleContent.querySelector(".gallery-modale");
  galerieModale.innerHTML = "";

  projetsGlobal.forEach((projet) => {
    const figure = document.createElement("figure");

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

    deleteButton.addEventListener("click", async () => {
      const confirmSuppression = confirm(
        "Confirmer la suppression de cette image ?"
      );
      if (!confirmSuppression) return;

      try {
        const reponse = await fetch(
          `http://localhost:5678/api/works/${projet.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (reponse.ok) {
          console.log(`Projet ${projet.id} supprimé`);
          const projetsMaj = await rafraichirProjets(); // 🔁 données fraîches
          afficherModale(projetsMaj, rafraichirProjets, projetsGlobal); // 🔁 recharge visuelle modale
        } else {
          alert("Erreur lors de la suppression.");
        }
      } catch (err) {
        console.error("Erreur API :", err);
        alert("Erreur réseau.");
      }
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
    const fileInput = document.getElementById("file-input");
    afficherAjouterPhotoForm(fileInput, rafraichirProjets);
  });
}

export function afficherAjouterPhoto() {
  const modaleContent = document.querySelector(".modale-container");
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

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "file-input";
  fileInput.accept = "image/png, image/jpeg";
  fileInput.hidden = true;
  fileInput.addEventListener("change", () => {
    const fichier = fileInput.files[0];

    if (fichier) {
      const reader = new FileReader();

      reader.onload = (e) => {
        // Créer l'image de preview
        const previewImg = document.createElement("img");
        previewImg.src = e.target.result;
        previewImg.classList.add("preview-img");

        // Nettoyer l'uploadBox
        uploadBox.innerHTML = "";
        uploadBox.appendChild(previewImg);
      };

      reader.readAsDataURL(fichier);
    }
  });

  const labelImage = document.createElement("label");
  labelImage.setAttribute("for", "file-input");
  labelImage.classList.add("upload-btn");
  labelImage.textContent = "+ Ajouter photo";

  const info = document.createElement("p");
  info.classList.add("upload-info");
  info.textContent = "jpg, png : 4mo max";

  uploadBox.appendChild(svgIcon);
  uploadBox.appendChild(labelImage);
  uploadBox.appendChild(fileInput);
  uploadBox.appendChild(info);
  modaleContent.appendChild(uploadBox);
  return fileInput;
}
export async function afficherAjouterPhotoForm(fileInput, rafraichirProjets) {
  const modaleContent = document.querySelector(".modale-container");

  const modaleForm = document.createElement("form");

  // Label et champ Titre
  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "title");
  labelTitle.textContent = "Titre";

  const inputTitle = document.createElement("input");
  inputTitle.setAttribute("type", "text");
  inputTitle.setAttribute("name", "title");
  inputTitle.setAttribute("id", "title");

  // Label et select pour Catégories
  const labelCategorie = document.createElement("label");
  labelCategorie.setAttribute("for", "categorie");
  labelCategorie.textContent = "Catégorie";
  labelCategorie.setAttribute("id", "label-categorie");

  const selectCategorie = document.createElement("select");
  selectCategorie.setAttribute("name", "categorie");
  selectCategorie.setAttribute("id", "categorie");

  // Option par défaut
  const defaultOption = document.createElement("option");
  defaultOption.value = "";

  selectCategorie.appendChild(defaultOption);

  // 🔽 Appel API pour les catégories
  try {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    categories.forEach((categorie) => {
      const option = document.createElement("option");
      option.value = categorie.id;
      option.textContent = categorie.name;
      selectCategorie.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories :", error);
    const errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Erreur de chargement";
    selectCategorie.appendChild(errorOption);
  }

  const ajoutBtn = document.createElement("button");
  ajoutBtn.setAttribute("type", "submit");
  ajoutBtn.setAttribute("id", "ajout-btn");
  ajoutBtn.classList.add("modale-btn");
  ajoutBtn.textContent = "Valider";

  // Ajout des éléments au formulaire
  modaleForm.appendChild(labelTitle);
  modaleForm.appendChild(inputTitle);
  modaleForm.appendChild(labelCategorie);
  modaleForm.appendChild(selectCategorie);
  modaleForm.appendChild(ajoutBtn);

  // Ajout à la modale
  modaleContent.appendChild(modaleForm);

  ajoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const titre = inputTitle.value.trim();
    const categorieId = selectCategorie.value;
    const image = fileInput?.files[0]; // ✅ sécurité en plus

    if (!titre || !categorieId || !image) {
      alert("Tous les champs doivent être remplis.");
      return;
    }

    const formData = new FormData();
    formData.append("title", titre);
    formData.append("category", categorieId);
    formData.append("image", image);

    try {
      const reponse = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (reponse.ok) {
        console.log("Photo ajoutée avec succès");
        cacherModale();
        await rafraichirProjets();
      } else {
        console.error("Erreur lors de l'ajout de la photo");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo :", error);
    }
  });
}

export function cacherModale() {
  const overlay = document.querySelector(".overlay");
  const modale = document.querySelector(".modale");
  overlay.style.display = "none";
  modale.style.display = "none";
}
