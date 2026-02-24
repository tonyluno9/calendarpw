import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  if (!token) return null;

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/calendar" style={{ marginRight: 10 }}>Calendario</Link>

      {role === "admin" && (
        <Link to="/admin/spaces" style={{ marginRight: 10 }}>
          Espacios
        </Link>
      )}

      <button onClick={logout}>Salir</button>
    </nav>
  );
}