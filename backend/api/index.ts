/**
 * Vercel serverless entry: delegate all requests to the main Express app.
 * Rewrites in vercel.json send (.*) here; the app handles routing.
 */
import app from "../src/index";

export default app;
