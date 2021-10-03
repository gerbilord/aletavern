import React, { useEffect, useState } from 'react';
import Stack from 'Games/fashionCents/StackView';
import StackObject from 'Games/fashionCents/Stack'
import CONSTANTS from 'Games/fashionCents/fcConstants';
import Command from 'Games/fashionCents/Command';


var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

function removeDefault(list){
    return list.filter(item=>item.location !== "default");
}

export default (props) => {
    const ws = props.gameWrapper.gameEngine.ws;
    const stackNameToStackUpdater = {};

    const [stackList, setStackList] = useState([]);


    const [store1Stack, setStore1Stack] = useState({});
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STORE1] = setStore1Stack;

    const [store2Stack, setStore2Stack] = useState({});
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STORE2] = setStore2Stack;

    const [player1GuyStack, setPlayer1GuyStack] = useState({});
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1_GUY] = setPlayer1GuyStack;

    const [player2GuyStack, setPlayer2GuyStack] = useState({});
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER2_GUY] = setPlayer2GuyStack;

    const [player1DeckStack, setPlayer1DeckStack] = useState({});
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1_DECK] = setPlayer1DeckStack;

    const [player2DeckStack, setPlayer2DeckStack] = useState({});
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER2_DECK] = setPlayer2DeckStack;

    const [player1DiscardStack, setPlayer1DiscardStack] = useState({});
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1_DISCARD] = setPlayer1DiscardStack;

    const [player2DiscardStack, setPlayer2DiscardStack] = useState({});
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER2_DISCARD] = setPlayer2DiscardStack;




    const [command, setCommand] = useState(new Command());

    useEffect(
        ()=>{
            const shouldUpdateStack = (stackName, stacksToUpdate) => {
                if(stacksToUpdate == null || stacksToUpdate.length === 0){
                    return true;
                } else if (stacksToUpdate.find(item => item === stackName)){
                    return true;
                }
                return false;
            }

            const onUpdateStacks = (serverResponse) => {
                const data = serverResponse.data;
                if(data[CONSTANTS.MESSAGE_TYPE_KEY] === CONSTANTS.MESSAGE_TYPE.UPDATE_STACKS){

                    for (const stackName in stackNameToStackUpdater){
                        if (shouldUpdateStack(stackName, data[CONSTANTS.STACKS_TO_UPDATE])){
                            stackNameToStackUpdater[stackName](StackObject.fromJson(data[CONSTANTS.STACKS][stackName]));
                        }
                    }
                }
            };

            ws.onMessageGame.push(onUpdateStacks);
        },
        []
    );

    const createMoveCardCommand = (fromStack, toStack)=>{
        return (card) =>{

            const command = new Command();
            command.type = CONSTANTS.COMMAND_TYPE.MOVE;
            command.fromStack = fromStack;
            command.toStack = toStack;
            command.selectedCards.push(card);

            const message = {};
            message[CONSTANTS.MESSAGE_TYPE_KEY] = CONSTANTS.MESSAGE_TYPE.COMMAND;
            message[CONSTANTS.COMMAND] = command;

            ws.sendMessageToHost(message);
        };
    };

    const sendCommand = () => {
        const message = {};
        message[CONSTANTS.MESSAGE_TYPE_KEY] = CONSTANTS.MESSAGE_TYPE.COMMAND;
        message[CONSTANTS.COMMAND] = command;

        ws.sendMessageToHost(message);
        setCommand(new Command());
    }

    return (
        <div>
            <h1>Fashion Cents</h1>
            <div className={"fc-flex-container"}>
                <Stack stack={player1GuyStack}
                       setStack={setPlayer1GuyStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       sizeClass={"fc-card-large"}
                />
                <Stack stack={player1DeckStack}
                       setStack={setPlayer1DeckStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       sizeClass={"fc-card-medium"}
                />
                <Stack stack={player1DiscardStack}
                       setStack={setPlayer1DiscardStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       sizeClass={"fc-card-medium"}
                />
            </div>
            <div className={"fc-flex-container"}>
                <Stack stack={player2GuyStack}
                       setStack={setPlayer2GuyStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       sizeClass={"fc-card-large"}
                />
                <Stack stack={player2DeckStack}
                       setStack={setPlayer2DeckStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       sizeClass={"fc-card-medium"}
                />
                <Stack stack={player2DiscardStack}
                       setStack={setPlayer2DiscardStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       sizeClass={"fc-card-medium"}
                />
            </div>
            <div className={"fc-flex-container"}>
                <Stack setStack={setStore1Stack}
                       stack={store1Stack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       sizeClass={"fc-card-small"}
                />
                <Stack setStack={setStore2Stack}
                       stack={store2Stack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       sizeClass={"fc-card-small"}
                />
            </div>
        </div>
    );
}
