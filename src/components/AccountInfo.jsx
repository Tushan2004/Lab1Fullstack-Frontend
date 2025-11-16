import { useEffect, useState } from "react";
import { getMyPatientInfo } from "../api/patientsApi";

export default function AccountInfo() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      setErr("Ingen användare är inloggad.");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const data = await getMyPatientInfo(currentUser.id);
        setInfo(data);
      } catch (e) {
        setErr("Kunde inte hämta dina uppgifter.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Laddar dina uppgifter…</p>;
  if (err) return <p style={{ color: "red" }}>{err}</p>;
  if (!info) return <p>Inga uppgifter hittades.</p>;

  return (
    <div>
      <h3>Mina uppgifter</h3>

      <p><strong>Förnamn:</strong> {info.firstName}</p>
      <p><strong>Efternamn:</strong> {info.lastName}</p>
      <p><strong>Email:</strong> {info.email}</p>
      <p><strong>Roll:</strong> {info.role}</p>

      <hr />
      <p style={{ fontSize: "0.9em", color: "#666" }}>
        (Information hämtad från din patientprofil.)
      </p>
    </div>
  );
}
