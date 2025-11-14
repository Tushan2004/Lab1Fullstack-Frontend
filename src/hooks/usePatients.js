import { useEffect, useState } from 'react';
import { getPatients, createPatient } from '../api/patientsApi';

export function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const addPatient = async (patient) => {
    try {
      const newPatient = await createPatient(patient);
      setPatients((prevPatients) => [...prevPatients, newPatient]);
    } catch (err) {
      setError(err.message);
    }
  };

  return { patients, loading, error, addPatient };
}