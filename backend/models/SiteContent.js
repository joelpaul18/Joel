const mongoose = require('mongoose');

const SiteContentSchema = new mongoose.Schema({
    heroTitle: { type: String, default: "Hi, I'm Joel 👋" },
    heroSubtitles: { type: [String], default: ["Frontend Developer", "Cloud Enthusiast", "Problem Solver"] },
    heroDescription: { type: String, default: "Building aesthetic frontends, solid backends, and full-stack solutions with modern tech." },
    heroImage: { type: String, default: "" },
    aboutHeading: { type: String, default: "Useful software, carefully shaped." },
    aboutDescription: { type: String, default: "I'm a full-stack developer obsessed with creating clean, user-friendly experiences backed by robust, scalable architectures." },
    aboutImage: { type: String, default: "" },
    aboutDoing: { type: String, default: "Exploring cloud-native architectures, mastering Docker, and refining my eye for frontend design animations." },
    aboutLookingFor: { type: String, default: "Exciting opportunities to build impactful software with passionate teams that care about both code quality and user experience." },
    skillsKicker: { type: String, default: "Skills" },
    skillsHeading: { type: String, default: "A focused stack for full-stack work." },
    projectsKicker: { type: String, default: "Projects" },
    projectsHeading: { type: String, default: "Selected builds with working details." },
    footerText: { type: String, default: " Joel Paul. All rights reserved." }
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', SiteContentSchema);
