import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DraggableText from 'Icebreaker/IbPlayer/DraggableText';
export default function DroppableChoiceList(props) {
    const {choices} = props;

    return (<Droppable droppableId={"rankChoiceDroppableList"}>
        {
            (provided, snapshot)=>(
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={"ib-droppableChoiceList"}
                >
                    {choices.map((choice, index) => <DraggableText key={choice} index={index} text={choice}/>)}
                    {provided.placeholder}
                </div>
            )
        }

    </Droppable>);
}