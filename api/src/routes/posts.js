const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticate, requireRole } = require("../middleware/auth");

// public list
router.get("/", async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { id: true, username: true } } },
  });
  res.json(posts);
});

// single post by slug
router.get("/:slug", async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { slug: req.params.slug },
    include: {
      author: { select: { id: true, username: true } },
      comments: { where: { approved: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!post || !post.published)
    return res.status(404).json({ error: "Not found" });
  res.json(post);
});

// create
router.post(
  "/",
  authenticate,
  requireRole(["AUTHOR", "ADMIN"]),
  async (req, res) => {
    const { title, content, excerpt, featuredUrl, slug } = req.body;
    const newSlug =
      slug || title.toLowerCase().replace(/\s+/g, "-").slice(0, 120);
    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        featuredUrl,
        slug: newSlug,
        authorId: req.user.id,
      },
    });
    res.json(post);
  }
);

// update
router.put(
  "/:id",
  authenticate,
  requireRole(["AUTHOR", "ADMIN"]),
  async (req, res) => {
    try {
      const post = await prisma.post.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json(post);
    } catch (err) {
      res.status(404).json({ error: "Not found" });
    }
  }
);

// toggle publish
router.post(
  "/:id/publish",
  authenticate,
  requireRole(["AUTHOR", "ADMIN"]),
  async (req, res) => {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        published: !post.published,
        publishedAt: !post.published ? new Date() : null,
      },
    });
    res.json(updated);
  }
);

// delete (admin)
router.delete(
  "/:id",
  authenticate,
  requireRole(["ADMIN"]),
  async (req, res) => {
    try {
      await prisma.post.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err) {
      res.status(404).json({ error: "Not found" });
    }
  }
);

module.exports = router;
