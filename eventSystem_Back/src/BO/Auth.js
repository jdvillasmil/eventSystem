import { authenticate, startSession, logout as svcLogout } from "../services/auth.service.js";
import { getSessionObject } from "../security/session.js";

export const Auth = {
  async login(ctx, username, password) {
    const user = await authenticate(username, password);
    if (!user)
      return { ok: false, code: "BAD_CREDENTIALS", error: "invalid username or password" };

    const sessionData = startSession(ctx.req, user, getSessionObject);

    return {
      ok: true,
      data: {
        userId: sessionData.userId,
        userName: sessionData.userName,
        profileId: sessionData.profileId,
        status: sessionData.status   // "authenticated"
      }
    };
  },

  async logout(ctx) {
    await svcLogout(ctx.req);
    return { ok: true };
  },

  async reloadSecurity(ctx) {
    if ((ctx.session?.profileId ?? 0) !== 1) { // ADMIN id=1
      return { ok: false, code: "FORBIDDEN", error: "not allowed" };
    }
    const { Security } = await import("../security/security.js");
    const n = await Security.loadPermission();
    return { ok: true, data: { reloaded: n } };
  }
};
