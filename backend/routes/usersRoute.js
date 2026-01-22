import express from "express";
import { userData } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const usersRoute = express.Router();

usersRoute.get("/", authMiddleware, userData);
