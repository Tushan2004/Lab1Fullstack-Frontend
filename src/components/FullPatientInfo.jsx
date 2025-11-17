import { useEffect, useState } from "react";
import { getFullPatientInfo, getPatients } from "../api/patientsApi";

export default function FullPatientInfo({ currentUser }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getPatients(); // hämta lista på alla patienter
        setPatients(data);
      } catch (e) {
        setErr("Kunde inte hämta patienter.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function viewPatient(patientId) {
    try {
      const data = await getFullPatientInfo(patientId, currentUser.id);
      setSelectedPatient(data);
    } catch (e) {
      setErr("Kunde inte hämta patientinformation.");
    }
  }

  if (loading) return <p>Laddar patienter…</p>;
  if (err) return <p style={{ color: "red" }}>{err}</p>;

  return (
    <div>
      <h3>Välj patient för full information</h3>
      <ul>
        {patients.map(p => (
          <li key={p.id}>
            {p.firstName} {p.lastName}{" "}
            <button onClick={() => viewPatient(p.id)}>Visa info</button>
          </li>
        ))}
      </ul>

      {selectedPatient && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
          <h4>Patientinformation</h4>
          <p><strong>Förnamn:</strong> {selectedPatient.firstName}</p>
          <p><strong>Efternamn:</strong> {selectedPatient.lastName}</p>
          <p><strong>Email:</strong> {selectedPatient.email}</p>
          <p><strong>Roll:</strong> {selectedPatient.role}</p>
        </div>
      )}
    </div>
  );
}
