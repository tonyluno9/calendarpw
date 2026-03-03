import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/apiFetch";

const BASE_URL = "/api";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ===== Logout =====
  async function logout() {
    try {
      await apiFetch(`${BASE_URL}/logout`, { method: "POST" }); // <-- NO "/api/logout" hardcodeado fuera
    } catch (e) {
      console.error("Error cerrando sesión", e);
    } finally {
      localStorage.clear();
      navigate("/", { replace: true });
    }
  }

  // ===== Sidebar categories =====
  const [spaces, setSpaces] = useState([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [spaceError, setSpaceError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadSpaces() {
    setSpaceError("");
    setLoadingSpaces(true);
    try {
      const res = await apiFetch(`${BASE_URL}/spaces`, { method: "GET" });
      if (!res.ok) throw new Error("Error cargando categorías");
      const data = await res.json();
      setSpaces(Array.isArray(data) ? data : []);
    } catch (e) {
      setSpaceError(e.message);
    } finally {
      setLoadingSpaces(false);
    }
  }

  useEffect(() => {
    loadSpaces();
  }, []);

  const defaultSpaces = useMemo(
    () => [
      { id: "default-universidad", name: "Universidad" },
      { id: "default-emprendimiento", name: "Emprendimiento" },
      { id: "default-desarrollo", name: "Desarrollo" },
      { id: "default-personal", name: "Personal" },
    ],
    []
  );

  const sidebarSpaces = spaces.length ? spaces : defaultSpaces;

  const fixedColorByName = (name) => {
    switch ((name || "").toLowerCase()) {
      case "universidad":
        return "bg-blue-400";
      case "emprendimiento":
        return "bg-emerald-400";
      case "desarrollo":
        return "bg-amber-400";
      case "personal":
        return "bg-rose-400";
      default:
        return "bg-slate-400";
    }
  };

  const fixedEmojiByName = (name) => {
    switch ((name || "").toLowerCase()) {
      case "universidad":
        return "🎓";
      case "emprendimiento":
        return "🚀";
      case "desarrollo":
        return "💻";
      case "personal":
        return "👤";
      default:
        return "🏷️";
    }
  };

  const stableDotClass = (name) => {
    const palette = [
      "bg-blue-400",
      "bg-emerald-400",
      "bg-amber-400",
      "bg-rose-400",
      "bg-indigo-400",
      "bg-teal-400",
      "bg-purple-400",
      "bg-orange-400",
    ];
    const s = String(name || "");
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return palette[h % palette.length];
  };

  async function createSpace() {
    const name = newName.trim();
    if (!name) return;

    setSaving(true);
    setSpaceError("");
    try {
      const payload = {
        name,
        description: null,
        capacity: 30,
        available_from: "07:00",
        available_to: "22:00",
      };

      const res = await apiFetch(`${BASE_URL}/spaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "No se pudo crear la categoría");

      setNewName("");
      setShowNew(false);
      await loadSpaces();
    } catch (e) {
      setSpaceError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const NavLinkBtn = ({ to, children }) => (
    <Link
      to={to}
      className={`w-full block text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${pathname === to ? "bg-slate-200" : "hover:bg-slate-200"}`}
    >
      {children}
    </Link>
  );

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900">
      <aside className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-6 h-6 bg-indigo-500 rounded shadow-sm"></div>
          <span className="font-bold tracking-tight text-lg">Mi Agenda</span>
        </div>

        <div className="space-y-1 mb-5 px-2">
          <NavLinkBtn to="/calendar">📅 Calendario</NavLinkBtn>
          <NavLinkBtn to="/contacts">👥 Contactos</NavLinkBtn>
          <NavLinkBtn to="/invitations">✉️ Invitaciones</NavLinkBtn>
        </div>

        <nav className="flex-1 space-y-1">
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Categorías
            </div>

            <button
              onClick={() => setShowNew((v) => !v)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              title="Nueva categoría"
            >
              + Nueva
            </button>
          </div>

          {showNew && (
            <div className="px-2 mb-2">
              <div className="flex gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Gym"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
                />
                <button
                  onClick={createSpace}
                  disabled={saving || !newName.trim()}
                  className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm disabled:bg-slate-400"
                >
                  {saving ? "..." : "Crear"}
                </button>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Se guardará en tu base de datos.
              </div>
            </div>
          )}

          {spaceError && (
            <div className="mx-2 mb-2 bg-red-50 border border-red-200 text-red-700 p-2 rounded-lg text-xs">
              {spaceError}
            </div>
          )}

          {loadingSpaces ? (
            <div className="px-2 text-sm text-slate-400">Cargando...</div>
          ) : (
            sidebarSpaces.map((s) => {
              const isFixed = ["Universidad", "Emprendimiento", "Desarrollo", "Personal"].includes(s.name);
              const dotClass = isFixed ? fixedColorByName(s.name) : stableDotClass(s.name);
              const emoji = isFixed ? fixedEmojiByName(s.name) : "🏷️";

              return (
                <button
                  key={s.id}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-200 text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full ${dotClass}`}></span>
                  {emoji} {s.name}
                </button>
              );
            })
          )}
        </nav>

        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full px-3 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>

          <div className="mt-3 px-2 text-xs text-slate-400">
            PROYECTO PRIMER PARCIAL
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-white p-8">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}