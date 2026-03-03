import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";




export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });

localStorage.setItem('token', response.data.token);
localStorage.setItem('role', response.data.user?.role || 'user');

navigate('/calendar');
    } catch (err) {
      alert(err?.response?.data?.message || "Error al registrarse");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Crear cuenta</h2>
        <p className="text-slate-500 text-center text-sm mb-8">Regístrate para usar tu agenda.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre</label>
            <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
              value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</label>
            <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
              value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contraseña</label>
            <input type="password" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
              value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>

          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold">
            Registrarme
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          ¿Ya tienes cuenta? <span className="text-indigo-600 font-bold cursor-pointer" onClick={()=>navigate("/")}>Inicia sesión</span>
        </p>
      </div>
    </div>
  );
}