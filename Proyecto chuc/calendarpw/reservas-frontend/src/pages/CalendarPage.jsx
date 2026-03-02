import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ReservationModal from "../components/ReservationModal";
import Layout from "../components/layout";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [modalError, setModalError] = useState("");

  const BASE_URL = "http://127.0.0.1:8001/api";

  // Estilos tipo Notion para tus categorías de la UAC y Emprendimiento
  const getEventStyle = (categoryName) => {
    switch (categoryName) {
      case 'Universidad':
        return { bg: '#dbeafe', border: '#bfdbfe', text: '#1e40af' }; // Azul
      case 'Emprendimiento':
        return { bg: '#d1fae5', border: '#a7f3d0', text: '#065f46' }; // Esmeralda
      case 'Desarrollo':
        return { bg: '#fef3c7', border: '#fde68a', text: '#92400e' }; // Ámbar
      case 'Personal':
        return { bg: '#ffe4e6', border: '#fecdd3', text: '#9f1239' }; // Rosa
      default:
        return { bg: '#f1f5f9', border: '#e2e8f0', text: '#475569' }; // Gris
    }
  };

  async function load() {
    const token = localStorage.getItem('token'); // Recupera tu sesión persistente
    if (!token) return;

    try {
      const resSp = await fetch(`${BASE_URL}/spaces`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const sp = await resSp.json();
      
      const resRs = await fetch(`${BASE_URL}/reservas`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const rs = await resRs.json();

      setSpaces(sp);
      setEvents(rs.map((r) => {
        const style = getEventStyle(r.space_name);
        return {
          id: r.id,
          title: r.title || `${r.space_name}`,
          start: r.start_time,
          end: r.end_time,
          backgroundColor: style.bg,
          borderColor: style.border,
          textColor: style.text,
        };
      }));
    } catch (e) {
      console.error("Error al cargar datos:", e);
    }
  }

  useEffect(() => { load(); }, []);

  function handleSelect(info) {
    if (!spaces.length) {
      alert("No hay categorías configuradas en la base de datos.");
      return;
    }
    setSelectedRange(info);
    setModalError("");
    setIsModalOpen(true);
  }

  async function handleConfirmReservation(space_id) {
    setModalError(""); 
    const token = localStorage.getItem('token');
    
    // Pedimos el nombre de la materia de la Facultad de Ingeniería
    const title = prompt("¿Qué clase o actividad es? (Ej: Programación)");

    if (!title) return;

    try {
      const resp = await fetch(`${BASE_URL}/reservas`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}` // Token para que Laravel te reconozca
        },
        body: JSON.stringify({
          space_id: Number(space_id),
          title: title,
          start_time: selectedRange.startStr,
          end_time: selectedRange.endStr,
        }),
      });

      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.message || "Error al guardar en la agenda");
      }
      
      await load(); // Recarga para ver el bloque de color estilo Notion
      setIsModalOpen(false);
    } catch (e) {
      setModalError(e.message); // Esto se mostrará en el recuadro rojo del modal
    }
  }

  async function handleEventClick(info) {
    if (!confirm("¿Deseas eliminar este compromiso de tu agenda?")) return;
    const token = localStorage.getItem('token');
    try {
      const resp = await fetch(`${BASE_URL}/reservas/${info.event.id}`, { 
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      if (!resp.ok) throw new Error("No se pudo eliminar el evento");
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <Layout>
      <header className="mb-8 px-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mi Agenda</h1>
        <p className="text-slate-500 text-sm mt-1">
          Organiza tu tiempo entre Universidad, Emprendimiento y Desarrollo.
        </p>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
          }}
          selectable={true}
          select={handleSelect}
          eventClick={handleEventClick}
          events={events}
          locale="es"
          allDaySlot={false}
          slotMinTime="07:00:00" // Tu horario de la UAC
          slotMaxTime="22:00:00"
          height="auto"
          nowIndicator={true}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short'
          }}
          eventClassNames="rounded-md border-l-4 shadow-sm font-medium"
        />
      </div>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmReservation}
        spaces={spaces}
        errorMessage={modalError}
      />
    </Layout>
  );
}