const crypto = require('crypto');
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

// Your API secret from the https://paxful.com/account/developer page
const apiSecret = 'maE5KV16FV0nDyh7XPm2F8f8FZTdtb5p';

app.use(bodyParser.json());

// When you receive a service address verification request, you should take the "X-Paxful-Request-Challenge" header from the request then put it into the response
app.use((req, res, next) => {
    // Address verification request doesn't contain payload and request signature
    if (!Object.keys(req.body).length && !req.get('X-Paxful-Signature')) {
        console.log('Address verification request received.');
        const challengeHeader = 'X-Paxful-Request-Challenge';
        res.set(challengeHeader, req.get(challengeHeader));
        res.end();
    } else {
        next();
    }
});

// When you receive an event notification, you should verify the "X-Paxful-Signature" header. In case the request contains wrong signature, do not process it
app.use((req, res, next) => {
    const providedSignature = req.get('X-Paxful-Signature');
    const calculatedSignature = crypto.createHmac('sha256', apiSecret).update(JSON.stringify(req.body)).digest('hex');
    if (providedSignature !== calculatedSignature) {
        console.log('Request signature verification failed.');
        res.status(403).end();
    } else {
        next();
    }
});

// Now you can process an event
app.post('*', async (req, res) => {
    console.log('New event received:');
    console.log(req.body);
    res.end();
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));