import express from "express";
import {
  allUsers,
  deleteUser,
  editUser,
  userData,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const usersRoute = express.Router();

usersRoute.get("/all", allUsers);
usersRoute.use(authMiddleware);
usersRoute.get("/", userData);
usersRoute.put("/", editUser);
usersRoute.delete("/", deleteUser);
