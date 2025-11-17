import { useEffect, useState } from "react";
import { getPractitioners } from "../api/practitionerApi";
import { sendMessage } from "../api/messagesApi";

export default function SendMessageForm({ onMessageSent }) {
  const [practitioners, setPractitioners] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPractitioners();
        const validPractitioners = data.filter(p => p.userId);
        setPractitioners(validPractitioners);
      } catch {
        setErr("Kunde inte hämta användare.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess(false);
    setErr("");

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
      await sendMessage({
        senderId: currentUser.id,
        recipientId: Number(recipientId),
        message
      });
      setSuccess(true);
      setMessage("");
      setRecipientId("");

      // Triggera uppdatering i MessagesInbox
      if (onMessageSent) onMessageSent();

    } catch (e) {
      setErr(e.message || "Kunde inte skicka meddelandet.");
    }
  }

  if (loading) return <p>Laddar personal...</p>;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {err && !success && <p style={{ color: "red" }}>{err}</p>}

      <label>
        Mottagare:
        <select
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          style={styles.select}
          required
        >
          <option value="">-- Välj personal --</option>
          {practitioners.map(p => (
            <option key={p.userId} value={p.userId}>
              {p.firstName} {p.lastName} ({p.email})
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
