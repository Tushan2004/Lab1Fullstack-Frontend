const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081";

// Hämta alla practitioners (läkare + övrig personal)
export async function getPractitioners() {
  const res = await fetch(`${BASE}/practitioner`);
  if (!res.ok) throw new Error("Kunde inte hämta personal");
  return res.json();
}