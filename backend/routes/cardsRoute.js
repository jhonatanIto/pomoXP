import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  chart_data,
  getCard,
  postCards,
} from "../controllers/cardController.js";

export const route = express.Router();

route.get("/chart_data", chart_data);
route.use(authMiddleware);
route.get("/", getCard);

route.post("/", postCards);
