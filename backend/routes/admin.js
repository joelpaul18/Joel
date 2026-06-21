const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const Blog = require('../models/Blog');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Message = require('../models/Message');
const SiteContent = require('../models/SiteContent');

const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

router.use(verifyToken);

// File Upload
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// Stats
router.get('/stats', async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        const activeProjects = await Project.countDocuments();
        const unreadMessages = await Message.countDocuments({ isRead: false });

        res.json({
            totalBlogs,
            activeProjects,
            unreadMessages
        });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Blogs
router.get('/blogs', async (req, res) => {
    try { const blogs = await Blog.find().sort({ createdAt: -1 }); res.json(blogs); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});
router.post('/blogs', async (req, res) => {
    try { const blog = new Blog(req.body); await blog.save(); res.status(201).json(blog); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});
router.put('/blogs/:id', async (req, res) => {
    try { const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(blog); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});
router.delete('/blogs/:id', async (req, res) => {
    try { await Blog.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});

// Projects
router.post('/projects', async (req, res) => {
    try { const project = new Project(req.body); await project.save(); res.status(201).json(project); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});
router.put('/projects/:id', async (req, res) => {
    try { const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(project); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});
router.delete('/projects/:id', async (req, res) => {
    try { await Project.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});

// Skills
router.post('/skills', async (req, res) => {
    try { const skill = new Skill(req.body); await skill.save(); res.status(201).json(skill); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});
router.delete('/skills/:id', async (req, res) => {
    try { await Skill.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});

// Messages
router.get('/messages', async (req, res) => {
    try { const msgs = await Message.find().sort({ createdAt: -1 }); res.json(msgs); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});
router.put('/messages/:id/read', async (req, res) => {
    try { const msg = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true }); res.json(msg); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});
router.delete('/messages/:id', async (req, res) => {
    try { await Message.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ message: 'Server error' }) }
});

// Global Content
router.put('/content', async (req, res) => {
    try {
        let content = await SiteContent.findOne();
        if (!content) { content = new SiteContent(req.body); await content.save(); return res.json(content); }
        content = await SiteContent.findOneAndUpdate({}, req.body, { new: true });
        res.json(content);
    } catch (e) { res.status(500).json({ message: 'Server error' }) }
});

module.exports = router;
