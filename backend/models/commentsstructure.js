const mongoose = require('mongoose');

//Defines the comments schema for the database
const memeSchema = mongoose.Schema({
    memeid: {
        type: String
    },
    user: {
        type: String
    },
    comment: {
        type: String
    }
});

module.exports = mongoose.model('comments', memeSchema);