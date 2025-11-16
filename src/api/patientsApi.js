const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function getPatients() {
  const res = await fetch(`${BASE}/patients`);
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

export async function createPatient(patient) {
  const res = await fetch(`${BASE}/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient),
  });
  if (!res.ok) throw new Error("Failed to create patient");
  return res.json();
}

export async function getMyPatientInfo(userId) {
  const res = await fetch(`${BASE}/patients/me?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch patient info");
  return res.json();
}
