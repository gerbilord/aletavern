/*
 * @prettier
 */

import React, { useEffect, useState } from 'react';
import Button from 'Frontend/baseComponents/Button';

import 'Icebreaker/icebreaker.css';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Ib_DroppableChoiceList from 'Icebreaker/IbPlayer/Ib_DraggableComponents/Ib_DroppableChoiceList';

import { PlayerPromptExtraViewData } from '../Ib_AnswerPromptEngine';
import RankPrompt from 'Icebreaker/IbHost/Rounds/HostAsksRankPromptToAllRound/RankPrompt';
import { ReactRoundViewProps } from 'Icebreaker/IbShared/IbRoundComponentLoader';

export default function Ib_RankPromptView(props: ReactRoundViewProps) {
    const { viewData } = props;

    const {
        promptData,
        answerSent,
        updateAnswer,
        sendAnswer,
    }: PlayerPromptExtraViewData<RankPrompt> = viewData?.getExtraData();

    const [userOrder, setUserOrder] = useState(Array.from(promptData.choices));

    useEffect(() => {
        updateAnswer(userOrder);
    }, []);

    const handleSendMessage = () => {
        updateAnswer(userOrder);
        sendAnswer();
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
        <div className={'basic_col'}>
            <h2>{promptData.mainPrompt}</h2>
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
