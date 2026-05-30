import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import sessionRoutes from './routes/sessions.js';
import rewardRoutes from './routes/rewards.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.FRONTEND_URL
    ]
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/rewards', rewardRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});