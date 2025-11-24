import { executeQuery } from "../data/DataBase.js";

export const Events = {
  async list(ctx) {
    const { rows } = await executeQuery("Events", "list");
    return { ok: true, data: rows };
  },

  async get(ctx, id) {
    const { rows } = await executeQuery("Events", "get", [id]);
    if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Event not found" };
    return { ok: true, data: rows[0] };
  },

  async create(ctx, payload) {
    const { title, description, date, location_id, capacity, ticket_price } = payload;
    const created_by = ctx.session?.userId || null;

    // Basic validation
    if (!title || !date) return { ok: false, code: "VALIDATION_ERROR", error: "Title and date are required" };

    const { rows } = await executeQuery("Events", "create", [title, description, date, location_id, capacity, created_by, ticket_price || 0]);
    return { ok: true, data: rows[0] };
  },

  async update(ctx, payload) {
    const { id, title, description, date, location_id, capacity, ticket_price } = payload;
    const { rows } = await executeQuery("Events", "update", [id, title, description, date, location_id, capacity, ticket_price || 0]);
    if (rows.length === 0) return { ok: false, code: "NOT_FOUND", error: "Event not found" };
    return { ok: true, data: rows[0] };
  },

  async delete(ctx, payload) {
    const { id } = payload;
    await executeQuery("Events", "delete", [id]);
    return { ok: true };
  }
};
