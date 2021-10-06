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
    isFaceUp: PropTypes.bool,
    command: PropTypes.object,
    onClick: PropTypes.func,
    onRightClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    hoverMenuActions: PropTypes.arrayOf(PropTypes.shape({displayName: PropTypes.string, onClick:PropTypes.func})),
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
    hoverMenuActions: [],
    sizeClass: "",
}

const StackView = (props) => {
    let {stack,
        isFaceUp,
        command,
        onClick, onRightClick,
        onMouseEnter, onMouseLeave,
        hoverMenuActions,
        sizeClass} = props;

    const isSelected = stack instanceof Stack ? stack.isAnyCardInStack(command.selectedCards) : false; // Is selected is based off command. It will update when command does.

    const onEventWrapper = (onEventFunction) =>{
        return (e)=>{
            onEventFunction(e, props);
        }
    }

    let isClickable = false;

    if(stack?.cards?.length > 0 || (command?.fromStack !== stack?.name && command?.selectedCards.length > 0)){
        isClickable = true;
    }

    const mainContent =
        (<div onClick={onEventWrapper(onClick)}
              onContextMenu={onEventWrapper(onRightClick)}
              className={classNames(sizeClass, "fc-stack-placeholder-color", {"fc-selected":isSelected, "fc-unselected":!isSelected, "fc-clickable":isClickable})}>
            {stack?.cards?.length > 0 && stack?.cards?.slice(0).reverse().map(
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
                { stack?.cards?.length > 0 &&
                <div>
                    {hoverMenuActions.map(({displayName, onClick})=>{
                        return <div className={"fc-clickable fc-popup-menu-content-item"}
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