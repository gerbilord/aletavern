import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import Stack from 'Games/fashionCents/StackView';
import Card from './CardView';
import CardObject from './Card'
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
    const stackNameToStack = {};

    const [stackList, setStackList] = useState([]);


    const [store1Stack, setStore1Stack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STORE1] = store1Stack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STORE1] = setStore1Stack;

    const [store2Stack, setStore2Stack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STORE2] = store2Stack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STORE2] = setStore2Stack;

    const [player1GuyStack, setPlayer1GuyStack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER1_GUY] = player1GuyStack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1_GUY] = setPlayer1GuyStack;

    const [player2GuyStack, setPlayer2GuyStack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER2_GUY] = player2GuyStack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER2_GUY] = setPlayer2GuyStack;

    const [player1DeckStack, setPlayer1DeckStack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER1_DECK] = player1DeckStack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1_DECK] = setPlayer1DeckStack;

    const [player2DeckStack, setPlayer2DeckStack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER2_DECK] = player2DeckStack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER2_DECK] = setPlayer2DeckStack;

    const [player1DiscardStack, setPlayer1DiscardStack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER1_DISCARD] = player1DiscardStack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1_DISCARD] = setPlayer1DiscardStack;

    const [player2DiscardStack, setPlayer2DiscardStack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER2_DISCARD] = player2DiscardStack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER2_DISCARD] = setPlayer2DiscardStack;



    const [cardSelectorOpen, setCardSelectorOpen] = useState(false);
    const [cardSelectorStack, setCardSelectorStack] = useState({});

    const [command, setCommand] = useState(new Command());

    const [zoomedStackName, setZoomedStackName] = useState(null);
    const [isZoomedStackFaceUp, setIsZoomedStackFaceUp] = useState(true);

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

    const makeCommandMessage = (commandObject)=>{
        const message = {};
        message[CONSTANTS.MESSAGE_TYPE_KEY] = CONSTANTS.MESSAGE_TYPE.COMMAND;
        message[CONSTANTS.COMMAND] = commandObject;
        return message;
    }

    const sendCommand = () => {
        ws.sendMessageToHost(makeCommandMessage(command));
        setCommand(new Command());
    }

    const onStackClick = (e, stackProps) =>{
        const stack = stackProps.stack;
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

    const onStackRightClick = (e, stackProps)=>{
        const stack = stackProps.stack;
        e.preventDefault();
        if(stack.cards.length > 0){
            setCardSelectorStack(stack);
            setCardSelectorOpen(true);
        }
    }

    const onStackMouseEnter = (e, stackProps)=>{
        const stack = stackProps.stack;
        const isFaceUp = stackProps.isFaceUp;

        setZoomedStackName(stack.name);
        setIsZoomedStackFaceUp(isFaceUp);

    }

    const selectAllCards = (e, stackProps)=>{
        const newCommand = new Command();
        newCommand.type = CONSTANTS.COMMAND_TYPE.MOVE;
        newCommand.fromStack = stackProps.stack.name;
        newCommand.selectedCards = stackProps.stack.cards;
        setCommand(newCommand);
    }

    const onStackShuffle = (e, stackProps)=>{
        const stackNameToShuffle = stackProps.stack.name;
        const shuffleCommand = new Command();
        shuffleCommand.type = CONSTANTS.COMMAND_TYPE.SHUFFLE;
        shuffleCommand.fromStack = stackNameToShuffle;

        ws.sendMessageToHost(makeCommandMessage(shuffleCommand));
    }

    const onCardInCardSelectorClicked = (e, clickedCard, stackProps) =>{
        const stack = stackProps.stack;

        if(command?.fromStack === stack.name){ // if it is the same stack
            if(command.selectedCards.some(selectedCard=> selectedCard.equals(clickedCard))){ // card is already selected, remove it
                command.selectedCards = command.selectedCards.filter(selectedCard=>!selectedCard.equals(clickedCard));
                setCommand(Command.fromJson(command)); // And update our command, Command.fromJson is to make a copy so react knows to update.
            } else { // card isn't selected, add it to the selection
                command.selectedCards.push(clickedCard);
                setCommand(Command.fromJson(command)); // And update our command, Command.fromJson is to make a copy so react knows to update.
            }
        } else { // if we are pulling from a different stack
            const newCommand = new Command();
            newCommand.type = CONSTANTS.COMMAND_TYPE.MOVE; // Declare that it will be a move command.
            newCommand.fromStack = stack.name; // Set the stack to the one the card exists
            newCommand.selectedCards.push(clickedCard); // And clicked card.
            setCommand(Command.fromJson(newCommand)); // And update our command, Command.fromJson is to make a copy so react knows to update.
        }
    }
    const basicActions = [
        { displayName: "Shuffle", onClick: onStackShuffle },
        { displayName: "Select All", onClick: selectAllCards}
    ];

    return (
        <div>
            <h1>Fashion Cents</h1>
            <CardSelectorView
                open={cardSelectorOpen}
                setOpen={setCardSelectorOpen}
                stack={cardSelectorStack}
                onCardClick={onCardInCardSelectorClicked}
                cardSizeClass={"fc-card-medium"}
                command={command}
            />
            <div className={"fc-flex-container"}>
                <div>
                    <div className={"fc-flex-container"}>
                        <Stack stack={player1GuyStack}
                               setStack={setPlayer1GuyStack}
                               command={command}
                               setCommand={setCommand}
                               sendCommand={sendCommand}
                               onClick={onStackClick}
                               onRightClick={onStackRightClick}
                               onMouseEnter={onStackMouseEnter}
                               sizeClass={"fc-card-large"}
                               hoverMenuActions={basicActions}
                        />
                        <Stack stack={player1DeckStack}
                               setStack={setPlayer1DeckStack}
                               command={command}
                               setCommand={setCommand}
                               sendCommand={sendCommand}
                               onClick={onStackClick}
                               onRightClick={onStackRightClick}
                               onMouseEnter={onStackMouseEnter}
                               sizeClass={"fc-card-medium"}
                               isFaceUp={false}
                               hoverMenuActions={basicActions}
                        />
                        <Stack stack={player1DiscardStack}
                               setStack={setPlayer1DiscardStack}
                               command={command}
                               setCommand={setCommand}
                               sendCommand={sendCommand}
                               onClick={onStackClick}
                               onRightClick={onStackRightClick}
                               onMouseEnter={onStackMouseEnter}
                               sizeClass={"fc-card-medium"}
                               hoverMenuActions={basicActions}
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
                               onMouseEnter={onStackMouseEnter}
                               sizeClass={"fc-card-large"}
                               hoverMenuActions={basicActions}
                        />
                        <Stack stack={player2DeckStack}
                               setStack={setPlayer2DeckStack}
                               command={command}
                               setCommand={setCommand}
                               sendCommand={sendCommand}
                               onClick={onStackClick}
                               onRightClick={onStackRightClick}
                               onMouseEnter={onStackMouseEnter}
                               sizeClass={"fc-card-medium"}
                               isFaceUp={false}
                               hoverMenuActions={basicActions}
                        />
                        <Stack stack={player2DiscardStack}
                               setStack={setPlayer2DiscardStack}
                               command={command}
                               setCommand={setCommand}
                               sendCommand={sendCommand}
                               onClick={onStackClick}
                               onRightClick={onStackRightClick}
                               onMouseEnter={onStackMouseEnter}
                               sizeClass={"fc-card-medium"}
                               hoverMenuActions={basicActions}
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
                               onMouseEnter={onStackMouseEnter}
                               sizeClass={"fc-card-small"}
                               hoverMenuActions={basicActions}
                        />
                        <Stack setStack={setStore2Stack}
                               stack={store2Stack}
                               command={command}
                               setCommand={setCommand}
                               sendCommand={sendCommand}
                               onClick={onStackClick}
                               onRightClick={onStackRightClick}
                               onMouseEnter={onStackMouseEnter}
                               sizeClass={"fc-card-small"}
                               hoverMenuActions={basicActions}
                        />
                    </div>
                </div>
                <div className={"fc-flex-right-column"}>
                    <Stack
                        stack={stackNameToStack[zoomedStackName]}
                        command={command}
                        isFaceUp={isZoomedStackFaceUp}
                        sizeClass={"fc-card-large"}
                    />
                </div>
            </div>
        </div>
    );
}
