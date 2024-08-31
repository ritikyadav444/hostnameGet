const express = require('express');
const geoip = require('geoip-lite');
const app = express();
const dns = require('dns');
const PORT = process.env.PORT || 10000

app.get('/', (req, res) => {

    const clientIp = req.connection.remoteAddress;

    dns.reverse(clientIp, (err, hostnames) => {
        if (err) {
            res.send('Hostname not found');
        } else {
            res.send(`Client Hostname: ${hostnames[0]}`);
        }
    });

    const ip =
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null) || req.socket.remoteAddress

    console.log('IP Retrieved:', ip);
    const geo = geoip.lookup(ip);

    if (!geo) {
        console.log('Geolocation not found.');
        return res.send('Geolocation not found.');
    }

    console.log('Geo Information:', geo);
    res.send(` ip:${ip} Your location: ${geo.city}, Country:${geo.country} ,Region: ${geo.region} ,Timezone: ${geo.timezone},LL ${geo.ll} Range:${geo.range}`);
});

const server = app.listen(PORT, () => {
    console.log(`Server is working on http://192.168.1.151:${PORT}`)

})
