import { Context, Next } from "hono";

export interface StaffAuthUser {
  id: string;
  email: string;
  role: "staff" | "admin";
}

declare module "hono" {
  interface ContextVariableMap {
    staffUser: StaffAuthUser;
  }
}

export function accessAuthMiddleware(requiredRole?: "admin") {
  return async (c: Context, next: Next) => {
    // 1. Check Cloudflare Access JWT header or mock header in development
    const accessEmail =
      c.req.header("Cf-Access-Authenticated-User-Email") ||
      c.req.header("X-Mock-Staff-Email");

    if (!accessEmail) {
      return c.json({ error: "unauthorized", message: "Missing Cloudflare Access authentication" }, 401);
    }

    // 2. Look up user in D1 staff_user table
    const db = c.env.DB as D1Database;
    const user = await db
      .prepare("SELECT id, email, role, status FROM staff_user WHERE email = ?")
      .bind(accessEmail)
      .first<{ id: string; email: string; role: "staff" | "admin"; status: string }>();

    if (!user || user.status !== "active") {
      return c.json({ error: "forbidden", message: "Staff account not found or disabled" }, 403);
    }

    // 3. Enforce RBAC
    if (requiredRole === "admin" && user.role !== "admin") {
      return c.json({ error: "forbidden", message: "Admin role required for this action" }, 403);
    }

    c.set("staffUser", {
      id: user.id,
      email: user.email,
      role: user.role
    });

    await next();
  };
}
