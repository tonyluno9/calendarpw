import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import { apiFetch } from "../api/apiFetch";

const BASE_URL = "/api";

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    capacity: 30,
    available_from: "07:00",
    available_to: "22:00",
  });

  const [editingId, setEditingId] = useState(null);

  async function load() {
    setError("");
    const res = await apiFetch(`${BASE_URL}/spaces`, { method: "GET" });
    if (!res.ok) throw new Error("No se pudieron cargar las categorías");
    const data = await res.json();
    setSpaces(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function startEdit(space) {
    setEditingId(space.id);
    setForm({
      name: space.name || "",
      description: space.description || "",
      capacity: space.capacity ?? 1,
      available_from: (space.available_from || "07:00").slice(0, 5),
      available_to: (space.available_to || "22:00").slice(0, 5),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      capacity: 30,
      available_from: "07:00",
      available_to: "22:00",
    });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      capacity: Number(form.capacity),
      available_from: form.available_from,
      available_to: form.available_to,
    };

    try {
      const url = editingId
        ? `${BASE_URL}/admin/spaces/${editingId}`
        : `${BASE_URL}/admin/spaces`;

      const method = editingId ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.message || "No se pudo guardar la categoría");

      await load();
      resetForm();
    } catch (e2) {
      setError(e2.message);
    }
  }

  async function remove(id) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    setError("");
    try {
      const res = await apiFetch(`${BASE_URL}/admin/spaces/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "No se pudo eliminar");
      await load();
      if (editingId === id) resetForm();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Layout>
      <header className="mb-6 px-2 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Categorías</h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra las categorías disponibles para reservar.
          </p>
        </div>
      </header>

      {error && (
        <div className="mb-4 mx-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {editingId ? "Editar categoría" : "Nueva categoría"}
          </h2>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Nombre
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Descripción (opcional)
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                rows={3}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Capacidad
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                  value={form.capacity}
                  onChange={(e) => setField("capacity", e.target.value)}
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Desde
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                  value={form.available_from}
                  onChange={(e) => setField("available_from", e.target.value)}
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Hasta
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                  value={form.available_to}
                  onChange={(e) => setField("available_to", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium">
                {editingId ? "Guardar cambios" : "Crear categoría"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-100 rounded-lg font-medium"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Lista</h2>

          {spaces.length === 0 ? (
            <p className="text-slate-500 text-sm">No hay categorías todavía.</p>
          ) : (
            <div className="divide-y">
              {spaces.map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">
                      Cap: {s.capacity ?? "-"} • {String(s.available_from || "").slice(0, 5)} -{" "}
                      {String(s.available_to || "").slice(0, 5)}
                    </div>
                    {s.description && (
                      <div className="text-sm text-slate-600 mt-1">{s.description}</div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(s)}
                      className="px-3 py-1 bg-slate-100 rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => remove(s.id)}
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
      </div>
    </Layout>
  );
}