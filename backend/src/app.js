import express from "express";
import { logger } from "./middleware/logger.js";
import router from "./routes.js";

const app = express();

app.use(express.json());
app.use(logger);
app.use("/api", router);

export default app;
