import React from 'react';
import TextBox from "../TextBox/TextBox";
import captionPosition from "../captionPosition";

/* Here we pass the functions from the App.js component to the TextBox.js: to update the position
of the caption inside of App.js, to get the type of caption (top or bottom) and to set the initial
position of the caption if there is one */

const meme = (props) => {
    return <div>
        <h2>{props.title}</h2>
        <div id="meme" data-testid="meme">
            <TextBox updatePosition={props.updatePosition} positionType={captionPosition.TOP}
                     initialPosition={props.topInitialPosition}>{props.topcaption}</TextBox>
            <TextBox updatePosition={props.updatePosition} positionType={captionPosition.BOTTOM}
                     initialPosition={props.bottomInitialPosition}>{props.bottomcaption}</TextBox>
            <img crossOrigin="anonymous" src={props.url} alt={`${props.name}`}/>
        </div>
    </div>
};

export default meme;

//https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d