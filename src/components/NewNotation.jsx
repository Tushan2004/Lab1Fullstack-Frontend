import { useEffect, useState } from "react";
import { getPractitioners } from "../api/practitionerApi";
import { sendMessage } from "../api/messagesApi";
import { getMessages } from "../api/messagesApi";


export default function SendMessageForm() {
  const [practitioners, setPractitioners] = useState([]);
  const [recipientId, setRecipientId]   = useState("");
  const [message, setMessage]           = useState("");
  const [loading, setLoading]           = useState(true);
  const [err, setErr]                   = useState("");
  const [success, setSuccess]           = useState(false);

  useEffect(() => {

    async function load() {
        try {
        const data = await getPractitioners();
        setPractitioners(data);
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

    // 1) Hämta inloggad användare från localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      setErr("Ingen användare är inloggad.");
      return;
    }

    if (!recipientId || !message.trim()) {
      setErr("Välj mottagare och skriv ett meddelande.");
      return;
    }

    if (Number(recipientId) === currentUser.id) {
      setErr("Du kan inte skicka meddelande till dig själv.");
      return;
    }

    try {
      // 2) Skicka avsändarens user-id + mottagarens id + text
      await sendMessage({
        senderId: currentUser.id,        // från login-responsen
        recipientId: Number(recipientId),// välj value={p.user?.id} eller value={p.id} nedan
        message
      });
      setSuccess(true);
      setMessage("");
      setRecipientId("");
    } catch (e) {
      setErr(e.message || "Kunde inte skicka meddelandet.");
    }
  }

  if (loading) return <p>Laddar patienter...</p>;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {err && !success && <p style={{color:"red"}}>{err}</p>}

      <label>
        Mottagare:
        <select
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          style={styles.select}
          required
        >
          <option value="">-- Välj personal --</option>
          {practitioners.map((p) => (
            // Välj EN av följande två beroende på vad backend vill ha:
            // <option key={p.id} value={p.id}>               // Practitioner-id
            // <option key={p.user?.id} value={p.user?.id}>   // User-id
            <option key={p.user?.id ?? p.id} value={p.user?.id ?? p.id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </label>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Skriv ditt meddelande här..."
        rows={5}
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