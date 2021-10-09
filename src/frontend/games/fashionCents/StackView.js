import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from 'Games/fashionCents/fcConstants';
import classNames from 'classnames';
import './FashionCents.css';
import Command from 'Games/fashionCents/Command';
import Stack from './Stack';
import CardView from 'Games/fashionCents/CardView';
import Popup from 'reactjs-popup';

const propTypes = {
    stack: PropTypes.object,
    label: PropTypes.string,
    isFaceUp: PropTypes.bool,
    onClick: PropTypes.func,
    onRightClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    hoverMenuActions: PropTypes.arrayOf(PropTypes.shape({displayName: PropTypes.string, onClick:PropTypes.func})),
    sizeClass: PropTypes.string,
    labelSizeClass: PropTypes.string,
    showCardCounter: PropTypes.bool,
    isSelected:PropTypes.bool,
    isClickable:PropTypes.bool,
}

const defaultProps = {
    stack: null,
    label: "",
    isFaceUp: true,
    onClick: ()=>{},
    onRightClick: ()=>{},
    onMouseEnter: ()=>{},
    onMouseLeave: ()=>{},
    hoverMenuActions: [],
    sizeClass: "",
    labelSizeClass: "",
    showCardCounter: true,
    isSelected: false,
    isClickable: true,
}

const StackView = (props) => {
    let {stack,
        label,
        isFaceUp,
        onClick, onRightClick,
        onMouseEnter, onMouseLeave,
        hoverMenuActions,
        sizeClass,
        labelSizeClass,
        showCardCounter,
        isClickable,
        isSelected} = props;

    const onEventWrapper = (onEventFunction) =>{
        return (e)=>{
            onEventFunction(e, props);
        }
    }

    const mainContent =
        (<div onClick={onEventWrapper(onClick)}
              onContextMenu={onEventWrapper(onRightClick)}
              className={classNames(sizeClass, "fc-stack-placeholder-color", "fc-relative-position", {"fc-selected":isSelected, "fc-unselected":!isSelected, "fc-clickable":isClickable})}>
            {stack?.cards?.length > 0 && (isFaceUp || stack?.cards?.length < 25) && stack?.cards?.slice(0).reverse().map(
                (card, index) =>{
                    return (<CardView
                        className={classNames(sizeClass, "fc-stacked")}
                        card={card}
                        key={card.toString()}
                    />)
                })
            }
            {!isFaceUp && stack?.cards?.length > 0 && (
                <CardView
                    className={classNames(sizeClass, "fc-stacked")}
                    card={stack.cards[0]}
                    isFaceUp={false}
                    key={stack.cards[0].toString() + "back"}
                />)
            }
            { stack?.cards?.length > 1 &&  showCardCounter &&
                <div className={"fc-card-counter-container"}>
                    <div className={"fc-card-counter"}>
                        {stack.cards.length}
                    </div>
                </div>

            }
            { label !== "" &&
                <div className={"fc-label-container"}>
                    <div className={"fc-label " + labelSizeClass}>{label}</div>
                </div>
            }
        </div>);

    return (
        <div
        >
            <div
                onMouseEnter={onEventWrapper(onMouseEnter)}
                onMouseLeave={onEventWrapper(onMouseLeave)}>
            <Popup
                className={"fc-popup-menu"}
                trigger={mainContent}
                position="right top"
                on="hover"
                closeOnDocumentClick
                mouseLeaveDelay={150}
                mouseEnterDelay={500}
                contentStyle={{ padding: '0px', border: 'none' }}
                arrow={false}
            >
                { stack?.cards?.length > 1 &&
                <div>
                    {hoverMenuActions.map(({displayName, onClick})=>{
                        return <div className={"fc-clickable fc-popup-menu-content-item "}
                                    onClick={onEventWrapper(onClick)}
                                    key={displayName}
                        >
                            {displayName}
                        </div>;
                    })}
                </div>
                }
            </Popup>
            </div>
        </div>
    );
}
StackView.propTypes = propTypes;
StackView.defaultProps = defaultProps;

export default StackView;