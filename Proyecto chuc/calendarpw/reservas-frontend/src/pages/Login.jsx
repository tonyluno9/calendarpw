import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // El Hook siempre va aquí arriba, fuera de las funciones
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Intentando entrar con:", email);
    
    try {
      // Conectamos con tu backend de Laravel en el puerto 8001
      const response = await axios.post('/api/login', { email, password });

localStorage.setItem('token', response.data.token);
localStorage.setItem('role', response.data.user?.role || 'user');

navigate('/calendar');
    } catch (error) {
      console.error(error);
      alert("Credenciales incorrectas o error en el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
        {/* Logo minimalista tipo Notion */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg shadow-inner"></div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-slate-900 tracking-tight mb-2">Bienvenido</h2>
        <p className="text-slate-500 text-center text-sm mb-8">Ingresa tus datos para gestionar tu agenda.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1 text-left">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm bg-slate-50"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1 text-left">Contraseña</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm bg-slate-50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-lg mt-4">
            Entrar
          </button>
        </form>

        <span
  className="text-indigo-600 font-bold cursor-pointer hover:underline"
  onClick={() => navigate("/register")}
>
  Regístrate gratis
</span>
      </div>
    </div>
  );
};

export default Login;