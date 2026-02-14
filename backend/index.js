import "./config/dotenv.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routers/authRouter.js";
import connectDB from "./config/db.js";
import eventRouter from "./routers/eventRouter.js";
import eventRegistrationRouter from "./routers/eventRegistrationRouter.js";
import paymentRouter from "./routers/paymentRouter.js";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL,
  ].filter(Boolean)
);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use("/api/auth", authRouter);
app.use("/api/events", eventRouter);
app.use("/api/event-registration", eventRegistrationRouter);
app.use("/api/payment",paymentRouter);


app.listen(PORT, () => {
  connectDB();
  console.log(`Server started on port ${PORT}`);
});
