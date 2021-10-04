import React, { useState } from 'react';
import CONSTANTS from 'Games/fashionCents/fcConstants';

export default (props) => {
    const {card, isFaceUp, onClick, className} = props;

    const onClickWrapper = (event)=>{
        onClick(event, card);
    };

    const srcUrl = isFaceUp === false ? card.cardBackUrl : card.url;

    return (
        <img
            className={className}
            onClick={onClick == null ? undefined : onClickWrapper}
            src={CONSTANTS.BASE_URL+srcUrl}
            alt={"card"}
        />
    );
}