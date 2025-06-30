const BASE_URL = "http://localhost:5678/api";

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response;
}

export async function getWorks() {
  const response = await fetch(`${BASE_URL}/works`);
  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  return response.json();
}

export async function deleteWork(id, token) {
  return fetch(`${BASE_URL}/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createWork(formData, token) {
  return fetch(`${BASE_URL}/works`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
}
