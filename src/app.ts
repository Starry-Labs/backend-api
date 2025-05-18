import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { connectDatabase } from "./config/database";
import { apiRoutes } from "./routes";
import { errorHandler } from "./middleware/auth";
import { config } from "./config";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeDatabase();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      })
    );

    // Body parsing
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Compression
    this.app.use(compression());

    // Logging
    if (config.nodeEnv === "development") {
      this.app.use(morgan("dev"));
    } else {
      this.app.use(morgan("combined"));
    }
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use("/api", apiRoutes);

    // Root endpoint
    this.app.get("/", (req, res) => {
      res.json({
        message: "Starry API is running",
        version: "1.0.0",
        environment: config.nodeEnv,
      });
    });

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        error: "Route not found",
        method: req.method,
        url: req.originalUrl,
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private async initializeDatabase(): Promise<void> {
    await connectDatabase();
  }

  public listen(): void {
    const port = config.port;
    this.app.listen(port, () => {
      console.log(`🚀 Starry API is running on port ${port}`);
      console.log(`🌟 Environment: ${config.nodeEnv}`);
      console.log(`📝 API Documentation: http://localhost:${port}/api/health`);
    });
  }
}

// Start the server
const app = new App();
app.listen();

export default app;
