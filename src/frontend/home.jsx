import React from 'react';
import ReactDOM from 'react-dom';

import './home.css';

import Button from "./baseComponents/Button";

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {selection: "none"};
    }

    render(){

        switch(this.state.selection) {

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
                return(<h1>"CREATE SCREEN"</h1>);
                break;

            default:
                return(<h2>"sad"</h2>);
        }

    }
}

export default Home;
