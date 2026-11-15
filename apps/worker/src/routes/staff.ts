import { Hono } from "hono";
import { accessAuthMiddleware } from "../middleware/accessAuth.js";

export const staffRouter = new Hono();

// Identity endpoint
staffRouter.get("/me", accessAuthMiddleware(), (c) => {
  return c.json({ user: c.get("staffUser") });
});

// Admin-only test endpoint
staffRouter.post("/admin-action", accessAuthMiddleware("admin"), (c) => {
  return c.json({ success: true, message: "Admin action authorized" });
});
