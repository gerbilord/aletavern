import React, { useEffect, useState } from 'react';
import Stack from 'Games/fashionCents/StackView';


var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

function removeDefault(list){
    return list.filter(item=>item.location !== "default");
}

export default (props) => {
    const gameEngine = props.gameWrapper.gameEngine;

    const [logs, setLogs] = useState([]);
    gameEngine.setLogUpdater((newLogs)=>setLogs([...newLogs]));

    return (
        <div>
            <h1>Fashion Cents</h1>
            <h2>Game Id: {gameEngine.ws.gameId}</h2>
            <h3>Logs</h3>
            {logs.map((log, index)=><p key={log+index}>{log.toString()}</p>)}
        </div>
    );
}
