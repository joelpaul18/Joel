const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/joel_portfolio')
    .then(async () => {
        const adminExists = await Admin.findOne({ email: 'admin@joel.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const admin = new Admin({ email: 'admin@joel.com', password: hashedPassword });
            await admin.save();
            console.log('Admin seeded successfully: admin@joel.com / password123');
        } else {
            console.log('Admin already exists.');
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
