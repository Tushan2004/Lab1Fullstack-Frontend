import { useEffect, useState } from "react";
import { getMessages, getReplies, sendMessage } from "../api/messagesApi";

export default function MessagesInbox({ refreshTrigger }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [replyText, setReplyText] = useState({}); 

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

        setMessages(data.filter(m => m.parent === null));
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
        <MessageItem
          key={m.id}
          message={m}
          replyText={replyText}
          setReplyText={setReplyText}
        />
      ))}
    </div>
  );
}

function MessageItem({ message, replyText, setReplyText }) {
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(true);

  useEffect(() => {
    async function loadReplies() {
      setLoadingReplies(true);
      try {
        const data = await getReplies(message.id);
        setReplies(data);
      } catch (e) {
        console.error("Kunde inte hämta svar:", e);
      } finally {
        setLoadingReplies(false);
      }
    }

    loadReplies();
  }, [message.id]);

  const handleSendReply = async () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const text = replyText[message.id]?.trim();
    if (!text) return;

    try {
      const newReply = await sendMessage({
        senderId: currentUser.id,
        recipientId: message.senderId,
        message: text,
        parentId: message.id,
      });

      setReplies(prev => [...prev, newReply]);
      setReplyText(prev => ({ ...prev, [message.id]: "" }));
    } catch (e) {
      alert("Kunde inte skicka svar");
    }
  };

  return (
    <div style={styles.msg}>
      <p><strong>Från:</strong> {message.senderFirstName} {message.senderLastName}</p>
      <p><strong>Till:</strong> {message.receiverFirstName} {message.receiverLastName}</p>
      <p>{message.message}</p>
      <small>{new Date(message.dateSent).toLocaleString()}</small>

      {loadingReplies ? <p>Laddar svar…</p> : (
        replies.map(r => (
          <div key={r.id} style={styles.reply}>
            <p><strong>{r.senderFirstName} {r.senderLastName}:</strong> {r.message}</p>
            <small>{new Date(r.dateSent).toLocaleString()}</small>
          </div>
        ))
      )}

      <div style={{ marginTop: 6 }}>
        <textarea
          placeholder="Skriv svar..."
          value={replyText[message.id] || ""}
          onChange={e => setReplyText(prev => ({ ...prev, [message.id]: e.target.value }))}
          style={styles.textarea}
          rows={2}
        />
        <button onClick={handleSendReply} style={styles.button}>Skicka</button>
      </div>
    </div>
  );
}

const styles = {
  box: { padding: 10, maxWidth: 600 },
  msg: { padding: 10, background: "#f7f7f7", borderRadius: 6, marginBottom: 10 },
  reply: { padding: 6, background: "#e2e2e2", borderRadius: 4, marginTop: 4, marginLeft: 10 },
  textarea: { width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc", marginBottom: 4 },
  button: { padding: "6px 12px" },
};
