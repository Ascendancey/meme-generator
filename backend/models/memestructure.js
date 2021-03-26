const mongoose = require('mongoose');

//Defines the meme schema for the database
// NOTE: name is the name of temnplate. url is url of template
const memeSchema = mongoose.Schema({
    name: {
        type: String
    },
    url: {
        type: String
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    topCaption: {
        type: String
    },
    bottomCaption: {
        type: String
    },
    // uncomment below when data source is ready
    title: {
        type: String
    },
    // alttext: {
    //     type: String
    // },
     arialabel: {
         type: String
     },
    // comments: {
    //     type: Array
    // },
    // vote: {
    //     type: Array
    // },
    user: {
        type: String
    },
    status: {
        type: String
    },
    topCaptionPosition: {
        type: Object
    },
    bottomCaptionPosition: {
        type: Object
    },
    // topCaptionX: {
    //     type: int
    // },
    // topCaptionY: {
    //     type: int
    // },
    // bottomCaptionX: {
    //     type: int
    // },
    // bottomCaptionY: {
    //     type: int
    // },
    // viewsCount: {
    //     type: int
    // },
    creationDate: {
         type: Date
     }
    // tags: {
    //     type: Array
    // }
});

module.exports = mongoose.model('Memes', memeSchema);
