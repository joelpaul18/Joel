const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/joel_portfolio');
        console.log('Connected to DB');

        const email = 'admin@joel.com';
        const password = await bcrypt.hash('password123', 10);

        const existing = await Admin.findOne({ email });
        if (!existing) {
            await Admin.create({ email, password });
            console.log('Default admin created: admin@joel.com / password123');
        } else {
            console.log('Admin already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        process.exit(0);
    }
}
seed();
