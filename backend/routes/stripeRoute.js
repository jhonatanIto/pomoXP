import express from "express";
import {
  stripeController,
  stripeWebhookController,
} from "../controllers/stripeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const stripeRoute = express.Router();

stripeRoute.use(authMiddleware);
stripeRoute.post("/create-checkout-session", stripeController);
stripeRoute.post("/webhook", stripeWebhookController);
