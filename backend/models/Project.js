const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String }, // Cloudinary URL
    techStack: [{ type: String }],
    githubUrl: { type: String },
    liveUrl: { type: String },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
