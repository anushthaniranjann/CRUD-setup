const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Blog = require('../models/blog');

const router = new express.Router();

//TO create new task
router.post('/blogs', async(req, res) => {

    const blog = new Blog({
        ...req.body,

    })

    try {
        blog.save();
        res.status(201).send(blog);
    } catch (e) {
        res.status(400).send(e);
    }

});

//To  Update content
router.put('/blogs/:id', async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdateProperties = ['title', 'content'];
    const isValidProperty = updates.every((update) => allowedUpdateProperties.includes(update));

    if (!isValidProperty) {
        return res.status(400).send({ error: 'Inavlid Updates' })
    }

    try {
        const blog = await Blog.findOne({ _id: req.params.id });

        if (!blog) {
            return res.status(404).send();
        }
        updates.forEach((update) => blog[update] = req.body[update])
        await blog.save();

        res.send(blog);
    } catch (e) {
        res.status(400).send(e);
    }
})

//To get blog by using their id
router.get('/blogs/:id', async(req, res) => {
    const _id = req.params.id;

    try {
        const blog = await Blog.findOne({ _id });

        if (!blog) {
            return res.status(404).send();
        }

        res.send(blog);
    } catch (e) {
        res.status(500).send();
    }
})

//TO delete blog
router.delete('/blogs/:id', async(req, res) => {
    const _id = req.params.id;

    try {
        const blog = await Blog.findOneAndDelete({ _id });

        if (!blog) {
            return res.status(404).send();
        }
        res.send(blog);
    } catch (e) {
        res.status(500).send();
    }

})

//Upload picture
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be an image.'))
        }
        cb(undefined, true);
    }
})

router.post('/avatar', upload.single('avatar'), async(req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.avatar = buffer;
    //  req.user.avatar = req.file.buffer;
    //await upload.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

module.exports = router;