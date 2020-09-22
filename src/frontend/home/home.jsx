import React from 'react';
import ReactDOM from 'react-dom';

import styles from './home.module.css';

import Button from "../baseComponents/Button";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: "none", // Selection is which page of home we are on
            name: "",          // Name is the value in the name text input
            gameId: ""         // GameId is the value in the gameId text input
        };
    }

    render() {

        switch (this.state.selection) {

            case "none": // Landing page/view of website.
                return (
                    <div>
                        <div className={styles.button_list}>
                            <h1>Ale Tavern</h1>

                            <input
                                type="text"
                                placeholder="Name"
                                onChange={(event) => this.setState({ name: event.target.value })}
                                value={this.state.name}
                            />

                            <h2>then</h2>

                            <input
                                type="text"
                                placeholder="Game Id"
                                onChange={(event) => this.setState({ gameId: event.target.value })}
                            />
                            <Button
                                buttonText="Join"
                                isDisabled={this.state.name.length == 0 || this.state.gameId.length == 0}
                                clickHandler={() => { /* TODO this doesn't use Button args={something}, kinda confusing... */
                                    this.props.clickJoin(this.state.gameId, this.state.name)
                                }}
                            />

                            <h3>or</h3>

                            <Button
                                buttonText="Create"
                                isDisabled={this.state.name.length == 0}
                                clickHandler={() => { /* TODO this doesn't use Button args={something}, kinda confusing... */
                                    this.setState({ selection: "create" })
                                }}
                            />
                        </div>
                    </div>
                );
                break;

            case "create":
                let games = this.props.games;
                let name = this.state.name;

                let gameList = Object.keys(games).map( /* 'games' isa dictionary which maps game names to gameWrappers */
                    (dictKey) => {                     /* We convert the dictionary into a list of create game buttons */
                        return (
                            <Button
                                buttonText={dictKey}
                                clickHandler={this.props.clickCreate} // click create, creates a gameWrapper of the correct game.
                                key={dictKey}                         // React unique key for all child components
                                clickArgs={{ gameType: dictKey, name: name }}
                            />
                        )
                    }
                );

                return (
                    <div className={styles.button_list}>

                        {gameList}

                        <h3>or</h3>

                        <Button
                            buttonText="Back"
                            clickHandler={() => {
                                this.setState({ selection: "none" })
                            }}
                        />
                    </div>
                );
                break;

            default:
                return (<h2>"OH LAWDY SOMETHING WENT WRONG."</h2>);
        }

    }
}

export default Home;
