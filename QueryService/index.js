const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const postWithComments = {};

app.get('/posts', (req, res) => {
    res.send(postWithComments);
});

app.post('/events', (req, res) => {
    const event = req.body;

    console.log("Received Event:", event);

    if (event.type === "PostCreated") {
        const post = event.data;

        postWithComments[post.id] = { ...post, comments: [] };
    }

    if (event.type === "CommentCreated") {
        const comment = event.data;
        const post = postWithComments[comment.postId];
        postWithComments[comment.postId] = {
            ...post,
            comments: [...post.comments, comment]
        };
    }

    if (event.type === "CommentUpdated") {
        const data = event.data;
        const post = postWithComments[data.postId];

        const index = post.comments.finIndex(c => c.id === data.id);
        post.comments[index] = data;
    }

    res.send({});
});

app.listen(4002, () => {
    console.log('Listening on port: 4002');
});