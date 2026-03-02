import React, { useState, useEffect } from 'react';
import axios from 'axios';

const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 a 21:00
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

export default function Schedule() {
  const [userSchedules, setUserSchedules] = useState([]);
  const token = localStorage.getItem('token'); // Recuperamos tu sesión persistente

  // 1. Cargar el horario al entrar
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8001/api/schedules', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserSchedules(res.data);
    } catch (err) {
      console.error("Error al cargar clases", err);
    }
  };

  // 2. Función para agregar una clase (Click en celda)
  const addSubject = async (day, hour) => {
    const subject = prompt(`Materia para el ${day} a las ${hour}:00:`);
    if (!subject) return;

    try {
      await axios.post('http://127.0.0.1:8001/api/schedules', {
        subject,
        day,
        start_time: `${hour}:00`,
        end_time: `${hour + 1}:00`,
        classroom: 'Aula UAC' // Opcional
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSchedules(); // Recargar la tabla
    } catch (err) {
      alert("Error al guardar la materia");
    }
  };

  // Ayudante para encontrar si hay una clase en esa celda
  const getSubjectAt = (day, hour) => {
    return userSchedules.find(s => s.day === day && parseInt(s.start_time) === hour);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Mi Horario Escolar</h2>
      <table className="min-w-full border-collapse border border-slate-200">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2">Hora</th>
            {days.map(d => <th key={d} className="border p-2">{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {hours.map(h => (
            <tr key={h}>
              <td className="border p-2 text-center font-bold bg-slate-50">{h}:00</td>
              {days.map(d => {
                const classData = getSubjectAt(d, h);
                return (
                  <td 
                    key={`${d}-${h}`} 
                    className={`border p-2 h-16 cursor-pointer transition-all ${classData ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-blue-50'}`}
                    onClick={() => !classData && addSubject(d, h)}
                  >
                    {classData ? classData.subject : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}