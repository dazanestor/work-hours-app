// src/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto de tema
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Usa el tema predeterminado desde .env o 'light' si no está configurado
  const [theme, setTheme] = useState(process.env.REACT_APP_DEFAULT_THEME || 'light');

  // Función para alternar entre modo claro y oscuro
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = theme; // Aplica el tema al body
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para utilizar el contexto de tema
export const useTheme = () => useContext(ThemeContext);
