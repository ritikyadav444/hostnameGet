const express = require('express');
const dns = require('dns');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    const ip = req.ip
    res.render(ip)
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
