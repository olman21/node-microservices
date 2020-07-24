const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const postComments = {};

app.get('/post/:id/comments', (req, res) => {
    res.send(postComments[req.params.id] || []);
});

app.post('/post/:id/comments', async (req, res) => {
    const id = randomBytes(4).toString("hex");
    const postId = req.params.id;

    const { content } = req.body;
    const newComment = {
        id,
        content,
        status: "pending",
        postId
    };

    const currrentPostComments = postComments[postId] || [];

    postComments[postId] = [...currrentPostComments, newComment]

    await axios.post('http://event-bus-srv:4005/events', {
        type: "CommentCreated",
        data: newComment
    });

    res.status(201).send(newComment);
});

app.post("/events", async (req, res) => {
    const { type, data } = req.body;

    console.log("Event received:", { type, data });

    if (type === "CommentModerated") {
        const comment = postComments[data.postId].find(c => c.id === data.id);
        comment.status = data.status;

        await axios.post("http://event-bus-srv:4005/events", {
            type: "CommentUpdated",
            data: comment
        });
    }
    res.send({});
})

app.listen(4001, () => {
    console.log("Listening on port: 4001");
})