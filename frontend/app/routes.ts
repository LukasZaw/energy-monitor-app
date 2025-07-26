import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),
  route("/devices", "routes/devices.tsx"),
  route("/profile", "routes/profile.tsx"),
] satisfies RouteConfig;