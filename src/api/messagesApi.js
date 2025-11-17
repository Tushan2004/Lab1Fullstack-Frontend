const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// Skicka nytt meddelande eller svar
export async function sendMessage({ senderId, recipientId, message, parentId = null }) {
  const res = await fetch(`${BASE}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senderId, recipientId, message, parentId })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Hämta alla meddelanden för en användare
export async function getMessages(userId) {
  const res = await fetch(`${BASE}/messages?userId=${userId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Hämta svarstrådar för ett meddelande
export async function getReplies(parentId) {
  const res = await fetch(`${BASE}/messages/replies/${parentId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
