// src/components/Calendar.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'; // Archivo CSS para estilos personalizados
import api from '../api';

const CustomCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await api.get('/holidays'); // Endpoint para obtener días festivos
        setHolidays(response.data.map(holiday => new Date(holiday.date)));
      } catch (error) {
        console.error('Error al cargar días festivos:', error);
      }
    };

    fetchHolidays();
  }, []);

  const tileClassName = ({ date, view }) => {
    // Resaltar fines de semana
    if (view === 'month' && (date.getDay() === 0 || date.getDay() === 6)) {
      return 'weekend';
    }
    
    // Resaltar días festivos
    if (view === 'month' && holidays.some(holiday => 
      holiday.getDate() === date.getDate() &&
      holiday.getMonth() === date.getMonth() &&
      holiday.getFullYear() === date.getFullYear()
    )) {
      return 'holiday';
    }
  };

  return (
    <div>
      <h3>Calendario de Días No Laborables</h3>
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default CustomCalendar;
