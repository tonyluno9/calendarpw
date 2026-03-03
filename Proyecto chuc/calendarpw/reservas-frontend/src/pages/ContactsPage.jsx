import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import ContactModal from "../components/ContactModal";
import { apiFetch } from "../api/apiFetch";

const BASE_URL = "/api";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    const res = await apiFetch(`${BASE_URL}/contacts`, { method: "GET" });
    if (!res.ok) throw new Error("Error cargando contactos");
    const data = await res.json();
    setContacts(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function saveContact(payload) {
    setError("");
    try {
      const isEdit = !!editing?.id;
      const url = isEdit ? `${BASE_URL}/contacts/${editing.id}` : `${BASE_URL}/contacts`;
      const method = isEdit ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "No se pudo guardar");
      }

      setOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function deleteContact(id) {
    if (!confirm("¿Eliminar contacto?")) return;
    setError("");
    try {
      const res = await apiFetch(`${BASE_URL}/contacts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Layout>
      <header className="mb-6 px-2 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Contactos</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona tu agenda de contactos.</p>
        </div>

        <button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium"
        >
          + Nuevo
        </button>
      </header>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
        {contacts.length === 0 ? (
          <p className="text-slate-500 text-sm">No hay contactos todavía.</p>
        ) : (
          <div className="divide-y">
            {contacts.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-sm text-slate-500">
                    {c.email ? `📧 ${c.email}` : ""} {c.phone ? `  •  📞 ${c.phone}` : ""}
                  </div>
                  {c.notes && <div className="text-sm text-slate-500 mt-1">{c.notes}</div>}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(c); setOpen(true); }}
                    className="px-3 py-1 bg-slate-100 rounded-lg"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteContact(c.id)}
                    className="px-3 py-1 bg-red-50 text-red-700 rounded-lg"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ContactModal
        isOpen={open}
        onClose={() => { setOpen(false); setEditing(null); }}
        initial={editing}
        onSave={saveContact}
      />
    </Layout>
  );
}