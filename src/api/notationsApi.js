const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8082";

export async function sendNotation({ senderId, recipientId, notation, diagnosis }) {
  const res = await fetch(`${BASE}/notations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creatorUserId: senderId,
      receiverUserId: recipientId,
      notation,
      diagnosis,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getNotations(userId) {
  const res = await fetch(`${BASE}/notations?userId=${userId}`);
  if (!res.ok) throw new Error(await res.text()); // use backend error while debugging
  return res.json();
}