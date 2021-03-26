import React from 'react';
import './Comment.css';

const meme = (props) => {
    return <div>
        <div className="Comment" id="Comment" data-testid="comment">
            <h3>{props.name} wrote:</h3>
            <p>{props.text}</p>
        </div></div>
};

export default meme;