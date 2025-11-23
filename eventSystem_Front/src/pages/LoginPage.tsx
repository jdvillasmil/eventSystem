import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      await login(username, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Unexpected error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-brand">EventSystem</div>
          <p className="auth-subtitle">
            Panel de administracion de eventos. Inicia sesion para continuar.
          </p>

          {errorMessage && <div className="auth-error">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="username">
                Usuario
              </label>
              <input
                id="username"
                className="auth-input"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="auth-input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={submitting}
            >
              {submitting ? "Ingresando..." : "Iniciar sesion"}
            </button>
          </form>
        </div>
      </div>

      <div className="auth-hero">
        <div className="auth-hero-card">
          <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
            Sistema de control de eventos
          </h2>
          <p style={{ opacity: 0.85, marginBottom: "0.75rem" }}>
            Gestiona reservas, registro de asistentes, staff, pagos y reportes
            desde un solo panel.
          </p>
          <p style={{ opacity: 0.7, fontSize: "0.85rem" }}>
            El login esta conectado al backend mediante el dispatcher
            <code> /api </code> y sesiones en PostgreSQL.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
