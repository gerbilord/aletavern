import React from 'react';

export default function IbRoundComponentLoader(props) {
    const { ws, viewData, roundViews, viewLevel } = props;

    const viewTypes = viewData?.getViewTypes();
    const extraData = viewData?.getExtraData();

    if (
        viewTypes &&
        viewTypes.length > viewLevel &&
        roundViews[viewTypes[viewLevel]]
    ) {
        const ReactRoundView = roundViews[viewTypes[viewLevel]];
        return (
            <ReactRoundView
                ws={ws}
                viewLevel={viewLevel}
                viewTypes={viewTypes}
                extraData={extraData}
            />
        );
    } else {
        return (
            <div>
                <h1>Icebreaker Game</h1>
                <h2>No view data D;</h2>
            </div>
        );
    }
}
