import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./api/routes/auth.routes";

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(cookieParser()); // Add cookie parser
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
