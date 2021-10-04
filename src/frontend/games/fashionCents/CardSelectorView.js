import React, { useState } from 'react';
import CONSTANTS from 'Games/fashionCents/fcConstants';
import classNames from 'classnames';
import CardView from 'Games/fashionCents/CardView';
import './FashionCents.css';
import Popup from 'reactjs-popup';

export default (props) => {
    let {open, setOpen,
        stack,
        onCardClicked, // is passed clickEvent, card, stack
        cardSizeClass} = props;

    if(!open){ return null; }

    const onCardClickedWrapper = (...args) => {
        onCardClicked(...args, stack);
    };

    return (
        <Popup
            open={open}
            closeOnDocumentClick
            onClose={()=>setOpen(false)}
        >
            <div className={classNames("fc-flex-container", "fc-flex-container-wrap", "fc-card-selector")}>
                {stack.cards.map((card)=>{
                    return <CardView
                        card={card}
                        className={cardSizeClass}
                        onClick={onCardClicked == null ? undefined : onCardClickedWrapper}
                    />
                })}
            </div>
        </Popup>

    );
}
