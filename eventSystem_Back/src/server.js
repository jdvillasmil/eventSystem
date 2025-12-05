import "dotenv/config.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "node:path";

import { createSessionMiddleware } from "./security/session.js";
import { apiDispatcher } from "./routes/dispatcher.routes.js";
import { Security } from "./security/security.js";
import authRoutes from "./routes/auth.routes.js";
import { requireAuth } from "./middlewares/requireAuth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./utils/logger.js";

const app = express();

// Preload Security permissions cache on startup
(async () => {
  try { const n = await Security.loadPermission(); console.log(`[security] loaded ${n} permissions`); }
  catch (e) { console.error('Security cache load failed:', e); }
})();

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin" }
    // No activamos contentSecurityPolicy aqui
  })
);

app.use(requestLogger());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
  })
);

app.use(createSessionMiddleware());
app.use(express.json());

// health
app.get("/health", (req, res) => res.json({ ok: true, data: "healthy" }));

// auth api
app.use(authRoutes);

app.get("/", (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect("/dashboard");
  }
  const file = path.resolve(process.cwd(), "public", "index.html");
  return res.sendFile(file);
});

// Ruta protegida del dashboard (ya la tenias)
app.get("/dashboard", requireAuth, (req, res) => {
  const file = path.resolve(process.cwd(), "public", "dashboard.html");
  res.sendFile(file);
});

app.post('/api', apiDispatcher());

// static despues de las rutas anteriores
app.use(express.static("public"));

app.use((req, res, next) => {
  res.status(404).json({ ok: false, code: "NOT_FOUND", error: "not found" });
});


// errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on http://localhost:${PORT}`));