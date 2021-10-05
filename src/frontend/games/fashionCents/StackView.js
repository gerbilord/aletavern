import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from 'Games/fashionCents/fcConstants';
import classNames from 'classnames';
import './FashionCents.css';
import Command from 'Games/fashionCents/Command';
import Stack from './Stack';
import CardView from 'Games/fashionCents/CardView';

const propTypes = {
    stack: PropTypes.object,
    isFaceUp: PropTypes.bool,
    command: PropTypes.object,
    onClick: PropTypes.func,
    onRightClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    sizeClass: PropTypes.string
}

const defaultProps = {
    stack: null,
    isFaceUp: true,
    command: null,
    onClick: ()=>{},
    onRightClick: ()=>{},
    onMouseEnter: ()=>{},
    onMouseLeave: ()=>{},
    sizeClass: "",
}

const StackView = (props) => {
    let {stack,
        isFaceUp,
        command,
        onClick, onRightClick,
        onMouseEnter, onMouseLeave,
        sizeClass} = props;

    if(stack?.cards == null){
        return <p>Empty</p>;
    }

    const isSelected = stack.isAnyCardInStack(command.selectedCards); // Is selected is based off command. It will update when command does.

    const onEventWrapper = (onEventFunction) =>{
        return (e)=>{
            onEventFunction(e, props);
        }
    }

    return (
        <div onClick={onEventWrapper(onClick)}
             onContextMenu={onEventWrapper(onRightClick)}
             onMouseEnter={onEventWrapper(onMouseEnter)}
             onMouseLeave={onEventWrapper(onMouseLeave)}
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
            {!isFaceUp && stack.cards.length > 0 && (
                <CardView
                    className={classNames(sizeClass, "fc-stacked")}
                    card={stack.cards[0]}
                    isFaceUp={false}
                    key={stack.cards[0].toString() + "back"}
                />)
            }

        </div>
    );
}
StackView.propTypes = propTypes;
StackView.defaultProps = defaultProps;

export default StackView;