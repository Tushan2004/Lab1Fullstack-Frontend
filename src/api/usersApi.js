const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// Hämta alla användare med roll DOCTOR eller STAFF
export async function getDoctorsAndStaff() {
  const res = await fetch(`${BASE}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  const all = await res.json();
  return all.filter(u => u.role === "DOCTOR" || u.role === "STAFF");
}