import React, { useState } from 'react';
import CONSTANTS from 'Games/fashionCents/fcConstants';
import classNames from 'classnames';
import './FashionCents.css';
import Command from 'Games/fashionCents/Command';

export default (props) => {
    let {stack, setStack,
        command, setCommand, sendCommand,
        sizeClass} = props;

    if(stack?.cards == null){
        return <p>Empty</p>;
    }

    const isSelected = stack.isAnyCardInStack(command.selectedCards); // Is selected is based off command. It will update when command does.

    const onStackClick = (e) =>{
        if(isSelected){
            setCommand(new Command()); // Clear command, which unselects us.
        } else { // We are not selected.
            if(command.fromStack === "" && stack.cards.length > 0){ // If no other stack is set, and we have cards to give.
                command.type = CONSTANTS.COMMAND_TYPE.MOVE; // Declare that it will be a move command.
                command.fromStack = stack.name; // Set the stack to ours!
                command.selectedCards.push(stack.cards[0]); // And our top card as the one to move.
                setCommand(Command.fromJson(command)); // And update our command, Command.fromJson is to make a copy so react knows to update.
            } else if(command.type === CONSTANTS.COMMAND_TYPE.MOVE // If it's a move command,
                && command.fromStack !== "" // and the giving stack is sent,
                && command.selectedCards.length > 0){ // and there are cards to give.
                command.toStack = stack.name; // Send those cards to us.
                sendCommand(); // This clears the command for us.
            }
        }
    }

    return (
        <div onClick={onStackClick} className={classNames(sizeClass, "fc-stack-placeholder-color", {"fc-selected":isSelected, "fc-unselected":!isSelected})}>
            {stack.cards.slice(0).reverse().map(
                (card, index) =>{
                    return (<img
                        className={classNames( sizeClass, "fc-stacked")}
                        src={CONSTANTS.BASE_URL+card.url}
                        key={CONSTANTS.BASE_URL+card.url + card.id}
                        alt={"card"}
                    />)
                })
            }
        </div>
    );
}
