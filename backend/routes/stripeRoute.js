import express from "express";
import { stripeController } from "../controllers/stripeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const stripeRoute = express.Router();

stripeRoute.post("/create-checkout-session", authMiddleware, stripeController);
