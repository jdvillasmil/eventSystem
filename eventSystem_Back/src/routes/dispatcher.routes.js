import { Security } from "../security/security.js";

// Map of BO containers
const BO = {};
async function ensureBO(objectName) {
  if (BO[objectName]) return BO[objectName];
  try {
    const mod = await import(`../BO/${objectName}.js`);
    BO[objectName] = mod[objectName]; // export const X = {...}
    return BO[objectName];
  } catch (err) {
    return null;
  }
}

function parseTx(tx) {
  if (!tx) return null;
  const m = String(tx).match(/^([A-Za-z][A-Za-z0-9_]*)\.([a-zA-Z][a-zA-Z0-9_]*)$/);
  if (!m) return null;
  return { objectName: m[1], methodName: m[2] };
}

export function apiDispatcher() {
  return async function handler(req, res, next) {
    try {
      const { tx, params } = req.body || {};
      if (!tx) return res.status(400).json({ ok: false, code: "TX_REQUIRED", error: "tx is required" });

      const parsed = parseTx(tx);
      if (!parsed) return res.status(400).json({ ok: false, code: "TX_FORMAT", error: "tx must be Object.method" });
      const { objectName, methodName } = parsed;

      // 1) ¿Existe el handler? (antes de seguridad)
      const bo = await ensureBO(objectName);
      if (!bo || typeof bo[methodName] !== "function") {
        return res.status(404).json({ ok: false, code: "TX_NOT_FOUND", error: `unknown tx ${objectName}.${methodName}` });
      }

      // 2) Sesión (exceptúa logins públicos si quieres)
      const session = req.session;
      const isPublic = (objectName === "Auth" && methodName === "login");
      if (!isPublic) {
        if (!session || !session.profileId) {
          return res.status(401).json({ ok: false, code: "SESSION_EXPIRED", error: "login required" });
        }
        // 3) Permisos
        const allowed = Security.isAllowed(Number(session.profileId), objectName, methodName);
        if (!allowed) {
          return res.status(403).json({ ok: false, code: "FORBIDDEN", error: `not allowed: ${objectName}.${methodName}` });
        }
      }

      // 4) Ejecutar BO
      const ctx = { req, res, session: req.session || null };
      const args = Array.isArray(params) ? params : [];
      const result = await bo[methodName](ctx, ...args);

      if (result?.ok === false) {
        const code = result.code || "UNEXPECTED";
        const http =
          code === "FORBIDDEN" ? 403 :
            code === "BAD_CREDENTIALS" ? 401 :
              code === "TX_FORMAT" || code === "TX_REQUIRED" ? 400 :
                500;
        return res.status(http).json(result);
      }

      return res.json(result ?? { ok: true });
    } catch (err) {
      err.code = err.code || "UNEXPECTED";
      next(err);
    }
  };
}
