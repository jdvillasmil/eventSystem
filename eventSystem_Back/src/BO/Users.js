import * as DataBase from "../data/DataBase.js";

export const Users = {
  async me(ctx) {
    const sid = ctx.session;
    if (!sid?.userId) return { ok:false, code:"SESSION_EXPIRED", error:"session required" };
    const { rows } = await DataBase.executeQuery("public", "getUserById", [sid.userId]);
    return { ok:true, data: rows[0] ?? null };
  }
};
