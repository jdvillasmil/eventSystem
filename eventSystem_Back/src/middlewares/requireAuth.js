export function requireAuth(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      return res
        .status(401)
        .json({ ok: false, code: "UNAUTHORIZED", error: "login required" });
    }
    next();
  } catch (err) {
    next(err);
  }
}
