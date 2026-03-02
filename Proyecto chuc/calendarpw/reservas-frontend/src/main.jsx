import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CalendarPage from './pages/CalendarPage'
import './index.css'

// Función para checar si el usuario ya entró antes
const isAuthenticated = () => !!localStorage.getItem('token');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* La primera pantalla que verán todos */}
        <Route path="/" element={<Login />} />

        {/* Solo si están logueados pueden ver la agenda */}
        <Route 
          path="/calendar" 
          element={isAuthenticated() ? <CalendarPage /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  </React.StrictMode>,
)