import { saveToken } from "./Auth.js";

const formultaire = document.querySelector("form");

formultaire.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;

  const password = document.querySelector("#mdp").value;

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
    window.location.href = "../index.html"; // Redirection vers la page d'accueil
  } else {
    document.getElementById("email").style.borderColor = "red";
    document.getElementById("mdp").style.borderColor = "red";
    alert("Identifiants incorrects. Veuillez réessayer.");
  }
});
