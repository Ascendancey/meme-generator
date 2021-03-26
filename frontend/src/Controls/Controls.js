import React from 'react';

// reusable Controls component
const controls = (props) => {
    return <div id="memegenerator" data-testid="memegenerator">
            <label >Image URL: </label> <br />
            <input id="urlinput" type="text" onChange={props.urlchange} value={props.url}/>
        </div>
};

export default controls;