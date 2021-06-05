const express = require('express');
require('./db/mongoose');

const blogRouter = require('./routers/blog');

const app = express();

const port = 6000;

app.use(express.json());


app.use(blogRouter);

app.listen(port, () => {
    console.log("Server is running at " + port);
});