import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ReservationModal from "../components/ReservationModal";
import Layout from "../components/layout";
import { apiFetch } from "../api/apiFetch";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [modalError, setModalError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notifError, setNotifError] = useState("");

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
  
  async function loadNotifications() {
  setNotifError("");
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${BASE_URL}/notifications?unread=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }

    if (!res.ok) throw new Error("Error cargando notificaciones");

    const data = await res.json();
    setNotifications(Array.isArray(data) ? data : []);
  } catch (e) {
    setNotifError(e.message);
  }
}

async function markNotificationRead(id) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }

    if (!res.ok) throw new Error("No se pudo marcar como leída");

    // Quitarla del panel
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  } catch (e) {
    alert(e.message);
  }
}

  async function load() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // 1) Spaces
    const resSp = await apiFetch(`${BASE_URL}/spaces`, { method: "GET" });
    if (!resSp.ok) throw new Error("Error cargando categorías");
    const sp = await resSp.json();
    setSpaces(Array.isArray(sp) ? sp : []);

    // 2) Reservas
    const resRs = await apiFetch(`${BASE_URL}/reservas`, { method: "GET" });
    if (!resRs.ok) throw new Error("Error cargando reservas");
    const rs = await resRs.json();

    setEvents(
      rs.map((r) => {
        const style = getEventStyle(r.space_name);
        return {
          id: r.id,
          title: r.title || `${r.space_name}`,
          start: r.start,   // IMPORTANTE: backend manda start/end
          end: r.end,
          backgroundColor: style.bg,
          borderColor: style.border,
          textColor: style.text,
          extendedProps: { space_name: r.space_name },
        };
      })
    );
  } catch (e) {
    console.error("Error al cargar datos:", e);
  }
}
  useEffect(() => {
  loadNotifications();
}, []);

useEffect(() => {
  load();
}, []);

  function handleSelect(info) {
    if (!spaces.length) {
      alert("No hay categorías configuradas en la base de datos.");
      return;
    }
    setSelectedRange(info);
    setModalError("");
    setIsModalOpen(true);
  }

  async function handleConfirmReservation({ space_id, title }) {
  setModalError("");
  const token = localStorage.getItem("token");

  try {
    const resp = await apiFetch(`${BASE_URL}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        space_id,
        title,
        start_time: selectedRange.startStr,
        end_time: selectedRange.endStr,
      }),
    });

    if (!resp.ok) {
      const data = await resp.json();
      throw new Error(data.message || "Error al guardar en la agenda");
    }

    await load();
    setIsModalOpen(false);
  } catch (e) {
    setModalError(e.message);
  }
}

  async function handleEventClick(info) {
    if (!confirm("¿Deseas eliminar este compromiso de tu agenda?")) return;
    const token = localStorage.getItem('token');
    try {
      const resp = await apiFetch(`${BASE_URL}/reservas/${info.event.id}`, { 
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
      {/* Panel de notificaciones (requisito del PDF) */}
{notifError && (
  <div className="mb-4 mx-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
    {notifError}
  </div>
)}

{notifications.length > 0 && (
  <div className="mb-4 mx-2 bg-amber-50 border border-amber-200 rounded-xl p-4">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-amber-900">
        Notificaciones ({notifications.length})
      </h3>
      <span className="text-xs text-amber-700">
        Se muestran al iniciar sesión
      </span>
    </div>

    <div className="mt-3 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-white border border-amber-100 rounded-lg p-3 flex items-start justify-between gap-3"
        >
          <div>
            <div className="font-medium text-slate-900">{n.title}</div>
            {n.body && <div className="text-sm text-slate-600 mt-1">{n.body}</div>}
            <div className="text-xs text-slate-400 mt-2">
              {new Date(n.created_at).toLocaleString("es-MX")}
            </div>
          </div>

          <button
            onClick={() => markNotificationRead(n.id)}
            className="px-3 py-1 text-sm bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg"
          >
            Marcar leída
          </button>
        </div>
      ))}
    </div>
  </div>
)}

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
          events={async (fetchInfo, successCallback, failureCallback) => {
  try {
    const token = localStorage.getItem("token");
    const url = `${BASE_URL}/reservas?start=${encodeURIComponent(fetchInfo.startStr)}&end=${encodeURIComponent(fetchInfo.endStr)}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }

    if (!res.ok) throw new Error("Error cargando reservas");

    const rs = await res.json();

    const mapped = rs.map((r) => {
      const style = getEventStyle(r.space_name);
      return {
        id: r.id,
        title: r.title || `${r.space_name}`,
        start: r.start,
        end: r.end,
        backgroundColor: style.bg,
        borderColor: style.border,
        textColor: style.text,
      };
    });

    successCallback(mapped);
  } catch (e) {
    failureCallback(e);
  }
}}
          locale="es"
          allDaySlot={false}
          slotMinTime="07:00:00" // Tu horario de la UAC
          slotMaxTime="24:00:00"
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