import { login } from "./apiService.js";
import { saveToken } from "./Auth.js";

/* Variables */
const formulaire = document.querySelector("form");
const emailInput = document.getElementById("email");
const mdpInput = document.getElementById("mdp");
const errorMessage = document.getElementById("error-message");

/* Fonctions */
function errorMessageDisplay(message = "") {
  errorMessage.textContent = message;
}

function resetInputStyles() {
  emailInput.classList.remove("login-form-false");
  mdpInput.classList.remove("login-form-false");
  errorMessageDisplay();
}

function afficherErreurConnexion() {
  emailInput.classList.add("login-form-false");
  mdpInput.classList.add("login-form-false");
  errorMessageDisplay("Email ou mot de passe incorrect");
}

/* Événements */
emailInput.addEventListener("input", resetInputStyles);
mdpInput.addEventListener("input", resetInputStyles);

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = mdpInput.value;

  const response = await login(email, password);

  if (response.ok) {
    const data = await response.json();
    saveToken(data.token);
    window.location.href = "../index.html";
  } else {
    afficherErreurConnexion();
  }
});
