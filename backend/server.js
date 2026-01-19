import express from "express";
import "dotenv/config";
import { route } from "./routes/cardsRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/api/cards", route);

app.listen(PORT, () => console.log("Server is running as always"));
