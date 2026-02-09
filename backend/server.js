import express from "express";
import cors from "cors";
import "dotenv/config";
import { route } from "./routes/cardsRoute.js";
import { authRoute } from "./routes/authRoute.js";
import { usersRoute } from "./routes/usersRoute.js";
import { googleRoute } from "./routes/googleRoute.js";
import passport from "passport";
import "./config/passport.js";
import { notesRouter } from "./routes/notesRoute.js";
import { stripeRoute } from ".//routes/stripeRoute.js";
import { stripeWebhookController } from "./controllers/stripeController.js";

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://pomoxp.com"],
//   }),
// );
app.use(cors());

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController,
);

app.use(express.json());

app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  next();
});

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/cards", route);
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/notes", notesRouter);

app.use("/auth/google", googleRoute);
app.use("/api/stripe", stripeRoute);

app.listen(PORT, () => console.log("Server is running as always"));
