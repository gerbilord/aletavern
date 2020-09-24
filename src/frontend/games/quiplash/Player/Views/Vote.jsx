import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import styles from '../../quiplash.module.css';

export default function Vote(props) {
    var { propmts, vote } = props;

    // TODO make button per prompt.
    return (
        <div>
            <h5>
                {prompts}
            </h5>
            <Button
                buttonText={"Vote"}
                clickHandler={vote}
                clickArgs={"PROMPT HERE"}
            />
        </div>
    );
}
