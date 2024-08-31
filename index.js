const express = require('express');
const dns = require('dns');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    const clientIp = req.connection.remoteAddress;
    const normalizedIp = clientIp.startsWith('::ffff:') ? clientIp.split('::ffff:')[1] : clientIp;

    dns.reverse(normalizedIp, (err, hostnames) => {
        if (err) {
            const message = `Could not resolve hostname for IP: ${normalizedIp}`;
            res.json({ hostname: null, message });
            console.log("DNS error:", err.message);
        } else {
            const hostname = hostnames[0];
            res.json({ hostname, message: null });
            console.log("Resolved Hostnames:", hostnames);
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
