// src/components/WorkHoursForm.js
import React, { useState } from 'react';
import api from '../api';
import { isHolidayOrWeekend } from '../utils/dateUtils';

const WorkHoursForm = () => {
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [task, setTask] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isHolidayOrWeekend(date)) {
      setError("No se pueden registrar horas en días no laborables.");
      return;
    }

    try {
      await api.post('/work-hours', { projectId, date, hours, task });
      setError(null);
      setSuccess("Horas registradas con éxito.");
      setProjectId('');
      setDate('');
      setHours('');
      setTask('');
    } catch (err) {
      setError("Error al registrar horas.");
      setSuccess(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <input type="text" placeholder="ID de Proyecto" value={projectId} onChange={(e) => setProjectId(e.target.value)} required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="number" placeholder="Horas" value={hours} onChange={(e) => setHours(e.target.value)} required />
      <textarea placeholder="Tarea" value={task} onChange={(e) => setTask(e.target.value)} required />
      <button type="submit">Registrar Horas</button>
    </form>
  );
};

export default WorkHoursForm;
