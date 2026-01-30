import express from "express";
import {
  deleteNotes,
  getNotes,
  postNotes,
  updateNotes,
} from "../controllers/notesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const notesRouter = express.Router();

notesRouter.use(authMiddleware);
notesRouter.get("/", getNotes);
notesRouter.post("/", postNotes);
notesRouter.put("/:id", updateNotes);
notesRouter.delete("/:id", deleteNotes);
