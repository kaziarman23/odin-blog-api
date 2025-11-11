const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
const { email, password, username } = req.body;
if (!email || !password) return res.status(400).json({ error: 'email+password required' });
const hashed = await bcrypt.hash(password, 10);
try {
const user = await prisma.user.create({ data: { email, password: hashed, username } });
res.json({ id: user.id, email: user.email });
} catch (err) {
res.status(400).json({ error: 'User exists or invalid data' });
}
});


router.post('/login', async (req, res) => {
const { email, password } = req.body;
const user = await prisma.user.findUnique({ where: { email } });
if (!user) return res.status(401).json({ error: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user.id, email: user.email, username: user.username, role: user.role } });
});


module.exports = router;