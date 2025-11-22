// src/server.js
const express = require('express');
const app = express();

app.use(express.json());

// In-memory storage for links (replace with DB in production)
let links = [];

// --------------------
// Health check
// --------------------
app.get('/healthz', (req, res) => {
    res.json({
        ok: true,
        version: '1.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// --------------------
// Create a new link
// --------------------
app.post('/api/links', (req, res) => {
    const { code, target_url } = req.body;

    if (!code || !target_url) {
        return res.status(400).json({ error: 'Missing code or target_url' });
    }

    // Check if code already exists
    if (links.find(l => l.code === code)) {
        return res.status(409).json({ error: 'Code already exists' });
    }

    links.push({ code, target_url });
    res.status(201).json({ code, target_url });
});

// --------------------
// Get all links
// --------------------
app.get('/api/links', (req, res) => {
    res.json(links);
});

// --------------------
// Get specific link info
// --------------------
app.get('/api/links/:code', (req, res) => {
    const code = req.params.code;
    const link = links.find(l => l.code === code);

    if (!link) return res.status(404).json({ error: 'Link not found' });

    res.json(link);
});

// --------------------
// Delete a link
// --------------------
app.delete('/api/links/:code', (req, res) => {
    const code = req.params.code;
    const initialLength = links.length;
    links = links.filter(l => l.code !== code);

    if (links.length === initialLength) {
        return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ message: 'Link deleted successfully' });
});

// --------------------
// Redirect short links
// --------------------
app.get('/:code', (req, res) => {
    const code = req.params.code;
    const link = links.find(l => l.code === code);

    if (!link) return res.status(404).send('Link not found');

    res.redirect(link.target_url);
});

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
