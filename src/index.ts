import express, { Express } from "express";
import cors from "cors";
import { PORT } from "./utils/secrets";
import rootRouter from "./routes/index.routes";
import { errorMiddleware } from "./middleware/error.middlwares";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/api", rootRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
