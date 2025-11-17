import { useEffect, useState } from "react";
import { getMessages } from "../api/messagesApi";

export default function MessagesInbox({ refreshTrigger }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          setErr("Ingen användare inloggad.");
          return;
        }

        const userId = currentUser.id;
        const data = await getMessages(userId);

        console.log("Messages API:", data); // <-- Se vad som verkligen kommer
        setMessages(data);
      } catch (e) {
        console.error(e);
        setErr("Kunde inte hämta meddelanden.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [refreshTrigger]);

  if (loading) return <p>Laddar meddelanden...</p>;
  if (err) return <p style={{ color: "red" }}>{err}</p>;
  if (!messages.length) return <p>Inga meddelanden.</p>;

  return (
    <div style={styles.box}>
      <h2>Mina meddelanden</h2>
      {messages.map((m) => (
        <div key={m.id} style={styles.msg}>
          <p>
            <strong>Från:</strong> {m.senderFirstName || "Okänt"} {m.senderLastName || ""}
          </p>
          <p>
            <strong>Till:</strong> {m.receiverFirstName || "Okänt"} {m.receiverLastName || ""}
          </p>
          <p>{m.message}</p>
          <small>{new Date(m.dateSent).toLocaleString()}</small>
          <hr />
        </div>
      ))}
    </div>
  );
}

const styles = {
  box: { padding: 10, maxWidth: 500 },
  msg: { padding: 8, background: "#f7f7f7", borderRadius: 6, marginBottom: 10 },
};
