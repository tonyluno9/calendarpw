import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-white font-sans text-slate-900">
      {/* Sidebar Estilo Notion - Agenda Personal */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-6 h-6 bg-indigo-500 rounded shadow-sm"></div>
          <span className="font-bold tracking-tight text-lg">Mi Agenda</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-3">
            Categorías
          </div>
          
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-200 text-sm font-medium flex items-center gap-2 transition-colors">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> 🎓 Universidad
          </button>
          
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-200 text-sm font-medium flex items-center gap-2 transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 🚀 Emprendimiento
          </button>
          
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-200 text-sm font-medium flex items-center gap-2 transition-colors">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> 💻 Desarrollo
          </button>
          
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-200 text-sm font-medium flex items-center gap-2 transition-colors">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span> 👤 Personal
          </button>
        </nav>

        <div className="mt-auto p-2 text-xs text-slate-400 border-t border-slate-200 pt-4">
          Alessandro • 2026
        </div>
      </aside>

      {/* Área de la Agenda */}
      <main className="flex-1 overflow-auto bg-white p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;