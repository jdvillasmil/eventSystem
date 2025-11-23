import { randomUUID } from "crypto";

export function requestLogger() {
  return (req, res, next) => {
    const start = process.hrtime.bigint();
    const requestId = randomUUID();
    req.requestId = requestId;

    res.on("finish", () => {
      const end = process.hrtime.bigint();
      const ms = Number(end - start) / 1e6;
      const userId = req.session?.userId || "anon";
      const logLine = JSON.stringify({
        time: new Date().toISOString(),
        requestId,
        method: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        ms: Math.round(ms),
        userId
      });
      // simple stdout logger
      console.log(logLine);
    });

    next();
  };
}
