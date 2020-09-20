// GUI
import React from 'react';
import ReactDOM from 'react-dom';


export default class QuiplashView extends React.Component {
    constructor(props){
        super(props);

        this.gameEngine = this.props.gameWrapper.gameEngine;

        this.state = {gameState:this.gameEngine.getGameState()};
    }

    // TODO give a real unique key
    render(){ return (
        <div>
            <h1>
                Quiplash
            </h1>
            <h2>
                Waiting for game to start
            </h2>
        </div>
    ) };


    componentDidMount() {
        this.interval = setInterval(
            () => this.setState({ gameState: this.gameEngine.getGameState() }),
            1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
}
