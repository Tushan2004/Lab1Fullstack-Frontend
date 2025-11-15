import { useEffect, useState } from "react";
import { getMessages } from "../api/messagesApi";

export default function MessagesInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          setErr("Ingen användare inloggad.");
          return;
        }

        const email = currentUser.email;
        const data = await getMessages(email);

        setMessages(data);
      } catch {
        setErr("Kunde inte hämta meddelanden.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Laddar meddelanden...</p>;
  if (err) return <p style={{color:"red"}}>{err}</p>;

  if (!messages.length) return <p>Inga meddelanden.</p>;

  return (
    <div style={styles.box}>
      <h2>Mina meddelanden</h2>
      {messages.map(m => (
        <div key={m.id} style={styles.msg}>
          <p><strong>Från:</strong> {m.sender}</p>
          <p><strong>Till:</strong> {m.receiver}</p>
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
  msg: { padding: 8, background: "#f7f7f7", borderRadius: 6, marginBottom: 10 }
};
