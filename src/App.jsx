import { useState } from "react";
import AuthPage from "./pages/AuthPage.jsx";
import PatientsPage from "./pages/PatientsPage.jsx";
import "./styles/app.css";

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  });

  function handleLoggedIn(u) { setUser(u); }
  function logout() { localStorage.removeItem("user"); setUser(null); }

  return (
    <div className="App" style={{ padding: 16 }}>
      <h1>Patient Management System</h1>

      {!user ? (
        <AuthPage onLoggedIn={handleLoggedIn} />
      ) : (
        <>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <span>Logged in as {user.email} ({user.role})</span>
            <button onClick={logout}>Logout</button>
          </div>
          <PatientsPage />
        </>
      )}
    </div>
  );
}