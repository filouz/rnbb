import React from 'react';

import '../assets/styles/spaceKey.scss';

class SpaceKey extends React.Component {
    constructor() {
        super();
        this.state = {
            isProcessRunning: false
        };
    }

    handleMouseDown = () => {
        this.setState({ isProcessRunning: true });
        // Additional code to start your process
    }

    handleMouseUp = () => {
        this.setState({ isProcessRunning: false });
        // Additional code to stop your process
    }

    render() {
        return (
            <button className="space-key" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
                <span>SPACE</span>
            </button>
        );
    }
}

export default SpaceKey;