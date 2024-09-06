const express = require('express');
const geoip = require('geoip-lite');
const dns = require('dns');
const useragent = require('useragent'); // Import useragent package

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    const ip =
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null) ||
        req.socket.remoteAddress;

    let responseText = '';
    let hostnameResolved = false;
    let geoResolved = false;
    let deviceInfoResolved = false;

    // Resolve DNS hostname
    dns.reverse(ip, (err, hostnames) => {
        if (err) {
            responseText += 'Hostname not found. ';
        } else {
            responseText += `Client Hostname: ${hostnames[0]}. `;
        }
        hostnameResolved = true;
        if (geoResolved && deviceInfoResolved) {
            res.send(responseText);
        }
    });

    // Geolocation lookup
    const geo = geoip.lookup(ip);
    if (!geo) {
        responseText += 'Geolocation not found. ';
    } else {
        responseText += `IP: ${ip}, <br>Your location: ${geo.city}, <br>Country: ${geo.country}, <br>Region: ${geo.region}, <br>Timezone: ${geo.timezone}, <br>LL: ${geo.ll}, <br>Range: ${geo.range}. `;
    }
    geoResolved = true;

    // Parse user agent for device information
    const agent = useragent.parse(req.headers['user-agent']);
    responseText += `<br>Device Info: ${agent.toString()} <br>`;
    deviceInfoResolved = true;

    if (hostnameResolved && geoResolved && deviceInfoResolved) {
        res.send(responseText);
    }
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://192.168.1.151:${PORT}`);
});
