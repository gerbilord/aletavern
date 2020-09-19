import React from 'react';
import ReactDOM from 'react-dom';

import './home.css';

import Button from "./baseComponents/Button";

class Home extends React.Component {
    constructor(props){
        super(props); // TODO In props, pass in game initializers. For loop through each to create buttons.
        this.state = {selection: "none", name:"", gameId:""};
    }

    render(){

        switch(this.state.selection) { // TODO give Join button a click handler. Try to join, on success call appropiate initializer

            case "none":
                return (
                    <div>
                        <div className="button_list">
                            <h1>Ale Tavern</h1>
                            <input type="text" placeholder="Game Id" onChange={(event)=>this.setState({gameId:event.target.value})} />
                            <input type="text" placeholder="Name" onChange={(event)=>this.setState({name:event.target.value})}/>
                            <Button buttonText="Join" clickHandler={ () => this.props.clickJoin(this.state.gameId)}/>
                            <h3>or</h3>
                            <Button buttonText="Create" clickHandler={()=>{this.setState({selection: "create"}) } } />
                        </div>
                    </div>
                );
                break;

            case "create":
                let games = this.props.games;
                let gameList = Object.keys(games).map( (key) =>( <Button buttonText={key} clickHandler={this.props.clickCreate} key={key} clickArgs={key} /> ) );

                return(
                    <div className="button_list">
                        {gameList}
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
