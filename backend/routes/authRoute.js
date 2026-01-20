import express from "express";
import { authUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/loginController.js";

export const authRoute = express.Router();

authRoute.post("/register", authUser);

authRoute.post("/login", loginUser);
