import React, { useEffect, useState } from "react";

export default function ContactModal({ isOpen, onClose, initial, onSave }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setName(initial?.name || "");
    setEmail(initial?.email || "");
    setPhone(initial?.phone || "");
    setNotes(initial?.notes || "");
  }, [isOpen, initial]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {initial?.id ? "Editar contacto" : "Nuevo contacto"}
        </h2>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Nombre</label>
          <input className="p-3 bg-gray-50 border rounded-lg" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Correo</label>
          <input className="p-3 bg-gray-50 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Teléfono</label>
          <input className="p-3 bg-gray-50 border rounded-lg" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Notas</label>
          <textarea className="p-3 bg-gray-50 border rounded-lg" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
          <button
            onClick={() => onSave({ name: name.trim(), email: email.trim() || null, phone: phone.trim() || null, notes: notes.trim() || null })}
            disabled={!name.trim()}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg disabled:bg-slate-300"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}