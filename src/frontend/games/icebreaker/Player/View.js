// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import Lobby from './Views/Lobby';
import styles from '../icebreaker.module.css';

export default class QuiplashView extends React.Component {
    constructor(props) {
        super(props);

        this.gameEngine = this.props.gameWrapper.gameEngine;
    }

    render() {
        return (
            <div className={styles.global}>
                <Lobby />
            </div>
        );
    }

    componentDidMount() {}

    componentWillUnmount() {}
}
