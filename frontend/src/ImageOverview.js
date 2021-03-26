import React from 'react';

const ImageOverview = (props) => {

    // We pass the Api response from the App.js to this component as a props so we can extract the urls of the saved memes
    // We go through each item in the array Api response and create an image with the corresponding url for each

    let images = props.images;

    return (
        <div className={"overviewcontainer"}>
            {images.map((image, memeindex) => {
                return <div key={memeindex}><span>{image.title}</span><img className={"overviewimage"} src={image.url} alt=""/></div>
            })}
        </div>
    )
}

export default ImageOverview;