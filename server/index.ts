import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();

// ... your existing middleware and routes ...

// Add this root route just above the server.listen!
// This ensures Railway and healthchecks get a response at "/"
app.get("/", (_req, res) => {
  res.send("Baaijus API is running. Welcome!");
});

(async () => {
  const server = await registerRoutes(app);

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use Railway's assigned port, or 5000 locally
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
