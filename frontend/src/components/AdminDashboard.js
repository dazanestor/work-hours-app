// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminDashboard = () => {
  const [workHours, setWorkHours] = useState([]);

  const fetchAllWorkHours = async () => {
    const response = await api.get('/admin/work-hours');
    setWorkHours(response.data);
  };

  useEffect(() => {
    fetchAllWorkHours();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/work-hours/${id}/approve`);
      fetchAllWorkHours(); // Actualizar la lista después de la aprobación
      alert("Registro aprobado con éxito");
    } catch (error) {
      console.error("Error al aprobar:", error);
      alert("Error al aprobar el registro.");
    }
  };

  const handleModify = (id) => {
    // Aquí podrías redirigir a un formulario de edición o abrir un modal
    alert(`Modificando registro con ID: ${id}`);
  };

  return (
    <div>
      <h1>Panel de Administración</h1>
      <table>
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Fecha</th>
            <th>Horas</th>
            <th>Tarea</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {workHours.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.projectId}</td>
              <td>{entry.date}</td>
              <td>{entry.hours}</td>
              <td>{entry.task}</td>
              <td>{entry.userId}</td>
              <td>
                <button onClick={() => handleApprove(entry.id)}>Aprobar</button>
                <button onClick={() => handleModify(entry.id)}>Modificar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
