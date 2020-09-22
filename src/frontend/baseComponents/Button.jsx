import React from "react";

function Button(props) {
    let { buttonText, clickHandler, clickArgs, passEvent, isDisabled } = props;

    let funcNoEvent = () => clickHandler(clickArgs); // TODO consider expanding clickArgs
    let funcWithEvent = (event) => clickHandler(event, clickArgs);

    let clickHandlerWithArgs = passEvent ? funcWithEvent : funcNoEvent;

    return (
        <button
            disabled={isDisabled}
            onClick={clickHandlerWithArgs}>
            {buttonText}
        </button>
    );
}

export default Button;
