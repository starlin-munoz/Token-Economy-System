import express from 'express';
import pool from '../db/index.js';
import verifyToken from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.use(verifyToken);

router.post('/', [
    body('clientId')
        .isInt({ min: 1 }).withMessage('Invalid client ID'),
    body('goalTokens')
        .optional()
        .isInt({ min: 1, max: 10 }).withMessage('Goal must be between 1 and 10'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { clientId, goalTokens } = req.body;

    try {
        const clientCheck = await pool.query(
            'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
            [clientId, req.userId]
        );

        if (clientCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const result = await pool.query(
            'INSERT INTO sessions (client_id, goal_tokens) VALUES ($1, $2) RETURNING *',
            [clientId, goalTokens || 1]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/:id/tokens', [
    body('tokenEmoji')
        .trim()
        .notEmpty().withMessage('tokenEmoji is required')
        .isLength({ max: 10 }).withMessage('Invalid token emoji'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { tokenEmoji } = req.body;
    const sessionId = req.params.id;

    try {
        const sessionCheck = await pool.query(
            `SELECT s.id, s.client_id FROM sessions s
             JOIN clients c ON s.client_id = c.id
             WHERE s.id = $1 AND c.user_id = $2`,
            [sessionId, req.userId]
        );

        if (sessionCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { client_id } = sessionCheck.rows[0];

        await pool.query('BEGIN');

        const result = await pool.query(
            'INSERT INTO token_events (session_id, token_emoji) VALUES ($1, $2) RETURNING *',
            [sessionId, tokenEmoji]
        );

        await pool.query(
            'UPDATE clients SET token_balance = token_balance + 1 WHERE id = $1',
            [client_id]
        );

        await pool.query('COMMIT');

        res.status(201).json(result.rows[0]);
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.patch('/:id/complete', async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE sessions SET completed = true
             FROM clients c
             WHERE sessions.client_id = c.id
             AND sessions.id = $1
             AND c.user_id = $2
             RETURNING sessions.*`,
            [req.params.id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/client/:clientId', async (req, res) => {
    try {
        const clientCheck = await pool.query(
            'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
            [req.params.clientId, req.userId]
        );

        if (clientCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const sessions = await pool.query(
            'SELECT * FROM sessions WHERE client_id = $1 ORDER BY created_at DESC',
            [req.params.clientId]
        );

        const sessionIds = sessions.rows.map(s => s.id);
        let tokenEvents = [];

        if (sessionIds.length > 0) {
            const tokens = await pool.query(
                'SELECT * FROM token_events WHERE session_id = ANY($1) ORDER BY awarded_at ASC',
                [sessionIds]
            );
            tokenEvents = tokens.rows;
        }

        res.json({ sessions: sessions.rows, tokenEvents });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;