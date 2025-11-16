import { useEffect, useState } from "react";
import { getPatients, createPatient } from "../api/patientsApi.js";
import PatientNav from "../components/PatientNav.jsx";
import SendMessageForm from "../components/SendMessagesForm.jsx";
import NewNotation from "../components/NewNotation.jsx";
import MessagesInbox from "../components/MessagesInbox.jsx";
import AccountInfo from "../components/AccountInfo.jsx"; // <--- behåll denna

function Inbox() {
  return <div>Här visas inkommande/utgående meddelanden.</div>;
}

function VisitHistory() {
  return <div>Här visas historik över träffar/bokade besök.</div>;
}

function SendMessage() {
  return (
    <div>
      <h3>Skicka meddelande</h3>
      <SendMessageForm />
    </div>
  );
}

export default function PatientsPage({currentUser}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tab, setTab] = useState("send");

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(p) {
    await createPatient(p);
    await load();
  }

  if (loading) return <div>Loading…</div>;
  if (error) return <div style={{color:"red"}}>Error: {error}</div>;

  return (
    <div>
      <h2>Patients</h2>

      <PatientNav 
       active={tab} 
       onChange={setTab}
       currentUser={currentUser}
      />

      <div style={{ padding: "12px 4px" }}>
        {tab === "send" && <SendMessage />}
        {tab === "inbox" && <MessagesInbox />}
        {tab === "visits" && <VisitHistory />}
        {tab === "account" && <AccountInfo currentUser={currentUser} />}
        {tab === "notation" && <NewNotation />}
      </div>
    </div>
  );
}
