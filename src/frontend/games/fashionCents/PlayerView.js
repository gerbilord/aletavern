import React, { useEffect, useState } from 'react';
import Stack from 'Games/fashionCents/StackView';
import CONSTANTS from 'Games/fashionCents/fcConstants';
import Command from 'Games/fashionCents/Command';


var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

function removeDefault(list){
    return list.filter(item=>item.location !== "default");
}

export default (props) => {
    const ws = props.gameWrapper.gameEngine.ws;

    const [stackList, setStackList] = useState([]);
    const [player1Stack, setPlayer1Stack] = useState([]);
    const [store1Stack, setStore1Stack] = useState([]);

    const stackNameToStackUpdater = {};
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1] = setPlayer1Stack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STORE1] = setStore1Stack;

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
                            stackNameToStackUpdater[stackName]({...data[CONSTANTS.STACKS][stackName]});
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

    return (
        <div>
            <h1>Fashion Cents</h1>
            <Stack setStack={setStore1Stack} stack={store1Stack} moveCommand={createMoveCardCommand(CONSTANTS.STACK_NAMES.STORE1, CONSTANTS.STACK_NAMES.PLAYER1)}/>
            <Stack setStack={setPlayer1Stack} stack={player1Stack} moveCommand={createMoveCardCommand(CONSTANTS.STACK_NAMES.PLAYER1, CONSTANTS.STACK_NAMES.STORE1)}/>
        </div>
    );
}
