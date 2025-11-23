const statusEl = document.getElementById("status");
const dump = document.getElementById("meDump");
const btnLogout = document.getElementById("btnLogout");

// --- NUEVO: elementos tester
const out = document.getElementById("out");
const httpTag = document.getElementById("httpTag");
const okTag = document.getElementById("okTag");
const btnSend = document.getElementById("btnSend");
const txInput = document.getElementById("tx");
const paramsInput = document.getElementById("params");

async function loadMe() {
  try {
    const r = await fetch("/me", { credentials: "include" });
    const j = await r.json();
    if (j.ok) {
      statusEl.textContent = "Autenticado como " + (j.data?.userName || "usuario");
      statusEl.className = "ok";
      dump.textContent = JSON.stringify(j.data, null, 2);
    } else {
      window.location.replace("/");
    }
  } catch {
    statusEl.textContent = "Servidor no disponible";
    statusEl.className = "err";
  }
}

btnLogout?.addEventListener("click", async () => {
  try {
    const r = await fetch("/logout", { method: "POST", credentials: "include" });
    const j = await r.json().catch(() => ({}));
    if (j.ok) {
      window.location.replace("/");
    } else {
      statusEl.textContent = "No se pudo cerrar sesion";
      statusEl.className = "err";
    }
  } catch {
    statusEl.textContent = "Error de red";
    statusEl.className = "err";
  }
});

// --------- NUEVO: helper /api
async function callApi(tx, params = []) {
  out.textContent = "Enviando...";
  httpTag.textContent = "HTTP ?";
  httpTag.className = "tag";
  okTag.textContent = "ok ?";
  okTag.className = "tag";

  const body = { tx, params, sid: null }; // sid no es necesario si usas cookie de sesión
  const r = await fetch("/api", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  httpTag.textContent = "HTTP " + r.status;
  httpTag.className = "tag " + (r.ok ? "ok" : "err");

  let json;
  try {
    json = await r.json();
  } catch {
    json = { ok: false, code: "INVALID_JSON", error: "Respuesta no JSON" };
  }

  okTag.textContent = "ok " + String(json.ok);
  okTag.className = "tag " + (json.ok ? "ok" : "err");
  out.textContent = JSON.stringify(json, null, 2);
}

btnSend?.addEventListener("click", async () => {
  let params = [];
  try {
    const raw = paramsInput.value?.trim() || "[]";
    params = JSON.parse(raw);
    if (!Array.isArray(params)) throw new Error("params debe ser un array");
  } catch (e) {
    out.textContent = "Error parseando params: " + e.message;
    okTag.textContent = "ok false";
    okTag.className = "tag err";
    return;
  }
  const tx = (txInput.value || "").trim();
  if (!tx) {
    out.textContent = "Coloca un tx (Objeto.Método)";
    return;
  }
  await callApi(tx, params);
});

// Botones rápidos (Users.me, Events.list, Events.create)
document.querySelectorAll("button[data-tx]").forEach(btn => {
  btn.addEventListener("click", () => {
    const tx = btn.getAttribute("data-tx");
    const p = btn.getAttribute("data-params");
    const params = p ? JSON.parse(p) : [];
    callApi(tx, params);
  });
});

loadMe();
