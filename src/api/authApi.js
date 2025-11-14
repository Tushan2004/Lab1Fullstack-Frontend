const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function register({ email, password, role, firstName, lastName }) {
  const res = await fetch(`${BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role, firstName, lastName }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Registration failed"));
  return res.json();             // expect a user object back
}

export async function login({ email, password }) {
  const res = await fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Login failed"));
  return res.json();             // expect a user object back
}