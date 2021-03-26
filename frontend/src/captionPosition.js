//Here we define the positions object that we pass around the components to get the positions
//As JS doesn't give us the option of using enumerations we used a workaround with Object.freeze

const Positions = {
    TOP: 0,
    BOTTOM: 1
};

export default Object.freeze(Positions);

