export default function PatientList({ patients }) {
  if (!patients.length) return <p>No patients yet.</p>;
  return (
    <ul>
      {patients.map(p => (
        <li key={p.id}>
          {p.firstName} {p.lastName}
        </li>
      ))}
    </ul>
  );
}