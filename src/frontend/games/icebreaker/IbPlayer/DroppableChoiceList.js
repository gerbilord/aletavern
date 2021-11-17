import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DraggableText from 'Icebreaker/IbPlayer/DraggableText';
export default function DroppableChoiceList(props) {
    const {choices, droppableId} = props;

    return (<Droppable droppableId={droppableId}>
        {
            (provided, snapshot)=>(
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={"ib-droppableChoiceList"}
                >
                    {choices.map((choice, index) => choice !== '' && choice != null && <DraggableText key={choice} index={index} text={choice}/>)}
                    {provided.placeholder}
                </div>
            )
        }

    </Droppable>);
}