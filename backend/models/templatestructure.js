const mongoose = require('mongoose');

//Defines the template schema for the database
const memeSchema = mongoose.Schema({
    name: {
        type: String
    },
    templateUrl: {
        type: String
    }
});

module.exports = mongoose.model('templates', memeSchema);