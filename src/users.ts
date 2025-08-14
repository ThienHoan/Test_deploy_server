import expressplus from './expressplus';
import db from './db/db';
import { Request, Response } from 'express';

const app = new expressplus();

// GET /users - Lấy danh sách users
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.json({ users: result.rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /users/:id - Lấy user theo ID
app.get('/users/:id', async (req: Request, res: Response) => {
    const userId = req.params?.id;
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /users - Tạo user mới
app.post('/users', async (req: Request, res: Response) => {
    const { name, email } = req.body || {};
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /users/:id - Cập nhật toàn bộ user
app.put('/users/:id', async (req: Request, res: Response) => {
    const userId = req.params?.id;
    const { name, email } = req.body || {};

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        const result = await db.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, userId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PATCH /users/:id - Cập nhật một phần user
app.patch('/users/:id', async (req: Request, res: Response) => {
    const userId = req.params?.id;
    const { name, email } = req.body || {};

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name) {
        updates.push(`name = $${paramCount++}`);
        values.push(name);
    }
    if (email) {
        updates.push(`email = $${paramCount++}`);
        values.push(email);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(userId);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    try {
        const result = await db.query(query, values);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /users/:id - Xóa user
app.delete('/users/:id', async (req: Request, res: Response) => {
    const userId = req.params?.id;

    try {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
        if (result.rows.length > 0) {
            res.json({ message: 'User deleted successfully', user: result.rows[0] });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
