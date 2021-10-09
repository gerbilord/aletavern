import React, { useState } from 'react';
import CONSTANTS from 'Games/fashionCents/fcConstants';
import classNames from 'classnames';
import CardView from 'Games/fashionCents/CardView';
import './FashionCents.css';
import Popup from 'reactjs-popup';
import StackView from 'Games/fashionCents/StackView';
import Stack from './Stack';
import PropTypes from 'prop-types';

const propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    stack: PropTypes.object.isRequired,
    onCardClick: PropTypes.func,
    command: PropTypes.object
}

const defaultProps = {
    onCardClick: ()=>{},
    command: null
}

export default (props) => {
    let {open, setOpen,
        stack,
        onCardClick, // is passed clickEvent, card, stack
        command} = props;

    if(!open){ return null; }

    let cardSizeClass = "fc-card-large";

    if(stack?.cards?.length > 8){
        cardSizeClass = "fc-card-medium"
    }
    if(stack?.cards?.length > 15){
        cardSizeClass = "fc-card-small"
    }
    if(stack?.cards?.length > 70){
        cardSizeClass = "fc-card-tiny"
    }


    return (
        <Popup
            open={open}
            closeOnDocumentClick
            closeOnEscape
            overlayStyle = {{ background: 'rgba(0,0,0,0.7)' }}
            onClose={()=>setOpen(false)}
            lockScroll={true}
        >
            <div className={classNames("fc-flex-container", "fc-flex-container-wrap", "fc-flex-container-center", "fc-card-selector", "fc-scrollable")}
            onContextMenu={(e)=>{e.preventDefault(); setOpen(false);}}>
                {stack.cards.map((card)=>{
                    const placeHolderStack = new Stack(); // The single card is really just a stack with a single card!
                    placeHolderStack.cards.push(card);
                    const onStackClickWrapper = (e, phStackProps) => { // We want to call the event handler with the stack the card truly is in
                        onCardClick(e, card, {stack}); // not the fake ph stack.
                    }
                    return <StackView
                        stack={placeHolderStack}
                        sizeClass={cardSizeClass}
                        onClick={onStackClickWrapper}
                        key={card.toString()}
                        showCardCounter={false}
                        isSelected={command?.selectedCards?.some(someCard=>someCard.equals(card)) || false}
                        isClickable={true}
                />
                })}
            </div>
        </Popup>
    );
}
