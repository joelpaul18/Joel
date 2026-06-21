const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/joel_portfolio')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
}));
app.use('/api/auth', require('./routes/auth'));

app.use('/api/public', require('./routes/public'));
app.use('/api/admin', require('./routes/admin'));

// Ping endpoint for keep-awake services (like UptimeRobot)
app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Optional Self-Ping to prevent sleep (e.g. on Render Free tier)
    const selfPingUrl = process.env.BACKEND_URL || process.env.SELF_PING_URL;
    if (selfPingUrl) {
        const https = require('https');
        const http = require('http');
        const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
        
        setInterval(() => {
            const client = selfPingUrl.startsWith('https') ? https : http;
            const targetUrl = selfPingUrl.endsWith('/') ? `${selfPingUrl}ping` : `${selfPingUrl}/ping`;
            
            client.get(targetUrl, (res) => {
                console.log(`[Keep-Awake] Self-ping status: ${res.statusCode}`);
            }).on('error', (err) => {
                console.error('[Keep-Awake] Self-ping failed:', err.message);
            });
        }, PING_INTERVAL);
        console.log(`[Keep-Awake] Self-ping initiated for: ${selfPingUrl}`);
    }
});
