const express = require('express');
const Blog = require('../models/Blog');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Message = require('../models/Message');
const SiteContent = require('../models/SiteContent');

const router = express.Router();

router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/blogs/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/skills', async (req, res) => {
    try {
        const skills = await Skill.find().sort({ category: 1, name: 1 });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/content', async (req, res) => {
    try {
        let content = await SiteContent.findOne();
        if (!content) { content = new SiteContent(); await content.save(); }
        res.json(content);
    } catch (error) { res.status(500).json({ message: 'Server error' }) }
});

module.exports = router;
