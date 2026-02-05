import express from "express";
import {
  deleteUser,
  editUser,
  userData,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const usersRoute = express.Router();

usersRoute.use(authMiddleware);
usersRoute.get("/", userData);
usersRoute.put("/", editUser);
usersRoute.delete("/", deleteUser);
