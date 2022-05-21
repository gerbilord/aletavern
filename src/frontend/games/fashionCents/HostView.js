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
            <button style={{margin:"2px", background:"LightGreen", cursor: "pointer"}} onClick={()=>{navigator.clipboard.writeText(gameEngine.exportGameToJson());}}>Copy game to clipboard</button>
            <button style={{margin:"2px", background:"Gold", cursor: "pointer"}} onClick={()=>{navigator.clipboard.readText().then(clipboardValue=> gameEngine.importGameFromJson(clipboardValue))}}>Read game from clipboard</button>
            <button style={{margin:"2px", background:"Crimson", cursor: "pointer"}} onClick={()=>{gameEngine.attemptRecovery()}}>Attempt recovery of previous game</button>
            <button style={{margin:"2px", background:"DodgerBlue", cursor: "pointer"}} onClick={()=>{gameEngine.undoCommand()}}>Attempt Undo</button>

            <h3>Logs</h3>
            {logs.map((log, index)=><p key={log+index}>{log.toString()}</p>)}
        </div>
    );
}
