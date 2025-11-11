require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => res.send("Blog API running"));

app.listen(port, () => console.log(`Listening on ${port}`));
