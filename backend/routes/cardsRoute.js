import express from "express";
import { postCards } from "../controllers/postCardControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getCard } from "../controllers/getCardController.js";

export const route = express.Router();

route.use(authMiddleware);
route.get("/", getCard);
route.post("/", postCards);
