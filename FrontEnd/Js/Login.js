import { saveToken } from "./Auth.js";

const formulaire = document.querySelector("form");
const emailInput = document.getElementById("email");
const mdpInput = document.getElementById("mdp");
const errorMessage = document.getElementById("error-message");

function errorMessageDisplay(message) {
  errorMessage.textContent = message;
}
emailInput.addEventListener("input", () => {
  emailInput.classList.remove("login-form-false");
  mdpInput.classList.remove("login-form-false");
  errorMessageDisplay();
});
mdpInput.addEventListener("input", () => {
  mdpInput.classList.remove("login-form-false");
  emailInput.classList.remove("login-form-false");
  errorMessage.textContent = "";
});

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = mdpInput.value;

  const reponse = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (reponse.ok) {
    const data = await reponse.json();
    saveToken(data.token);
    window.location.href = "../index.html";
  } else {
    emailInput.classList.add("login-form-false");
    mdpInput.classList.add("login-form-false");
    errorMessageDisplay("Email ou mot de passe incorrect");
  }
});
