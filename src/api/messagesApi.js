const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function sendMessage({ senderId, recipientId, message }) {
  const res = await fetch(`${BASE}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senderId, recipientId, message })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Uppdaterad för userId
export async function getMessages(userId) {
  const res = await fetch(`${BASE}/messages?userId=${userId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
