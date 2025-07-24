import express from 'express';
import cors from "cors";
import { MongoClient } from 'mongodb';
import authRoutes from "./routes/auth.js";
import subjectRoutes from "./routes/subject.js";
import externalRoutes from "./routes/external.js";
import settingsRoutes from "./routes/settings.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const url = process.env.MONGO_URL;
const dbName = 'project_database';
let db;

async function startServer() {
  try {
    const client = await MongoClient.connect(url);
    console.log("connected to mongodb");
    db = client.db(dbName);

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // Routes
    app.use("/auth", authRoutes);
    app.use("/subject", subjectRoutes);
    app.use("/exter", externalRoutes);
    app.use("/settings", settingsRoutes);

    // Serve static React files
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    app.listen(PORT, () => {
      console.log(`server is running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("failed to connect to mongodb", err);
  }
}

startServer();
