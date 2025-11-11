const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticate, requireRole } = require("../middleware/auth");

// add comment
router.post("/", async (req, res) => {
  const { postId, content, name, email, userId } = req.body;
  if (!postId || !content)
    return res.status(400).json({ error: "postId and content required" });
  const comment = await prisma.comment.create({
    data: { postId, content, name, email, userId },
  });
  res.json(comment);
});

// approve
router.post(
  "/:id/approve",
  authenticate,
  requireRole(["AUTHOR", "ADMIN"]),
  async (req, res) => {
    try {
      const updated = await prisma.comment.update({
        where: { id: req.params.id },
        data: { approved: true },
      });
      res.json(updated);
    } catch (err) {
      res.status(404).json({ error: "Not found" });
    }
  }
);

// delete
router.delete(
  "/:id",
  authenticate,
  requireRole(["AUTHOR", "ADMIN"]),
  async (req, res) => {
    try {
      await prisma.comment.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err) {
      res.status(404).json({ error: "Not found" });
    }
  }
);

module.exports = router;
