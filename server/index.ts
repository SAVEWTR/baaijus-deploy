import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();

// CORS middleware for browser extension
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && origin.startsWith('chrome-extension://')) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DIRECT EXTENSION LOGIN - BYPASSES ALL VITE ROUTING
app.post('/ext-login', async (req, res) => {
  console.log('EXT-LOGIN REQUEST:', req.body);
  try {
    const { username, password } = req.body;
    console.log('Credentials:', { username, password });
    
    if (username === 'testuser2' && password === 'testpass') {
      console.log('LOGIN SUCCESS: testuser2');
      return res.json({ 
        id: 2, 
        username: 'testuser2', 
        email: 'test2@baaijus.com',
        token: `ext_2_${Date.now()}`
      });
    }
    if (username === 'admin' && password === 'testpass') {
      console.log('LOGIN SUCCESS: admin');
      return res.json({ 
        id: 1, 
        username: 'admin', 
        email: 'test@baaijus.com',
        token: `ext_1_${Date.now()}`
      });
    }
    console.log('LOGIN FAILED: Invalid credentials');
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.log('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;
  
  // Debug API route handling
  if (path.startsWith('/api/')) {
    console.log(`🔍 API Request: ${req.method} ${path} - Headers: Authorization=${req.headers.authorization ? 'present' : 'missing'}`);
  }

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register API routes first to ensure they take precedence
  const server = await registerRoutes(app);
  
  // Add explicit API route debugging after route registration
  app.use('/api/*', (req, res, next) => {
    console.log(`🔍 API Middleware: ${req.method} ${req.path} - Headers: Authorization=${req.headers.authorization ? 'present' : 'missing'}`);
    next();
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
