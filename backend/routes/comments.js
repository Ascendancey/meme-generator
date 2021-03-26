const express = require('express');
const router = express.Router();
const Comment = require('../models/commentsstructure');

//Pulls comments from the database
router.get('/', function(req, res) {
    Comment.find(function (err, data) {
        if (err){
            console.log(err);
        } else {
            res.send(data);
        }
    })
});

//Saves comments to the database
router.post('/', async (req, res) => {
    const comment = new Comment({
        memeid: req.body._id,
        user: req.body.user,
        comment: req.body.comment
    });

    const savedComment = await comment.save();
    res.json(savedComment);
})

module.exports = router;
