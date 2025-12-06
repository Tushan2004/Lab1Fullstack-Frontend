import { useState } from "react";
import { searchPatients } from "../api/searchApi";

export default function SearchPatient() {
  const [name, setName] = useState("");
  const [condition, setCondition] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await searchPatients(name, condition);
      setResults(data);
    } catch (error) {
      console.error(error);
      alert("Något gick fel vid sökning");
    }
  };

  return (
    <div className="search-box">
      <h3>Sök Patient</h3>
      <form onSubmit={handleSearch}>
        <input 
          placeholder="Namn" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          placeholder="Diagnos" 
          value={condition} 
          onChange={(e) => setCondition(e.target.value)} 
        />
        <button type="submit">Sök</button>
      </form>

      <ul>
        {results.map((patient) => (
          <li key={patient.id}>
            {patient.firstName} {patient.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}