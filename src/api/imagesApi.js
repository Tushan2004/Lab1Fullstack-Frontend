// Vi pekar direkt mot Node-tjänsten (port 3000) tills vidare
const IMAGE_API_BASE = "http://localhost:3000"; 

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${IMAGE_API_BASE}/images`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Kunde inte ladda upp bild");
  return res.json(); // Returnerar { id: "...", url: "..." }
}

export async function editImage(imageId, text, x = 50, y = 50) {
  const res = await fetch(`${IMAGE_API_BASE}/images/${imageId}/edit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, x, y, color: "red" }),
  });

  if (!res.ok) throw new Error("Kunde inte redigera bild");
  return res.json();
}

export function getImageUrl(urlPath) {
  // Hjälpfunktion för att bygga hela URL:en till bilden
  return `${IMAGE_API_BASE}${urlPath}`;
}