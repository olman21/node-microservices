const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const event = req.body;
    console.log("Event received:", event);

    if (event.type === "CommentCreated") {
        const comment = event.data;

        const status = comment.content.toLowerCase().includes("orange") ? "rejected" : "approved";

        await axios.post("http://event-bus-srv:4005/events", {
            type: "CommentModerated",
            data: {
                ...comment,
                status
            }
        });

        res.send({});
    }
});

app.listen(4003, () => {
    console.log("Listening on port: 4003");
})