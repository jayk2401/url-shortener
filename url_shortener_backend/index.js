import express from 'express';
import cors from 'cors';
// import http from 'http'
import crypto from 'crypto';

// const pool = require('./db'); // adjust the path if needed
import pool from './db.js'

async function setUpDb() {
    await pool.query(`CREATE TABLE IF NOT EXISTS url (id serial primary key, original_url VARCHAR(100) UNIQUE NOT NULL, shortened_url VARCHAR(255), created_at TIMESTAMPTZ DEFAULT NOW())`)
    return
}

async function getAllUrls() {
    const res = await pool.query(`SELECT * FROM url`);
    return res.rows;
}

async function getOriginalUrl(originalUrl) {
    const res = await pool.query(`SELECT * FROM url WHERE original_url='${originalUrl}' LIMIT 1`);
    return res.rows;
}

async function createShortenedUrl(original_url, shortened_url) {
    const res = await pool.query(`INSERT INTO url (original_url, shortened_url, visits) VALUES ('${original_url}', '${shortened_url}', 0)`)
    return res.rows;
}

async function updateVisitsCount(urlId) {
    const urlRow = await pool.query(`SELECT * FROM url WHERE id=${urlId} LIMIT 1`);
    console.log(urlRow)
    console.log(urlRow.rows[0])
    const visitsCount = urlRow.rows[0].visits
    const res = await pool.query(`UPDATE url SET visits=${visitsCount + 1} WHERE id=${urlId}`);

}


const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/url_data', async (req, res) => {
    const urlData = await getAllUrls()
    res.status(200).json({ data: { urlData: urlData } });
})

app.post('/api/increment_visit_count', async (req, res) => {
    const receivedData = req.body; // Access data from the request body
    console.log('Received data:', receivedData);
    const urlId = receivedData['id']
    const dbResult = await updateVisitsCount(urlId)
    const urlData = await getAllUrls()
    res.status(201).json({ message: 'Success!', data: { urlData: urlData } });

})

app.post('/api/url_shortener', async (req, res) => {
    const receivedData = req.body; // Access data from the request body
    console.log('Received data:', receivedData);

    const originalUrl = receivedData['url']

    const existingUrl = await getOriginalUrl(originalUrl)
    console.log("existingUrl", existingUrl)

    if (existingUrl.length !== 0) {
        res.status(400).json({ message: 'This URL has already been shortened', data: { url: existingUrl } });
    }
    else {

        const bytes = crypto.randomBytes(6); // 6 bytes = 48 bits
        const shortenedUrl = bytes.toString('base64url'); // or 'hex', 'base64', etc.

        const dbResult = await createShortenedUrl(originalUrl, shortenedUrl)

        console.log(dbResult)
        const urlData = await getAllUrls()
        res.status(201).json({ message: 'Success! The URL has been shortened', data: { urlData: urlData } });
        // res.status(201).json({ message: 'This URL has been created', data: { shortenedUrl: shortenedUrl } });
    }
});

// Start the server
const port = 8080
app.listen(port, () => {
    setUpDb()
    console.log(`Server listening at http://localhost:${port}`);
});


// const requestListener = function (req, res) {
//     res.writeHead(200);
//     res.end('Hello, World!');
// }

// const server = http.createServer(requestListener);
// server.listen(8080);