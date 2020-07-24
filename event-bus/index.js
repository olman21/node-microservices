const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const event = req.body;

    console.log("Event received:", event);

    axios.post('http://post-clusterip-srv:4000/events', event);
    axios.post('http://comments-clusterip-srv:4001/events', event);
    axios.post('http://query-clusterip-srv:4002/events', event);
    axios.post('http://moderation-clusterip-srv:4003/events', event);

    res.send({ status: "OK" });
});

app.listen(4005, () => {
    console.log("Listening on port: 4005");
})