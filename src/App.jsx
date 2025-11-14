import { useState } from "react";
import AuthPage from "./pages/AuthPage.jsx";
import PatientsPage from "./pages/PatientsPage.jsx";
import "./styles/app.css";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  });

  function handleLoggedIn(u) {
    localStorage.setItem("currentUser", JSON.stringify(u)); // ✅ Spara i storage
    setUser(u);
  }

  function logout() {
    localStorage.removeItem("currentUser"); // ❗ samma nyckel
    setUser(null);
  }

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

          <PatientsPage currentUser={user} /> 
          {/* Skicka med till sidor som behöver det */}
        </>
      )}
    </div>
  );
}