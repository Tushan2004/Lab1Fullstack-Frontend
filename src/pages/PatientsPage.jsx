import { useEffect, useState } from "react";
import { getPatients, createPatient, getFullPatientInfo } from "../api/patientsApi.js";
// 1. NY IMPORT HÄR:
import { searchPatients } from "../api/searchApi.js"; 

import PatientNav from "../components/PatientNav.jsx";
import SendMessageForm from "../components/SendMessagesForm.jsx";
import NewNotation from "../components/NewNotation.jsx";
import MessagesInbox from "../components/MessagesInbox.jsx";
import AccountInfo from "../components/AccountInfo.jsx";
import VisitHistory from "../components/VisitHistory.jsx";
import ImageManager from "../components/ImageManager.jsx"; 

function Inbox({ inboxTrigger }) {
  return <MessagesInbox updateTrigger={inboxTrigger} />;
}

function VisitHistoryTab({ inboxTrigger, currentUser }) {
  return <VisitHistory updateTrigger={inboxTrigger} currentUser={currentUser} />;
}

function SendMessage({ onMessageSent }) {
  return (
    <div>
      <h3>Skicka meddelande</h3>
      <SendMessageForm onMessageSent={onMessageSent} />
    </div>
  );
}

// 2. NY KOMPONENT HÄR: Denna hanterar din Quarkus-sökning
function SearchPatientsTab() {
  const [name, setName] = useState("");
  const [condition, setCondition] = useState("");
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setMsg("Söker...");
    setResults([]);
    
    try {
      const data = await searchPatients(name, condition);
      setResults(data);
      if (data.length === 0) {
        setMsg("Inga träffar hittades");
      } else {
        setMsg("");
      }
    } catch (err) {
      console.error(err);
      setMsg("Fel: Kunde inte nå sök-tjänsten (Är Quarkus igång på port 8084?)");
    }
  }

  return (
    <div>
      <h3>Sök Patient</h3>
      <form onSubmit={handleSearch} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>Namn:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="T.ex. Sven"
            style={{ padding: "5px", width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>Diagnos:</label>
          <input 
            type="text" 
            value={condition} 
            onChange={(e) => setCondition(e.target.value)} 
            placeholder="T.ex. Feber"
            style={{ padding: "5px", width: "100%" }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>Sök nu</button>
      </form>

      {msg && <p style={{ color: msg.includes("Fel") ? "red" : "blue" }}>{msg}</p>}

      <div>
        {results.map((p) => (
          <div key={p.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
            <strong>{p.firstName} {p.lastName}</strong> 
            <br />
            <span style={{ fontSize: "0.9em", color: "#666" }}>User ID: {p.userId}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FullPatientInfo({ currentUser }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (e) {
        setErr("Kunde inte hämta patienter.");
      }
    }
    loadPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatientId) return;
    async function loadInfo() {
      setLoading(true); setErr("");
      try {
        const data = await getFullPatientInfo(selectedPatientId, currentUser.id);
        setInfo(data);
      } catch (e) { setErr("Kunde inte hämta full patientinfo."); } 
      finally { setLoading(false); }
    }
    loadInfo();
  }, [selectedPatientId, currentUser.id]);

  if (err) return <p style={{ color: "red" }}>{err}</p>;
  if (loading) return <p>Laddar patientinformation…</p>;

  return (
    <div>
      <h3>Full patientinformation</h3>
      <select value={selectedPatientId || ""} onChange={(e) => setSelectedPatientId(e.target.value)}>
        <option value="">-- Välj patient --</option>
        {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
        ))}
      </select>
      {info && (
        <div style={{ marginTop: 12 }}>
          <p><strong>Förnamn:</strong> {info.firstName}</p>
          <p><strong>Efternamn:</strong> {info.lastName}</p>
          <p><strong>Email:</strong> {info.email}</p>
          <p><strong>Roll:</strong> {info.role}</p>
        </div>
      )}
    </div>
  );
}

export default function PatientsPage({ currentUser }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("inbox");
  const [inboxTrigger, setInboxTrigger] = useState(0); 

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

  function handleMessageSent() {
    setInboxTrigger(prev => prev + 1);
  }

  if (loading) return <div>Loading…</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h2>Patients</h2>
      <PatientNav 
        active={tab} 
        onChange={setTab}
        currentUser={currentUser}
      />

      <div style={{ padding: "12px 4px" }}>
        {tab === "send" && <SendMessage onMessageSent={handleMessageSent} />}
        {tab === "inbox" && <Inbox inboxTrigger={inboxTrigger} />}
        {tab === "visits" && <VisitHistoryTab inboxTrigger={inboxTrigger} currentUser={currentUser} />}
        {tab === "account" && <AccountInfo currentUser={currentUser} />}
        {tab === "notation" && <NewNotation />}
        {tab === "patientInfo" && <FullPatientInfo currentUser={currentUser} />}
        {tab === "images" && <ImageManager />}
        {tab === "search" && <SearchPatientsTab />}
      </div>
    </div>
  );
}