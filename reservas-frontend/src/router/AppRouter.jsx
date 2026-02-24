import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import CalendarPage from "../pages/CalendarPage";
import SpacesAdmin from "../pages/SpacesAdmin";
import Navbar from "../components/Navbar";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <CalendarPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/spaces"
          element={
            <PrivateRoute>
              <SpacesAdmin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}