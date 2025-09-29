// src/routes/notes.ts
import { Router } from "express";
import Note from "../models/Note";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/notes - get all notes for logged-in user
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const notes = await Note.find({ userId });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/notes - create a new note
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { title, content } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!title || !content) return res.status(400).json({ message: "Title and content required" });

    const note = await Note.create({ title, content, userId });
    res.status(201).json(note);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/notes/:id - delete a note
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
