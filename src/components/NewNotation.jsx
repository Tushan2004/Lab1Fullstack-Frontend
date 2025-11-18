import { useEffect, useState } from "react";
import { sendNotation } from "../api/notationsApi";
import { getPatients } from "../api/patientsApi";


export default function SendNotationForm() {

    const [patients, setPatietnts]        = useState([]);
    console.log("patients från backend:", patients);
    const [notation, setNotation]         = useState("");
    const [diagnosis, setDiagnosis]       = useState("");
    const [loading, setLoading]           = useState(true);
    const [err, setErr]                   = useState("");
    const [success, setSuccess]           = useState(false);
    const [recipientId, setRecipientId]   = useState("");

  useEffect(() => {

    async function load() {
        try {
        const data = await getPatients();
        setPatietnts(data);
        } catch (e) {
        setErr("Kunde inte hämta användare.");
        } finally {
        setLoading(false);
        }
    }

    load();
    
    }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess(false);
    setErr("");


    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log("currentUser:", currentUser);
    console.log("recipientId (state):", recipientId, " typeof:", typeof recipientId);
    console.log("Number(recipientId):", Number(recipientId));
    if (!currentUser) {
      setErr("Ingen användare är inloggad.");
      return;
    }

    if (!recipientId || !notation.trim()) {
      setErr("Välj mottagare och skriv ett meddelande.");
      return;
    }


    try {

        console.log("Skickar notation payload:", {
        senderId: currentUser.id,
        recipientId: Number(recipientId),
        notation,
        diagnosis,
        });
      
      await sendNotation({
        senderId: currentUser.id,        
        recipientId: Number(recipientId),
        notation : notation,
        diagnosis: diagnosis
      });
      setSuccess(true);
      setNotation("");
      setRecipientId("");
      setDiagnosis("");
    } catch (e) {
      setErr(e.notation || "Kunde inte skicka meddelandet.");
    }
  }

  if (loading) return <p>Laddar patienter...</p>;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {err && !success && <p style={{color:"red"}}>{err}</p>}

        <label>
  Patient:
  <select
    value={recipientId}
    onChange={(e) => setRecipientId(e.target.value)}
    style={styles.select}
    required
  >
    <option value="">-- Välj patient --</option>
    {patients.map((p) => (
      <option key={p.id} value={p.id}>
        {p.firstName} {p.lastName}
      </option>
    ))}
  </select>
</label>

      <textarea
        value={notation}
        onChange={(e) => setNotation(e.target.value)}
        placeholder="Skriv Mötesanteckningar här..."
        rows={5}
        style={styles.textarea}
        required
      />
      <textarea
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        placeholder="Skriv patientens diagnos här..."
        rows={1}
        style={styles.textarea}
        required
      />

      <button type="submit" style={styles.button}>Skicka</button>
      {success && <p style={{ color: "green" }}>Meddelandet skickades!</p>}
    </form>
  );
}

const styles = {
  form: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 400, marginTop: 12 },
  select: { padding: 6, borderRadius: 6, border: "1px solid #ccc" },
  textarea: { resize: "none", padding: 8, borderRadius: 6, border: "1px solid #ccc" },
  button: { background: "#4a90e2", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }
};