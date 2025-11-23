import { Router } from "express";
import { z } from "zod";
import { rateLimitLogin } from "../middlewares/rateLimitLogin.js";
import { authenticate, startSession, logout } from "../services/auth.service.js";
import { getSessionObject } from "../security/session.js";

const router = Router();

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

router.post("/login", rateLimitLogin, async (req, res, next) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ ok: false, code: "VALIDATION_ERROR", error: "invalid body" });
    }
    const { username, password } = parsed.data;

    const user = await authenticate(username, password);
    if (!user) {
      return res.status(401).json({
        ok: false,
        code: "INVALID_CREDENTIALS",
        error: "invalid username or password"
      });
    }

    const sessionData = startSession(req, user, getSessionObject);
    return res.status(200).json({
      ok: true,
      data: {
        userId: sessionData.userId,
        userName: sessionData.userName,
        profileId: sessionData.profileId
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    await logout(req);
    // clear cookie name sid if present
    res.clearCookie("sid");
    return res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get("/me", (req, res) => {
  if (!req.session || !req.session.userId) {
    return res
      .status(401)
      .json({ ok: false, code: "UNAUTHORIZED", error: "login required" });
  }
  return res.status(200).json({
    ok: true,
    data: {
      userId: req.session.userId,
      userName: req.session.userName,
      profileId: req.session.profileId,
      status: req.session.status
    }
  });
});

export default router;
