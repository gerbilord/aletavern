import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import styles from '../../quiplash.module.css';
import Button from '../../../../baseComponents/Button';

export default function Answer(props) {
    var { prompt, sendAnswer } = props;
    const [answer, setAnswer] = useState("");

    return (
        <div>
            <h5>
                {prompt}
            </h5>
            <input
                type="text"
                placeholder="something funny..."
                onChange={(event) => setAnswer(event.target.value)}
                value={answer}
            />
            <Button
                buttonText={"Submit"}
                clickHandler={sendAnswer}
                clickArgs={answer}
                isDisabled={answer.length <= 0}
            />
        </div>
    );
}
