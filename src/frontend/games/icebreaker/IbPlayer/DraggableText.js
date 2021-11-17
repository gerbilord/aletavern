import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import 'Icebreaker/icebreaker.css';
import classNames from 'classnames';

export default function DraggableText(props) {
    const {text, index} = props;

    return (
        <Draggable draggableId={text} index={index}>
            {
                (provided, snapshot)=>(
                    <div className={classNames("ib-draggableText", {dragging:snapshot.isDragging})}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        {text}
                    </div>
                )
            }

        </Draggable>
    );

}