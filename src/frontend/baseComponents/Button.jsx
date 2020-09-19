import React from "react";

function Button(props) {
   let {buttonText, clickHandler, clickArgs, passEvent} = props;

    let funcNoEvent = ()=>clickHandler(clickArgs); // TODO consider expanding clickArgs
    let funcWithEvent = (event)=>clickHandler(event, clickArgs);

    let clickHandlerWithArgs = passEvent ? funcWithEvent : funcNoEvent;

    return(
        <button onClick={clickHandlerWithArgs}>
            {buttonText}
        </button>
    )
}

export default Button;
