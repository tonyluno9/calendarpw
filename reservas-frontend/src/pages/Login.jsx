import { useState } from "react";
import { apiFetch } from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      window.location.href = "/calendar";
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "60px auto" }}>
      <h1>Login</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>

      {err && <p style={{ marginTop: 10 }}>{err}</p>}
    </div>
  );
}
