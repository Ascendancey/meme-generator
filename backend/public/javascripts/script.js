'use strict';
window.addEventListener('DOMContentLoaded', function () {

    //Variable declarations
    const backButton = document.getElementById('backButton');
    const nextButton = document.getElementById('nextButton');
    let form = document.querySelector('form');
    let topCaption = document.getElementById('topCaption');
    let bottomCaption = document.getElementById('bottomCaption');
    let output2 = document.querySelector('#output2');
    let output = document.querySelector('#output');
    const save = document.getElementById('save');

    //Meme Array that is filled with images from the API
    let memes = [];
    let captionedMemes = [];

    //Gets the number of memes in the meme array
    const numberOfImages = () => memes.length;
    // this is a counter that holds the id/number of the currently displayed image.
    let currentImageID = 0;

    //Gets height of meme
    function getHeight() {
        return memes[currentImageID].height;
    }

    function showImage(number) {
        let meme = memes[number];
        document.getElementById('slideShowImages').innerHTML = '';
        document.getElementById('slideShowImages').append(renderImage(meme.url, meme.width, meme.height, meme.name));
        output.innerHTML = meme.topCaption;
        output2.innerHTML = meme.bottomCaption;
        output2.style.marginTop = getHeight() * 0.8 + "px";
        output.style.marginTop = getHeight() * 0.1 + 'px';
    }

    function renderImage(url, width, height, name){
        const figure = document.createElement('figure');
        figure.className = "slidecurrent";
        const newImage = document.createElement('img');
        newImage.src = url;
        newImage.width = width;
        newImage.height = height;
        const figCaption = document.createElement('figcaption');
        figCaption.innerHTML = `${name}   ${url}`;
        figure.appendChild(newImage);
        figure.appendChild(figCaption);
        return figure
    }

    //Define forward and back buttons
    backButton.addEventListener('click', function () {
        currentImageID = currentImageID == 0 ? numberOfImages()-1 : currentImageID - 1;
        showImage(currentImageID);
    });
    nextButton.addEventListener('click', function () {
        currentImageID = currentImageID == numberOfImages()-1 ? 0 : currentImageID + 1;
        showImage(currentImageID);
    });

    //Make everything clean

    const sendHttpRequest = function (method, url, data) {
        return fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: data ? {'Content-Type': 'application/json'} : {}
        }).then(res => {
            return res.json();
        });
    };

    //GET Images from JSON file or API

    /*async function LoadImageUrls(){
        await sendHttpRequest('GET', 'http://localhost:3000/memes')
            .then((data) => {
                for(let i in data.data.memes){
                    memes.push({
                        'url':data.data.memes[i].url,
                        'width': data.data.memes[i].width,
                        'height': data.data.memes[i].height,
                        'name': data.data.memes[i].name
                    });
                }
            })
        showImage(0);
    };*/

    // Get Images from the database
    async function LoadImageUrls(){
        await sendHttpRequest('GET', 'http://localhost:3000/posts')
            .then((data) => {
                for(let i in data){
                    memes.push({
                        'url': data[i].url,
                        'width': data[i].width,
                        'height': data[i].height,
                        'name': data[i].name,
                        'topCaption': data[i].topCaption,
                        'bottomCaption': data[i].bottomCaption
                    });
                }
            })
        showImage(0);
    };

    //Adds caption
    function postJSON(url, callback, params) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                callback(JSON.parse(xhr.responseText));
            }
        }
        xhr.send(params);
    }

    //Caption image
    form.addEventListener('submit', function(e) { //e symbolizes the event that that starts this function

        let params;
        e.preventDefault(); //prevents the default function of the submit button

        // with params!
        params = JSON.stringify({ //method converts a JavaScript object or value to a JSON string
            user: topCaption.value.toUpperCase(),
            user2: bottomCaption.value.toUpperCase()
        });

        postJSON('http://httpbin.org/post', function(res) {
            output.innerHTML = res.json.user;
            output2.innerHTML = res.json.user2;
        }, params)
    });

    //Save image to database
    save.addEventListener('click', function () {
        let params;

        params = {
            name: memes[currentImageID].name,
            url: memes[currentImageID].url,
            width: memes[currentImageID].width,
            height: memes[currentImageID].height,
            topCaption: topCaption.value,
            bottomCaption: bottomCaption.value
        };
        sendHttpRequest('POST', 'http://localhost:3000/posts', params);
    });

    LoadImageUrls();
});