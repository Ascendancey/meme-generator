const express = require('express');
const router = express.Router();
const Meme = require('../models/memestructure');

//Pulls memes from the database
router.get('/', function(req, res) {
    Meme.find(function (err, data) {
        if (err){
            console.log(err);
        } else {
            res.send(data);
        }
    })
});

//Saves memes to the database
router.post('/', async (req, res) => {
    const meme = new Meme({
        name: req.body.name,
        url: req.body.url,
        width: req.body.width,
        height: req.body.height,
        topCaption: req.body.topCaption,
        bottomCaption: req.body.bottomCaption,
        arialabel: req.body.name,
        user: req.body.user,
        status: req.body.status,
        title: req.body.title,
        topCaptionPosition: req.body.topCaptionPosition,
        bottomCaptionPosition: req.body.bottomCaptionPosition,
        creationDate: req.body.creationDate
    });

    const savedMeme = await meme.save();
    res.json(savedMeme);
})

module.exports = router;
