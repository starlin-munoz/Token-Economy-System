import express from 'express';
import pool from '../db/index.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.get('/client/:clientId', async (req, res) => {
    try {
        const clientCheck = await pool.query(
            'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
            [req.params.clientId, req.userId]
        );

        if (clientCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const result = await pool.query(
            'SELECT * FROM rewards WHERE client_id = $1 AND redeemed_at IS NULL ORDER BY created_at ASC',
            [req.params.clientId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    const { clientId, name, cost } = req.body;

    if (!clientId || !name || !cost) {
        return res.status(400).json({ error: 'clientId, name, and cost are required' });
    }

    try {
        const clientCheck = await pool.query(
            'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
            [clientId, req.userId]
        );

        if (clientCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const result = await pool.query(
            'INSERT INTO rewards (client_id, name, cost) VALUES ($1, $2, $3) RETURNING *',
            [clientId, name, cost]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/:id/redeem', async (req, res) => {
    try {
        const rewardResult = await pool.query(
            `SELECT r.* FROM rewards r
             JOIN clients c ON r.client_id = c.id
             WHERE r.id = $1 AND c.user_id = $2 AND r.redeemed_at IS NULL`,
            [req.params.id, req.userId]
        );

        if (rewardResult.rows.length === 0) {
            return res.status(404).json({ error: 'Reward not found' });
        }

        const reward = rewardResult.rows[0];

        const clientResult = await pool.query(
            'SELECT token_balance FROM clients WHERE id = $1',
            [reward.client_id]
        );

        if (clientResult.rows[0].token_balance < reward.cost) {
            return res.status(400).json({ error: 'Not enough tokens' });
        }

        await pool.query('BEGIN');

        await pool.query(
            'UPDATE rewards SET redeemed_at = NOW() WHERE id = $1',
            [req.params.id]
        );

        await pool.query(
            'UPDATE clients SET token_balance = token_balance - $1 WHERE id = $2',
            [reward.cost, reward.client_id]
        );

        await pool.query('COMMIT');

        res.json({ success: true, tokensSpent: reward.cost });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM rewards
             USING clients c
             WHERE rewards.client_id = c.id
             AND rewards.id = $1
             AND c.user_id = $2
             RETURNING rewards.id`,
            [req.params.id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reward not found' });
        }

        res.json({ deleted: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;