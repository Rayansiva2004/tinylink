const express = require('express');
const app = express();
app.use(express.json());

// In-memory storage for testing
let links = [];

// Health check
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// Create a link
app.post('/api/links', (req, res) => {
    const { target_url, code } = req.body;
    if (!target_url || !code) {
        return res.status(400).json({ error: 'Missing target_url or code' });
    }
    links.push({ code, target_url });
    res.json({ code, target_url });
});

// Get all links
app.get('/api/links', (req, res) => res.json(links));

// Get a specific link by code
app.get('/api/links/:code', (req, res) => {
    const code = req.params.code;
    const link = links.find(l => l.code === code);
    if (!link) return res.status(404).json({ error: 'Link not found' });
    res.json(link);
});

// Delete a link by code
app.delete('/api/links/:code', (req, res) => {
    const code = req.params.code;
    links = links.filter(l => l.code !== code);
    res.json({ message: 'Link deleted' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
