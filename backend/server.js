import express from "express";
import cors from "cors";
import "dotenv/config";
import { route } from "./routes/cardsRoute.js";
import { authRoute } from "./routes/authRoute.js";

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

app.listen(PORT, () => console.log("Server is running as always"));
