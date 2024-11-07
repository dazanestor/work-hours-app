
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const [hours, setHours] = useState('');
  const [task, setTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidays, setHolidays] = useState([]);

  const fetchHolidays = async () => {
    const response = await fetch('http://localhost:5000/holidays');
    const data = await response.json();
    setHolidays(data);
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleRegister = async () => {
    if (!selectedDate) {
      alert("Seleccione una fecha válida.");
      return;
    }
    if (hours <= 0) {
      alert("Las horas deben ser mayores a 0.");
      return;
    }

    const response = await fetch('http://localhost:5000/register-hours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 1,
        projectId: 1,
        date: selectedDate.toISOString().split('T')[0],
        hours,
        task
      })
    });

    if (response.ok) {
      alert("Horas registradas con éxito");
    } else {
      const data = await response.json();
      alert("Error: " + data.error);
    }
  };

  return (
    <div>
      <h1>Registro de Horas</h1>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        placeholderText="Selecciona una fecha"
      />
      <input
        type="number"
        placeholder="Horas"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tarea"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={handleRegister}>Registrar</button>
    </div>
  );
}

export default App;
