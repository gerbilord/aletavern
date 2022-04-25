import React from 'react';
import GameWebSocket from 'Frontend/GameWebSocket';
import icebreakerViewData from 'Icebreaker/IbShared/IbSharedViewData';

export type ReactRoundViewProps = {
    ws: GameWebSocket;
    viewData: icebreakerViewData;
    viewLevel: number;

};

export default function IbRoundComponentLoader(props:{
    ws: GameWebSocket;
    viewData: icebreakerViewData;
    roundViews: any[];
    viewLevel: number; }
) {
    const { ws, viewData, roundViews, viewLevel } = props;

    const viewTypes = viewData?.getViewTypes();

    if (
        viewTypes &&
        viewTypes.length > viewLevel &&
        roundViews[viewTypes[viewLevel]]
    ) {
        const ReactRoundView = roundViews[viewTypes[viewLevel]];
        return (
            <ReactRoundView
                ws={ws}
                viewData={viewData}
                viewLevel={viewLevel}
            />
        );
    } else {
        return (
            <div>
                <h1>Icebreaker Game</h1>
                <h2>No view data</h2>
            </div>
        );
    }
}
