const mongoose = require('mongoose');

//Defines the votes schema for the database
const memeSchema = mongoose.Schema({
    memeid: {
        type: String
    },
    user: {
        type: String
    }
});

module.exports = mongoose.model('votes', memeSchema);