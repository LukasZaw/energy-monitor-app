import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),
  route("/devices", "routes/devices.tsx"),
  route("/profile", "routes/profile.tsx"),
  route("/analytics", "routes/analytics.tsx"),
  route("/devices-report", "routes/devices-report.tsx"),
  route("/summary-report", "routes/summary-report.tsx"),
  route("/", "routes/landing.tsx"),
  route("/admin-dashboard", "routes/admin-dashboard.tsx"),
] satisfies RouteConfig;
