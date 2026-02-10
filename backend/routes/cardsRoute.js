import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  chart_data,
  getCard,
  postCards,
} from "../controllers/cardController.js";

export const route = express.Router();

route.use(authMiddleware);
route.get("/", getCard);
route.post("/", postCards);
route.post("/chart_data", chart_data);
