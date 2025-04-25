const express = require('express');
const { createClient } = require('@redis/client');
const { promisify } = require('util');

const app = express();
const client = createClient({
    url: 'redis://redis:6379'
});

client.connect().catch((err) => {
    console.error('Could not connect to Redis:', err);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

client.set('visits', 0);

app.get('/', async (req, res) => {
    try {
        let visits = await getAsync('visits');
        visits = parseInt(visits);
        res.send('Number of visits is ' + visits);
        await setAsync('visits', visits + 1);
    } catch (err) {
        res.send('Error: ' + err.message);
    }
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});
