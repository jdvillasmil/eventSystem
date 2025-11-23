export function errorHandler(err, req, res, next) {
  const status =
    err.status ||
    (err.code === "UNAUTHORIZED" ? 401
      : err.code === "INVALID_CREDENTIALS" ? 401
      : err.code === "RATE_LIMIT" ? 429
      : 500);

  const payload = {
    ok: false,
    code: err.code || "INTERNAL_ERROR",
    error: err.publicMessage || err.message || "internal error"
  };

  if (process.env.NODE_ENV !== "production") {
    // redact db details implicitly by not including err.stack by default
    payload.trace = err.stack?.split("\n").slice(0, 3).join(" | ");
  }

  res.status(status).json(payload);
}
