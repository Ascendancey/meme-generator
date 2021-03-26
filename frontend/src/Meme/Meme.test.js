import React from 'react';
import ReactDom from 'react-dom';
import Meme from './Meme';

// to test whether the meme with top caption and bottom caption renders
it ("renders without crashing", ()=>{
    const div = document.createElement("div");
    ReactDom.render(<Meme></Meme>, div)
})