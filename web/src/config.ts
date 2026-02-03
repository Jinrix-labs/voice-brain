/**
 * Backend API base URL.
 * - Local: http://localhost:4000
 * - Production: your Railway URL, e.g. https://your-app.up.railway.app
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
