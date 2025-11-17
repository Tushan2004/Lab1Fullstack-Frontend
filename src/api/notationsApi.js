const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function sendNotation({senderId, recipientId, notation, diagnosis}) {
  const res = await fetch(`${BASE}/notations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senderId, recipientId, notation, diagnosis })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getNotations(userEmail) {
  const res = await fetch(`${BASE}/notations?userEmail=${encodeURIComponent(userEmail)}`);
  if (!res.ok) throw new Error("Failed to fetch notations");
  return res.json();
}