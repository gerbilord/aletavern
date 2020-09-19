import React from 'react';
import ReactDOM from 'react-dom';

import './home.css';

import Button from "./baseComponents/Button";

class Home extends React.Component {
    constructor(props){
        super(props); // TODO In props, pass in game initializers. For loop through each to create buttons.
        this.state = {selection: "none"};
    }

    render(){

        switch(this.state.selection) { // TODO give Join button a click handler. Try to join, on success call appropiate initializer

            case "none":
                return (
                    <div>
                        <div className="button_list">
                            <h1>Ale Tavern</h1>
                            <input type="text" placeholder="Game Id" />
                            <input type="text" placeholder="Name" />
                            <Button buttonText="Join" /> 
                            <h3>or</h3>
                            <Button buttonText="Create" clickHandler={()=>{this.setState({selection: "create"}) } } />
                        </div>
                    </div>
                );
                break;

            case "create":
                return(
                    <div className="button_list">
                        <Button buttonText="Create Quiplash Game" clickHandler={this.props.testCreate} />
                        <h3>or</h3>
                        <Button buttonText="Back" clickHandler={()=>{this.setState({selection: "none"}) } } />
                    </div>
                );
                break;

            default:
                return(<h2>"sad"</h2>);
        }

    }
}

export default Home;
