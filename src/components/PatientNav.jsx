import React from "react";

export default function PatientNav({ active, onChange, currentUser }) {
  const isPractitioner = currentUser.role === "DOCTOR" || currentUser.role === "STAFF";

  const ITEMS = [
    { key: "send",   label: "Skicka meddelande" },
    { key: "inbox",  label: "Mina meddelanden" },
    { key: "visits", label: "Träff-historik" },
    { key: "account",label: "Mina uppgifter" },
  ];

  // Flik för läkare / personal
  if (isPractitioner) {
    ITEMS.push({ key: "notation", label: "Ny anteckning" });

    // Endast läkare får se full patientinfo
    if (currentUser.role === "DOCTOR") {
      ITEMS.push({ key: "patientInfo", label: "Full Patient Info" });
    }
  }

  return (
    <nav style={styles.bar}>
      {ITEMS.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          style={{
            ...styles.btn,
            ...(active === it.key ? styles.btnActive : {}),
          }}
        >
          {it.label}
        </button>
      ))}
    </nav>
  );
}

const styles = {
  bar: {
    display: "flex",
    gap: 8,
    padding: 8,
    borderBottom: "1px solid #ddd",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 5,
  },
  btn: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    background: "#f7f7f7",
    borderRadius: 6,
    cursor: "pointer",
  },
  btnActive: {
    background: "#e6f0ff",
    borderColor: "#8bb5ff",
    fontWeight: 600,
  },
};
