import React from "react";

function Button({buttonText, clickHandler}) {
    return(
        <button onClick={clickHandler}>
          {buttonText}
        </button>
    )
}

export default Button;
