// Nota: no usar tildes en comentarios ni en codigo
const form = document.getElementById("loginForm");
const statusMsg = document.getElementById("statusMsg");
const u = document.getElementById("usernameReal");
const p = document.getElementById("passwordReal");

// defensa 1: habilitar campos solo con interaccion real del usuario
function enableRealInputsOnce() {
  if (!u.hasAttribute("readonly") && !p.hasAttribute("readonly")) return;
  u.removeAttribute("readonly");
  p.removeAttribute("readonly");
}

// limpiar posibles valores auto rellenados por el navegador
function wipeValues() {
  u.value = "";
  p.value = "";
}

window.addEventListener("DOMContentLoaded", async () => {
  // limpiar y bloquear hasta interaccion
  wipeValues();

  // cualquier gesto del usuario habilita los inputs
  ["pointerdown","keydown","focus","touchstart"].forEach(evt => {
    window.addEventListener(evt, enableRealInputsOnce, { once: true, passive: true });
  });

  try {
    const r = await fetch("/me", { credentials: "include" });
    const j = await r.json().catch(() => ({}));
    if (j?.ok) {
      // nunca mostrar datos en pantalla de login
      window.location.replace("/dashboard");
      return;
    }
    statusMsg.textContent = "No has iniciado sesion";
    statusMsg.className = "status muted";
  } catch {
    statusMsg.textContent = "Servidor no disponible";
    statusMsg.className = "status err";
  }
});

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  statusMsg.textContent = "Autenticando...";
  statusMsg.className = "status muted";

  const body = {
    username: u.value.trim(),
    password: p.value
  };

  try {
    const r = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });
    const j = await r.json();
    if (j.ok) {
      window.location.replace("/dashboard");
    } else {
      statusMsg.textContent = (j.error || "Error de login");
      statusMsg.className = "status err";
    }
  } catch {
    statusMsg.textContent = "Error de red";
    statusMsg.className = "status err";
  }
});
