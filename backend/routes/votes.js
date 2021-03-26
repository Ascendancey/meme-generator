const express = require('express');
const router = express.Router();
const Vote = require('../models/votesstructure');

//Pulls votes from the database
router.get('/', function(req, res) {
    Vote.find(function (err, data) {
        if (err){
            console.log(err);
        } else {
            res.send(data);
        }
    })
});

//Saves votes to the database
router.post('/', async (req, res) => {
    const newVote = new Vote({
        memeid: req.body._id,
        user: req.body.user
    });

    const savedVote = await newVote.save();
    res.json(savedVote);
})

module.exports = router;
