// src/App.js
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import { ThemeProvider, useTheme } from './ThemeContext';
import Login from './components/Login';
import Register from './components/Register';
import WorkHoursForm from './components/WorkHoursForm';
import WorkHoursList from './components/WorkHoursList';
import AdminDashboard from './components/AdminDashboard';
import CustomCalendar from './components/Calendar';
import ProtectedRoute from './ProtectedRoute';  // Componente para proteger rutas
import './theme.css'; // Estilos para temas claro y oscuro

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.body.className = theme; // Aplica el tema al body
  }, [theme]);

  return (
    <button onClick={toggleTheme} className={theme}>
      {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
    </button>
  );
};

const App = () => {
  const { user } = useContext(AuthContext); // Obtener el rol del usuario

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <nav>
            <Link to="/work-hours">Registrar Horas</Link> | 
            <Link to="/work-hours/list">Ver Horas</Link> | 
            {user?.role === 'admin' && (
              <>
                <Link to="/admin">Panel de Administración</Link> | 
                <Link to="/calendar">Calendario de Días No Laborables</Link>
              </>
            )}
            <ThemeToggleButton /> {/* Botón para alternar el tema */}
          </nav>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/work-hours" element={<WorkHoursForm />} />
            <Route path="/work-hours/list" element={<WorkHoursList />} />
            
            {/* Rutas protegidas solo para admin */}
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute role="admin"><CustomCalendar /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
