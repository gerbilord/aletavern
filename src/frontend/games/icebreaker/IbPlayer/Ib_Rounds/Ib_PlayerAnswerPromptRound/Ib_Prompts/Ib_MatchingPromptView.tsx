/*
 * @prettier
 */

import React, { useEffect, useState } from 'react';
import Button from 'Frontend/baseComponents/Button';

import 'Icebreaker/icebreaker.css';
import { DragDropContext } from 'react-beautiful-dnd';
import Ib_DroppableChoiceList from 'Icebreaker/IbPlayer/Ib_DraggableComponents/Ib_DroppableChoiceList';
import { ReactRoundViewProps } from 'Icebreaker/IbShared/IbRoundComponentLoader';
import { PlayerPromptExtraViewData } from 'Icebreaker/IbPlayer/Ib_Rounds/Ib_PlayerAnswerPromptRound/Ib_AnswerPromptEngine';
import MatchingPrompt from 'Icebreaker/IbHost/Rounds/HostAsksMatchingPromptToAll/MatchingPrompt';

const DEFAULT_DROPPABLE_ID = 'UNMATCHED-DEFAULT';

export default function Ib_MatchingPromptView(props: ReactRoundViewProps) {
    const { viewData } = props;

    const {
        promptData,
        answerSent,
        updateAnswer,
        sendAnswer,
    }: PlayerPromptExtraViewData<MatchingPrompt> = viewData?.getExtraData();

    const [unmatchedItems, setUnmatchedItems] = useState([
        ...promptData.matchables,
    ]);
    const [userMatches, setUserMatches] = useState({});

    useEffect(() => {
        const matchObj = {};
        promptData.categories.forEach((category) => {
            matchObj[category] = '';
        });
        setUserMatches(matchObj);
    }, []);

    const handleSendMessage = () => {
        updateAnswer(userMatches);
        sendAnswer();
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        // Don't care if you drag it out of range.
        if (!destination) {
            return;
        }

        // Don't care about drag and drop in place.
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Don't allow more than 1 in boxes unless unassigned
        if (
            destination.droppableId !== DEFAULT_DROPPABLE_ID &&
            userMatches[destination.droppableId] !== ''
        ) {
            return;
        }

        // Reordering within unmatched list
        if (
            source.droppableId === DEFAULT_DROPPABLE_ID &&
            destination.droppableId === DEFAULT_DROPPABLE_ID &&
            destination.index !== source.index
        ) {
            const newUnmatchedOrder = Array.from(unmatchedItems);

            newUnmatchedOrder.splice(source.index, 1);
            newUnmatchedOrder.splice(destination.index, 0, draggableId);

            setUnmatchedItems(newUnmatchedOrder);
            return;
        }

        // Between list stuff
        const newUnmatchedOrder = Array.from(unmatchedItems);
        const newMatchedObj = { ...userMatches };

        if (source.droppableId === DEFAULT_DROPPABLE_ID) {
            newUnmatchedOrder.splice(source.index, 1);
        } else {
            newMatchedObj[source.droppableId] = '';
        }

        if (destination.droppableId === DEFAULT_DROPPABLE_ID) {
            newUnmatchedOrder.splice(destination.index, 0, draggableId);
        } else {
            newMatchedObj[destination.droppableId] = draggableId;
        }

        updateAnswer(newMatchedObj);
        setUserMatches(newMatchedObj);
        setUnmatchedItems(newUnmatchedOrder);
    };

    if (answerSent) {
        return <h2>Waiting for other players to finish.</h2>;
    }

    return (
        <div className={'basic_col'}>
            <h2>{promptData.mainPrompt}</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <Ib_DroppableChoiceList
                    key={DEFAULT_DROPPABLE_ID}
                    droppableId={DEFAULT_DROPPABLE_ID}
                    choices={unmatchedItems}
                />
                {promptData.categories.map((category) => (
                    <div key={category} className={'ib-matching-category'}>
                        {category}
                        <Ib_DroppableChoiceList
                            droppableId={category}
                            choices={[userMatches[category]]}
                        />
                    </div>
                ))}
            </DragDropContext>
            <Button buttonText="Send" clickHandler={handleSendMessage} />
        </div>
    );
}
