// Libraries
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Middlewares
import {
  errorHandler,
  notFoundHandler,
} from "./api/middlewares/error.middleware";
import { responseInterceptor } from "./api/middlewares/response-interceptor.middleware";

// Config
import { envConfig } from "./configs/env.config";

// Routers
import authRouter from "./api/routes/auth.route";
import categoryRouter from "./api/routes/category.route";
import productRouter from "./api/routes/product.route";
import userRouter from "./api/routes/user.route";
import watchlistRouter from "./api/routes/watchlist.route";
import sellerRouter from "./api/routes/seller.route";
import adminRouter from "./api/routes/admin.route";
import upgradeRequestRouter from "./api/routes/upgradeRequest.route";

const app: Application = express();
const PORT: number = envConfig.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Response Interceptor - Auto wrap success responses (MUST be placed before routes)
app.use(responseInterceptor);

// Routes
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/users", upgradeRequestRouter);
app.use("/watchlist", watchlistRouter);
app.use("/seller", sellerRouter);
app.use("/admin", adminRouter);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// App Listen
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
