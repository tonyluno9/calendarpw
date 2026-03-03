import React, { useEffect, useState } from "react";

const ReservationModal = ({ isOpen, onClose, onConfirm, spaces, errorMessage }) => {
  const [selectedSpace, setSelectedSpace] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedSpace("");
      setTitle("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedSpace || !title.trim()) return;
    onConfirm({ space_id: Number(selectedSpace), title: title.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Nueva Reserva</h2>
        <p className="text-gray-600">Elige categoría y escribe el título:</p>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Ej: "Programación"'
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Categoría</label>
          <select
            value={selectedSpace}
            onChange={(e) => setSelectedSpace(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              -- Elige un espacio --
            </option>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name}
              </option>
            ))}
          </select>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSpace || !title.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium shadow-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;