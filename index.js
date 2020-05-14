const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.post('*', async (req, res) => {
    console.log(req.body);
    const challengeHeader = 'X-Paxful-Request-Challenge';
    res.set(challengeHeader, req.get(challengeHeader));
    res.end();
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))