import React, {Component} from 'react';
import './TextBox.css';

export default class TextBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            diffX: 0,
            diffY: 0,
            dragging: false,
            styles: {}
        }
    }

    //Checks if there is already an initial position for this caption and if there is it sets the caption to it
    componentDidMount() {
        if (this.props.initialPosition) {
            this.setState({
                styles: {
                    left: this.props.initialPosition.left,
                    top: this.props.initialPosition.top
                }
            });
        }
    }

    //Registers the starting point of the drag
    //Calculates the difference from the cursor to the top and left of the div
    _dragStart = (e) => {
        this.setState({
            diffX: e.screenX - e.currentTarget.getBoundingClientRect().left,
            diffY: e.screenY - e.currentTarget.getBoundingClientRect().top,
            dragging: true
        });
    }

    //keeps the difference between the cursor and div constant and resets the div position relative to the cursor
    _dragging = (e) => {
        if (this.state.dragging) {
            let left = e.screenX - this.state.diffX;
            let top = e.screenY - this.state.diffY;

            this.setState({
                styles: {
                    left: left,
                    top: top
                }
            });
            //Updates the position in the App.js state
            this.props.updatePosition(this.state.styles, this.props.positionType);
        }
    }

    //Stops dragging it
    _dragEnd = () => {
        this.setState({
            dragging: false
        });
    }

    render() {
        let classes = 'Dialog';
        return (
            <div className={classes} style={this.state.styles} onMouseDown={this._dragStart}
                 onMouseMove={this._dragging} onMouseUp={this._dragEnd}>
                <div id='output1'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
