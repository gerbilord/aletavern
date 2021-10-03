import React from 'react';
import CONSTANTS from 'Games/fashionCents/fcConstants';
import classNames from 'classnames';
import './FashionCents.css';

export default (props) => {
    let {stack, setStack, moveCommand} = props;
    if(stack?.cards == null){
        return <p>Empty</p>;
    }

    const onStackClick = (e) =>{
        moveCommand(stack.cards[0]);
    }

    return (
        <div onClick={onStackClick}>
            {stack.cards.slice(0).reverse().map(
                (card, index) =>{
                    return (<img
                        className={classNames( "fc-card-default", {
                                "fc-stacked":index !== 0,
                            })}
                        src={CONSTANTS.BASE_URL+card.url}
                        key={CONSTANTS.BASE_URL+card.url + card.id}
                        alt={"card"}
                    />)
                })
            }
        </div>
    );
}
