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

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend port
  }),
);
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/cards", route);
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/notes", notesRouter);

app.use(passport.initialize());
app.use("/auth/google", googleRoute);

app.listen(PORT, () => console.log("Server is running as always"));
