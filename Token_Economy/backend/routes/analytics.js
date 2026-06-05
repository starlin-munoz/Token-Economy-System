import express from 'express';
import pool from '../db/index.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.get('/client/:clientId', async (req, res) => {
    try {
        const clientCheck = await pool.query(
            'SELECT id, name FROM clients WHERE id = $1 AND user_id = $2',
            [req.params.clientId, req.userId]
        );

        if (clientCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Total sessions and completion rate
        const sessionStats = await pool.query(
            `SELECT 
                COUNT(*) AS total_sessions,
                SUM(CASE WHEN completed = TRUE THEN 1 ELSE 0 END) AS completed_sessions
             FROM sessions
             WHERE client_id = $1`,
            [req.params.clientId]
        );

        // Tokens earned per session over time
        const tokensPerSession = await pool.query(
            `SELECT 
                s.id AS session_id,
                s.goal_tokens,
                s.created_at,
                COUNT(te.id) AS tokens_earned
             FROM sessions s
             LEFT JOIN token_events te ON te.session_id = s.id
             WHERE s.client_id = $1
             GROUP BY s.id
             ORDER BY s.created_at ASC`,
            [req.params.clientId]
        );

        // Most used token emoji
        const topEmoji = await pool.query(
            `SELECT te.token_emoji, COUNT(*) AS count
             FROM token_events te
             JOIN sessions s ON te.session_id = s.id
             WHERE s.client_id = $1
             GROUP BY te.token_emoji
             ORDER BY count DESC
             LIMIT 1`,
            [req.params.clientId]
        );

        // Total tokens earned
        const totalTokens = await pool.query(
            `SELECT COUNT(*) AS total
             FROM token_events te
             JOIN sessions s ON te.session_id = s.id
             WHERE s.client_id = $1`,
            [req.params.clientId]
        );

        // Reward redemption history
        const redemptions = await pool.query(
            `SELECT name, cost, redeemed_at
             FROM rewards
             WHERE client_id = $1 AND redeemed_at IS NOT NULL
             ORDER BY redeemed_at DESC`,
            [req.params.clientId]
        );

        // Average tokens per session
        const avgTokens = await pool.query(
            `SELECT ROUND(AVG(token_count), 1) AS average
             FROM (
                SELECT COUNT(te.id) AS token_count
                FROM sessions s
                LEFT JOIN token_events te ON te.session_id = s.id
                WHERE s.client_id = $1
                GROUP BY s.id
             ) AS session_counts`,
            [req.params.clientId]
        );

        res.json({
            client: clientCheck.rows[0],
            totalSessions: parseInt(sessionStats.rows[0].total_sessions),
            completedSessions: parseInt(sessionStats.rows[0].completed_sessions),
            totalTokens: parseInt(totalTokens.rows[0].total),
            averageTokensPerSession: parseFloat(avgTokens.rows[0].average) || 0,
            topEmoji: topEmoji.rows[0]?.token_emoji || '⭐',
            tokensPerSession: tokensPerSession.rows,
            redemptions: redemptions.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/overview', async (req, res) => {
    try {
        // Total clients
        const totalClients = await pool.query(
            'SELECT COUNT(*) AS total FROM clients WHERE user_id = $1',
            [req.userId]
        );

        // Total sessions
        const totalSessions = await pool.query(
            `SELECT COUNT(*) AS total
             FROM sessions s
             JOIN clients c ON s.client_id = c.id
             WHERE c.user_id = $1`,
            [req.userId]
        );

        // Total tokens awarded
        const totalTokens = await pool.query(
            `SELECT COUNT(*) AS total
             FROM token_events te
             JOIN sessions s ON te.session_id = s.id
             JOIN clients c ON s.client_id = c.id
             WHERE c.user_id = $1`,
            [req.userId]
        );

        // Most active client
        const mostActive = await pool.query(
            `SELECT c.name, COUNT(te.id) AS token_count
             FROM clients c
             JOIN sessions s ON s.client_id = c.id
             LEFT JOIN token_events te ON te.session_id = s.id
             WHERE c.user_id = $1
             GROUP BY c.id, c.name
             ORDER BY token_count DESC
             LIMIT 1`,
            [req.userId]
        );

        res.json({
            totalClients: parseInt(totalClients.rows[0].total),
            totalSessions: parseInt(totalSessions.rows[0].total),
            totalTokens: parseInt(totalTokens.rows[0].total),
            mostActiveClient: mostActive.rows[0]?.name || 'N/A',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;