import express from 'express';
import cors from "cors";
import { MongoClient } from 'mongodb';
import authRoutes from "./routes/auth.js";
import subjectRoutes from "./routes/subject.js";
import externalRoutes from "./routes/external.js";
import settingsRoutes from "./routes/settings.js";
import dotenv from "dotenv";
git 

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
// var x, y, total;
// var catMarks;
// var assignmentMarks;


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
    app.use("/auth", authRoutes);
    app.use("/subject", subjectRoutes);
    app.use("/exter",externalRoutes);
    app.use("/settings",settingsRoutes);

    app.listen(PORT, () => {
        console.log(`server is running at ${'http://localhost:5000/'}`)
    })
    }catch(err){
        console.error("failed to connect to mongodb");
    }
}
startServer();