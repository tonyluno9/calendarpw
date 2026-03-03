import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import { apiFetch } from "../api/apiFetch";

const BASE_URL = "/api";

export default function InvitationsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    const res = await apiFetch(`${BASE_URL}/invitations`, { method: "GET" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Error cargando invitaciones");
    }
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function respond(id, action) {
    setError("");
    const res = await apiFetch(`${BASE_URL}/invitations/${id}/${action}`, {
      method: "POST",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "No se pudo responder");

    await load();
  }

  return (
    <Layout>
      <header className="mb-6 px-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invitaciones</h1>
        <p className="text-slate-500 text-sm mt-1">Acepta o rechaza invitaciones de otros usuarios.</p>
      </header>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
        {items.length === 0 ? (
          <p className="text-slate-500 text-sm">No tienes invitaciones.</p>
        ) : (
          <div className="divide-y">
            {items.map((inv) => (
              <div key={inv.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-900">
                    {inv.reservation?.title || "Evento"}
                  </div>
                  <div className="text-sm text-slate-600">
                    De: {inv.inviter_name || inv.inviter_email || "Usuario"}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {inv.reservation?.start_time} — {inv.reservation?.end_time}
                    {inv.reservation?.space_name ? ` • ${inv.reservation.space_name}` : ""}
                  </div>
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {inv.status}
                    </span>
                  </div>
                </div>

                {inv.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => respond(inv.id, "decline")}
                      className="px-3 py-2 bg-slate-100 rounded-lg text-sm"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => respond(inv.id, "accept")}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm"
                    >
                      Aceptar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}