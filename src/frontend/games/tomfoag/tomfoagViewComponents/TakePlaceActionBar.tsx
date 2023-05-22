/*
 * @prettier
 */
import React from 'react';
import {IMoveType} from "Tomfoag/tomfoagEngine";

const textSize = 40;

type Iprops = {
    selectedAction: IMoveType,
    selectTake: ()=>void,
    selectPlace: ()=>void,
    canPlace: boolean,
};

const TakePlaceActionBar = (props:Iprops) => {
    const {selectedAction, canPlace} = props;

    return (
        <div style={{ fontSize: textSize + 'px', textAlign: 'center' }}>
            {selectedAction === 'move'
                ? <div className={selectedAction === 'move' ? "place-take-item place-take-item-selected" :"place-take-item"} onClick={props.selectPlace}>🚶 move</div>
                : <>
                {canPlace && <div className={selectedAction === 'place' ? "place-take-item place-take-item-selected" :"place-take-item"} onClick={props.selectPlace}>🍧 place</div>}
                    <div className={selectedAction === 'take' ? "place-take-item place-take-item-selected" :"place-take-item"} onClick={props.selectTake}>🌶take</div>
                </>

            }

        </div>
    );
};

export default TakePlaceActionBar;
