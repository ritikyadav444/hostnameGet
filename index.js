const express = require('express');
const dns = require('dns');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    const clientIp = req.connection.remoteAddress;
    const normalizedIp = clientIp.startsWith('::ffff:') ? clientIp.split('::ffff:')[1] : clientIp;

    if (normalizedIp.startsWith('192.168.') || normalizedIp.startsWith('10.') || normalizedIp.startsWith('172.16.') || normalizedIp.startsWith('127.') || normalizedIp === '::1') {
        const message = `Private or localhost IP detected: ${normalizedIp}`;
        res.json({ hostname: null, message });
        console.log(`Private or localhost IP: ${normalizedIp}`);
    } else {
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
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
