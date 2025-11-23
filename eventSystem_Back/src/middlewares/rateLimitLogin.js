import rateLimit from "express-rate-limit";

export const rateLimitLogin = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    return res
      .status(429)
      .json({ ok: false, code: "RATE_LIMIT", error: "too many attempts" });
  },
  keyGenerator: (req, res) => {
    // Use IP + username if present to be fair
    const ip = req.ip || "unknown";
    const u = (req.body && req.body.username) || "";
    return `${ip}:${u}`;
  }
});
