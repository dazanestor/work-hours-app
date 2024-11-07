// src/utils/dateUtils.js
export const isHolidayOrWeekend = (date) => {
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sábado y Domingo
};
