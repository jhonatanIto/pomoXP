import express from "express";
import { getNotes, postNotes } from "../controllers/notesController.js";

export const notesRouter = express.Router();

notesRouter.get("/", getNotes);
notesRouter.post("/", postNotes);
