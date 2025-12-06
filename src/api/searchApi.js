
const BASE_URL = "http://localhost:8084/api/search";

export async function searchPatients(name, diagnosis) {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (diagnosis) params.append("condition", diagnosis);

  const res = await fetch(`${BASE_URL}/patients?${params.toString()}`);
  if (!res.ok) throw new Error("Kunde inte söka patienter");
  return await res.json();
}

export async function getDoctorSchedule(doctorUserId, date) {
  const res = await fetch(`${BASE_URL}/practitioner/${doctorUserId}/encounters?date=${date}`);
  if (!res.ok) throw new Error("Kunde inte hämta schema");
  return await res.json();
}