import express from "express";
import { cards } from "../schema.js";
import { postCards } from "../controllers/cardsControllers.js";
import { db } from "../db.js";

export const route = express.Router();

route.get("/", async (req, res) => {
  const data = await db.select().from(cards);
  res.json(data);
});

route.post("/", postCards);
