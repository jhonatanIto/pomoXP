import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getCard, postCards } from "../controllers/cardController.js";

export const route = express.Router();

route.use(authMiddleware);
route.get("/", getCard);
route.post("/", postCards);
