import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CalendarPage from "./pages/CalendarPage";
import ContactsPage from "./pages/ContactsPage";
import AdminSpacesPage from "./pages/AdminSpacesPage";
import SpacesPage from "./pages/SpacesPage";

import "./index.css";

const isAuthenticated = () => !!localStorage.getItem("token");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
  path="/spaces"
  element={isAuthenticated() ? <SpacesPage /> : <Navigate to="/" replace />}
/>
        <Route
  path="/admin/spaces"
  element={
    isAuthenticated() && localStorage.getItem("role") === "admin"
      ? <AdminSpacesPage />
      : <Navigate to="/calendar" replace />
  }
/>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/calendar"
          element={isAuthenticated() ? <CalendarPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/contacts"
          element={isAuthenticated() ? <ContactsPage /> : <Navigate to="/" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);