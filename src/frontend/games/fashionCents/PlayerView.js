import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import Stack from 'Games/fashionCents/StackView';
import StackObject from 'Games/fashionCents/Stack'
import CONSTANTS from 'Games/fashionCents/fcConstants';
import Command from 'Games/fashionCents/Command';
import CardSelectorView from 'Games/fashionCents/CardSelectorView';


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



    const [cardSelectorOpen, setCardSelectorOpen] = useState(false);
    const [cardSelectorStack, setCardSelectorStack] = useState({});

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

    const onStackClick = (e, stack) =>{
        const isSelected = stack.isAnyCardInStack(command.selectedCards);

        if(isSelected){
            setCommand(new Command()); // Clear command, which unselects us.
        } else { // We are not selected.
            if(command.fromStack === "" && stack.cards.length > 0){ // If no other stack is set, and we have cards to give.
                command.type = CONSTANTS.COMMAND_TYPE.MOVE; // Declare that it will be a move command.
                command.fromStack = stack.name; // Set the stack to ours!
                command.selectedCards.push(stack.cards[0]); // And our top card as the one to move.
                setCommand(Command.fromJson(command)); // And update our command, Command.fromJson is to make a copy so react knows to update.
            } else if(command.type === CONSTANTS.COMMAND_TYPE.MOVE // If it's a move command,
                && command.fromStack !== "" // and the giving stack is sent,
                && command.selectedCards.length > 0){ // and there are cards to give.
                command.toStack = stack.name; // Send those cards to us.
                sendCommand(); // This clears the command for us.
            }
        }
    }

    const onStackRightClick = (e, stack)=>{
        e.preventDefault();
        if(stack.cards.length > 0){
            setCardSelectorStack(stack);
            setCardSelectorOpen(true);
        }
    }

    const onCardInCardSelectorClicked = (e, card, stack) =>{
        setCommand(new Command()); // Clear command.
        command.type = CONSTANTS.COMMAND_TYPE.MOVE; // Declare that it will be a move command.
        command.fromStack = stack.name; // Set the stack to the one the card exists
        command.selectedCards.push(card); // And clicked card.
        setCommand(Command.fromJson(command)); // And update our command, Command.fromJson is to make a copy so react knows to update.
        setCardSelectorOpen(false);
    }

    return (
        <div>
            <h1>Fashion Cents</h1>
            <CardSelectorView
                open={cardSelectorOpen}
                setOpen={setCardSelectorOpen}
                stack={cardSelectorStack}
                onCardClicked={onCardInCardSelectorClicked}
                cardSizeClass={"fc-card-medium"}
            />
            <div className={"fc-flex-container"}>
                <Stack stack={player1GuyStack}
                       setStack={setPlayer1GuyStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       onClick={onStackClick}
                       onRightClick={onStackRightClick}
                       sizeClass={"fc-card-large"}
                />
                <Stack stack={player1DeckStack}
                       setStack={setPlayer1DeckStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       onClick={onStackClick}
                       onRightClick={onStackRightClick}
                       sizeClass={"fc-card-medium"}
                       isFaceUp={false}
                />
                <Stack stack={player1DiscardStack}
                       setStack={setPlayer1DiscardStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       onClick={onStackClick}
                       onRightClick={onStackRightClick}
                       sizeClass={"fc-card-medium"}
                />
            </div>
            <div className={"fc-flex-container"}>
                <Stack stack={player2GuyStack}
                       setStack={setPlayer2GuyStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       onClick={onStackClick}
                       onRightClick={onStackRightClick}
                       sizeClass={"fc-card-large"}
                />
                <Stack stack={player2DeckStack}
                       setStack={setPlayer2DeckStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       onClick={onStackClick}
                       onRightClick={onStackRightClick}
                       sizeClass={"fc-card-medium"}
                       isFaceUp={false}
                />
                <Stack stack={player2DiscardStack}
                       setStack={setPlayer2DiscardStack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       onClick={onStackClick}
                       onRightClick={onStackRightClick}
                       sizeClass={"fc-card-medium"}
                />
            </div>
            <div className={"fc-flex-container"}>
                <Stack setStack={setStore1Stack}
                       stack={store1Stack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       onClick={onStackClick}
                       onRightClick={onStackRightClick}
                       sizeClass={"fc-card-small"}
                />
                <Stack setStack={setStore2Stack}
                       stack={store2Stack}
                       command={command}
                       setCommand={setCommand}
                       sendCommand={sendCommand}
                       onClick={onStackClick}
                       onRightClick={onStackRightClick}
                       sizeClass={"fc-card-small"}
                />
            </div>
        </div>
    );
}
