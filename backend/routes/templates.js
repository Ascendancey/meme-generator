const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const Template = require('../models/templatestructure');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploadStorage/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
  })
  
const upload = multer({storage: storage, limits: {fileSize: 25 * 1024 * 1024}});

// Pulls memes from the database
router.get('/', function(req, res) {
    Template.find(function (err, data) {
        if (err){
            console.log(err);
        } else {
            res.send(data);
        }
    })
});

// Saves memes to static folder and saves path to DB
router.post('/', upload.single('templateUpload'), (req, res) => {
    const templateUpload = req.file;
    console.log(req.file);
    const memeTemplate = new Template ({
        name: req.file.filename,
        templateUrl: 'http://localhost:9000/' + req.file.path
    });
    memeTemplate.save();
    templateUpload
        .save()
        .then(result => {
            console.log(result);
            console.log("Template saved")
            res.status(201).json({
                message: "Template saved!",
                createdEntry:{
                    name: result.name,
                    templateUrl: "http://localhost:9000" + result.templateUrl
                }
            })
        })
        .catch(err => console.log(err));
});

module.exports = router;