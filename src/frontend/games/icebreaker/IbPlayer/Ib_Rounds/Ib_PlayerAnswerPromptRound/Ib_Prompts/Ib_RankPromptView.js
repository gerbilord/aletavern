/*
 * @prettier
 */

import React, { useEffect, useState } from 'react';
import Button from 'Frontend/baseComponents/Button'; //TODO make own components for game

import styles from 'Icebreaker/icebreaker.module.css';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Ib_DroppableChoiceList from 'Icebreaker/IbPlayer/Ib_DraggableComponents/Ib_DroppableChoiceList';

export default function Ib_RankPromptView(props) {
    const { viewData } = props;

    const {
        prompt,
        answerSent,
        updateAnswer,
        sendAnswer,
    } = viewData?.getExtraData();

    const [userOrder, setUserOrder] = useState(Array.from(prompt.choices));

    useEffect(() => {
        updateAnswer(userOrder);
    }, []);

    const handleSendMessage = () => {
        updateAnswer(userOrder);
        sendAnswer(userOrder);
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newUserOrder = Array.from(userOrder);
        newUserOrder.splice(source.index, 1);
        newUserOrder.splice(destination.index, 0, draggableId);

        updateAnswer(newUserOrder);
        setUserOrder(newUserOrder);
    };

    if (answerSent) {
        return <h2>Waiting for other players to finish.</h2>;
    }

    return (
        <div className={styles.basic_col}>
            <h2>{prompt.mainPrompt}</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <Ib_DroppableChoiceList
                    droppableId={'rankChoiceDroppableList'}
                    choices={userOrder}
                />
            </DragDropContext>
            <Button buttonText="Send" clickHandler={handleSendMessage} />
        </div>
    );
}
