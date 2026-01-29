import express from "express";
import { getNotes, postNotes } from "../controllers/notesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const notesRouter = express.Router();

notesRouter.use(authMiddleware);
notesRouter.get("/", getNotes);
notesRouter.post("/", postNotes);
