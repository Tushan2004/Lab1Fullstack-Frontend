import { useState } from "react";
import { register, login } from "../api/authApi";

export default function AuthPage({ onLoggedIn }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PATIENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      let res = null;

      if (mode === "signup") {
        res = await register({ email, password, role, firstName, lastName });
       
        const currentUser = {
          id: res.userId,
          email,               
          role: res.role,
          patientId: res.patientId ?? null,
          practitionerId: res.practitionerId ?? null,
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        onLoggedIn?.(currentUser);

      } else {
        res = await login({ email, password });
      
        const currentUser = {
          id: res.id,
          email: res.email,
          role: res.role,
          patientId: null,
          practitionerId: null,
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        onLoggedIn?.(currentUser);
      }
    } catch (e) {
      setErr(e.message || "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "3rem auto" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode("login")}  disabled={mode==="login"}>Login</button>
        <button onClick={() => setMode("signup")} disabled={mode==="signup"}>Sign up</button>
      </div>

      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />

        {mode === "signup" && (
          <>
            <select value={role} onChange={e=>setRole(e.target.value)}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="STAFF">Staff</option>
            </select>
            <input required placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
            <input required placeholder="Last name"  value={lastName}  onChange={e=>setLastName(e.target.value)} />
          </>
        )}

        <button type="submit" disabled={busy}>
          {busy ? "Working…" : (mode==="login" ? "Login" : "Create account")}
        </button>
        {err && <div style={{ color: "red" }}>{err}</div>}
      </form>
    </div>
  );
}