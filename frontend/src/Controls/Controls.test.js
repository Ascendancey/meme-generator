import React from 'react';
import ReactDom from 'react-dom';
import Meme from './Controls';

//to test whether Meme Generator renders
it ("renders without crashing", ()=>{
    const div = document.createElement("div");
    ReactDom.render(<memegenerator></memegenerator>, div)
})