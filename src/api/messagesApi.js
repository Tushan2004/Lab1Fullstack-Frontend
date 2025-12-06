const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8082";
console.log("VITE_API_BASE =", import.meta.env.VITE_API_BASE);
console.log("Messages BASE  =", BASE);

// Skicka nytt meddelande eller svar
export async function sendMessage({ senderId, recipientId, message, parentId = null }) {
  const res = await fetch(`${BASE}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      senderUserId: senderId,
      receiverUserId: recipientId,
      message: message,
      parentId: parentId, // will be null if not provided
    }),
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