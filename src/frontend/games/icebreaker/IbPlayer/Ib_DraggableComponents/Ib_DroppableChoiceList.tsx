import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Ib_DraggableText from 'Icebreaker/IbPlayer/Ib_DraggableComponents/Ib_DraggableText';
export default function Ib_DroppableChoiceList(props:{choices:string[], droppableId:string}) {
    const {choices, droppableId} = props;

    return (<Droppable droppableId={droppableId}>
        {
            (provided, snapshot)=>(
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={"ib-droppableChoiceList"}
                >
                    {choices.map((choice, index) => choice !== '' && choice != null && <Ib_DraggableText key={choice} index={index} text={choice}/>)}
                    {provided.placeholder}
                </div>
            )
        }

    </Droppable>);
}