import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import sessionRoutes from './routes/sessions.js';
import rewardRoutes from './routes/rewards.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// General rate limit — applies to all routes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limit — applies to login and register only
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many attempts, please try again in 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.FRONTEND_URL
    ]
}));
app.use(express.json());

// Apply general limiter to all routes
app.use(generalLimiter);

// Apply strict limiter to auth routes only
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/rewards', rewardRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});