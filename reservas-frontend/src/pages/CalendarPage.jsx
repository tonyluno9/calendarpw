import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { apiFetch } from "../api/client";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [spaces, setSpaces] = useState([]);

  async function load() {
    const sp = await apiFetch("/spaces");
    const rs = await apiFetch("/reservations");

    setSpaces(sp);

    setEvents(
      rs.map((r) => ({
        id: r.id,
        title: r.title || `${r.space_name} - ${r.user_name}`,
        start: r.start_time,
        end: r.end_time,
      }))
    );
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSelect(info) {
    if (!spaces.length) {
      alert("No hay espacios creados.");
      return;
    }

    const options = spaces.map((s) => `${s.id}: ${s.name}`).join("\n");
    const choice = prompt(`Selecciona el ID del espacio:\n${options}`);

    if (!choice) return;

    const space_id = Number(choice.split(":")[0]);

    try {
      await apiFetch("/reservations", {
        method: "POST",
        body: JSON.stringify({
          space_id,
          start_time: info.startStr,
          end_time: info.endStr,
        }),
      });

      await load();
      alert("Reserva creada correctamente");
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleEventClick(info) {
    if (!confirm("¿Eliminar reserva?")) return;

    try {
      await apiFetch(`/reservations/${info.event.id}`, {
        method: "DELETE",
      });
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto" }}>
      <h1>Calendario</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        select={handleSelect}
        eventClick={handleEventClick}
        events={events}
      />
    </div>
  );
}