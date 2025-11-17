import { useEffect, useState } from "react";
import { getNotations } from "../api/notationsApi";

export default function VisitHistory({ updateTrigger, currentUser }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");

      try {
        const data = await getNotations(currentUser.email); // Skicka email istället för id
        console.log("Notations API:", data);

        // Om backend bara skickar senderId/recipientId behöver vi mappar till namn
        const mapped = data.map(n => ({
          id: n.id,
          note: n.notation,
          diagnosis: n.diagnosis,
          doctorFirstName: n.senderFirstName || "Okänd",
          doctorLastName: n.senderLastName || ""
        }));

        setNotes(mapped);
      } catch (e) {
        console.error(e);
        setErr("Kunde inte hämta journalanteckningar.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [updateTrigger, currentUser.email]);

  if (loading) return <p>Laddar journal...</p>;
  if (err) return <p style={{ color: "red" }}>{err}</p>;
  if (!notes.length) return <p>Inga journalanteckningar.</p>;

  return (
    <div style={styles.box}>
      <h2>Journalanteckningar</h2>

      {notes.map((n) => (
        <div key={n.id} style={styles.note}>
          <p><strong>Läkare:</strong> {n.doctorFirstName} {n.doctorLastName}</p>
          <p><strong>Anteckning:</strong> {n.note}</p>
          {n.diagnosis && <p><strong>Diagnos:</strong> {n.diagnosis}</p>}
          <small>{new Date(n.date || Date.now()).toLocaleString()}</small>
          <hr />
        </div>
      ))}
    </div>
  );
}

const styles = {
  box: { padding: 10, maxWidth: 500 },
  note: {
    background: "#f2f2f2",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10
  }
};
