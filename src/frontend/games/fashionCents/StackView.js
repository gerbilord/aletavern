import React, { useState } from 'react';
import CONSTANTS from 'Games/fashionCents/fcConstants';
import classNames from 'classnames';
import './FashionCents.css';
import Command from 'Games/fashionCents/Command';
import CardView from 'Games/fashionCents/CardView';

export default (props) => {
    let {stack, setStack,
        isFaceUp,
        command, setCommand, sendCommand,
        onClick, onRightClick,
        sizeClass} = props;

    if(stack?.cards == null){
        return <p>Empty</p>;
    }

    const isSelected = stack.isAnyCardInStack(command.selectedCards); // Is selected is based off command. It will update when command does.

    const onClickWrapper = (e) =>{
        onClick(e, stack);
    }

    const onRightClickWrapper = (e)=>{
        onRightClick(e, stack);
    }

    return (
        <div onClick={onClick == null ? undefined : onClickWrapper}
             onContextMenu={onRightClick == null ? undefined : onRightClickWrapper}
             className={classNames(sizeClass, "fc-stack-placeholder-color", {"fc-selected":isSelected, "fc-unselected":!isSelected})}>
            {stack.cards.slice(0).reverse().map(
                (card, index) =>{
                    return (<CardView
                        className={classNames(sizeClass, "fc-stacked")}
                        card={card}
                        key={card.toString()}
                    />)
                })
            }
            {!(isFaceUp === true || isFaceUp == null) && stack.cards.length > 0 && (
                <CardView
                    className={classNames(sizeClass, "fc-stacked")}
                    card={stack.cards[0]}
                    isFaceUp={false}
                    key={stack.cards[0].toString()}
                />)
            }

        </div>
    );
}
