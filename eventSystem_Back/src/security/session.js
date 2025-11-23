import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import fs from "node:fs";
import path from "node:path";

function readJSON(relPath) {
  // leer desde el directorio del proyecto, no usar import.meta.url
  const abs = path.resolve(process.cwd(), relPath);
  const raw = fs.readFileSync(abs, "utf8");
  return JSON.parse(raw);
}

export function getSessionObject() {
  const cfg = readJSON("configs/sessionconfig.json");
  return JSON.parse(JSON.stringify(cfg.sessionShape));
}

export function createSessionMiddleware() {
  const cfg = readJSON("configs/sessionconfig.json");
  const PgStore = connectPgSimple(session);

  const isProd = process.env.NODE_ENV === "production";
  const cookieCfg = { ...cfg.cookie };
  if (isProd) {
    cookieCfg.secure = true;
    // cookieCfg.sameSite = "none"; // usar si front esta en otro dominio con https
  }

  const store = new PgStore({
    conString: process.env.DATABASE_URL,
    schemaName: process.env.SESSION_SCHEMA || "public",
    createTableIfMissing: true
  });

  const sessionSecret =
    process.env[cfg.secretEnv] || process.env.SESSION_SECRET || "change-me";

  return session({
    secret: sessionSecret,
    resave: cfg.resave,
    saveUninitialized: cfg.saveUninitialized,
    store,
    cookie: {
      httpOnly: cookieCfg.httpOnly,
      sameSite: cookieCfg.sameSite,
      secure: cookieCfg.secure,
      maxAge: cookieCfg.maxAgeMs
    },
    name: "sid"
  });
}
