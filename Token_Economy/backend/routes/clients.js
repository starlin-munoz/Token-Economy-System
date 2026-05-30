import express from 'express';
import pool from '../db/index.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at ASC',
            [req.userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    const { name, age, gender } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO clients (user_id, name, age, gender) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.userId, name, age, gender]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM clients WHERE id = $1 AND user_id = $2 RETURNING id',
            [req.params.id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json({ deleted: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id/bank', async (req, res) => {
    try {
        const clientResult = await pool.query(
            'SELECT id, token_balance FROM clients WHERE id = $1 AND user_id = $2',
            [req.params.id, req.userId]
        );

        if (clientResult.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        const { token_balance } = clientResult.rows[0];

        const tokenResult = await pool.query(
            `SELECT te.token_emoji FROM token_events te
             JOIN sessions s ON te.session_id = s.id
             WHERE s.client_id = $1
             ORDER BY te.awarded_at ASC`,
            [req.params.id]
        );

        const allTokens = tokenResult.rows.map(r => r.token_emoji);
        const bankTokens = token_balance > 0 ? allTokens.slice(-token_balance) : [];

        res.json({ balance: token_balance, tokens: bankTokens });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;