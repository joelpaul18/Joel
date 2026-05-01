const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImage: { type: String }, // Cloudinary URL
    tags: [{ type: String }],
    body: { type: String, required: true },
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
