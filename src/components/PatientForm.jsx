import { useState } from "react";

export default function PatientForm({ onCreate }) {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [busy,      setBusy]      = useState(false);
  const [err,       setErr]       = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await onCreate({ firstName, lastName });
      setFirstName(""); setLastName("");
    } catch (e) {
      setErr(e.message || "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={{display:"flex",gap:8,margin:"8px 0"}}>
      <input placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} required />
      <input placeholder="Last name"  value={lastName}  onChange={e=>setLastName(e.target.value)}  required />
      <button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
      {err && <span style={{color:"red"}}>{err}</span>}
    </form>
  );
}