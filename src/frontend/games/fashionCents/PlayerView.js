import React, { useEffect, useState, useCallback } from 'react';
import Stack from 'Games/fashionCents/StackView';
import StackObject from 'Games/fashionCents/Stack'
import CONSTANTS from 'Games/fashionCents/fcConstants';
import Command from 'Games/fashionCents/Command';
import CardSelectorView from 'Games/fashionCents/CardSelectorView';
import moment from 'moment';


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


    const[guyStack, setGuyStack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.GUYS] = guyStack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.GUYS] = setGuyStack;

    const[sockStack, setSockStack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.SOCKS] = sockStack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.SOCKS] = setSockStack;

    const[sponsorStack, setSponsorStack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.SPONSORS] = sponsorStack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.SPONSORS] = setSponsorStack;

    const[storeStack, setStoreStack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STOREFRONT] = storeStack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STOREFRONT] = setStoreStack;

    const[donationStack, setDonationStack] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.DONATION_BIN] = donationStack;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.DONATION_BIN] = setDonationStack;


// ##########################################################################

    // 1
    const [player1Discard, setPlayer1Discard] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER1_DISCARD] = player1Discard;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1_DISCARD] = setPlayer1Discard;
    const [player1Hand, setPlayer1Hand] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER1_HAND] = player1Hand;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1_HAND] = setPlayer1Hand;
    const [player1Guy, setPlayer1Guy] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER1_GUY] = player1Guy;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1_GUY] = setPlayer1Guy;
    const [player1Deck, setPlayer1Deck] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER1_DECK] = player1Deck;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1_DECK] = setPlayer1Deck;
    const [player1Sponsor, setPlayer1Sponsor] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER1_SPONSOR] = player1Sponsor;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER1_SPONSOR] = setPlayer1Sponsor;

    const [streetVendor1, setStreetVendor1] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_VENDOR1] = streetVendor1;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_VENDOR1] = setStreetVendor1;

    const [streetSpot1, setStreetSpot1] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_SPOT1] = streetSpot1;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_SPOT1] = setStreetSpot1;

    const [storeSpot1, setStoreSpot1] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STORE_SPOT1] = storeSpot1;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STORE_SPOT1] = setStoreSpot1;



    // 2
    const [player2Discard, setPlayer2Discard] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER2_DISCARD] = player2Discard;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER2_DISCARD] = setPlayer2Discard;
    const [player2Hand, setPlayer2Hand] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER2_HAND] = player2Hand;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER2_HAND] = setPlayer2Hand;
    const [player2Guy, setPlayer2Guy] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER2_GUY] = player2Guy;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER2_GUY] = setPlayer2Guy;
    const [player2Deck, setPlayer2Deck] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER2_DECK] = player2Deck;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER2_DECK] = setPlayer2Deck;
    const [player2Sponsor, setPlayer2Sponsor] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER2_SPONSOR] = player2Sponsor;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER2_SPONSOR] = setPlayer2Sponsor;

    const [streetVendor2, setStreetVendor2] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_VENDOR2] = streetVendor2;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_VENDOR2] = setStreetVendor2;

    const [streetSpot2, setStreetSpot2] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_SPOT2] = streetSpot2;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_SPOT2] = setStreetSpot2;

    const [storeSpot2, setStoreSpot2] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STORE_SPOT2] = storeSpot2;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STORE_SPOT2] = setStoreSpot2;

    // 3

    const [player3Discard, setPlayer3Discard] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER3_DISCARD] = player3Discard;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER3_DISCARD] = setPlayer3Discard;
    const [player3Hand, setPlayer3Hand] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER3_HAND] = player3Hand;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER3_HAND] = setPlayer3Hand;
    const [player3Guy, setPlayer3Guy] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER3_GUY] = player3Guy;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER3_GUY] = setPlayer3Guy;
    const [player3Deck, setPlayer3Deck] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER3_DECK] = player3Deck;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER3_DECK] = setPlayer3Deck;
    const [player3Sponsor, setPlayer3Sponsor] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER3_SPONSOR] = player3Sponsor;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER3_SPONSOR] = setPlayer3Sponsor;

    const [streetVendor3, setStreetVendor3] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_VENDOR3] = streetVendor3;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_VENDOR3] = setStreetVendor3;

    const [streetSpot3, setStreetSpot3] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_SPOT3] = streetSpot3;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_SPOT3] = setStreetSpot3;

    const [storeSpot3, setStoreSpot3] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STORE_SPOT3] = storeSpot3;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STORE_SPOT3] = setStoreSpot3;

    // 4

    const [player4Discard, setPlayer4Discard] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER4_DISCARD] = player4Discard;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER4_DISCARD] = setPlayer4Discard;
    const [player4Hand, setPlayer4Hand] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER4_HAND] = player4Hand;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER4_HAND] = setPlayer4Hand;
    const [player4Guy, setPlayer4Guy] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER4_GUY] = player4Guy;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER4_GUY] = setPlayer4Guy;
    const [player4Deck, setPlayer4Deck] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER4_DECK] = player4Deck;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER4_DECK] = setPlayer4Deck;
    const [player4Sponsor, setPlayer4Sponsor] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER4_SPONSOR] = player4Sponsor;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER4_SPONSOR] = setPlayer4Sponsor;

    const [streetVendor4, setStreetVendor4] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_VENDOR4] = streetVendor4;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_VENDOR4] = setStreetVendor4;

    const [streetSpot4, setStreetSpot4] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_SPOT4] = streetSpot4;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_SPOT4] = setStreetSpot4;

    const [storeSpot4, setStoreSpot4] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STORE_SPOT4] = storeSpot4;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STORE_SPOT4] = setStoreSpot4;

    // 5
    const [player5Discard, setPlayer5Discard] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER5_DISCARD] = player5Discard;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER5_DISCARD] = setPlayer5Discard;
    const [player5Hand, setPlayer5Hand] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER5_HAND] = player5Hand;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER5_HAND] = setPlayer5Hand;
    const [player5Guy, setPlayer5Guy] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER5_GUY] = player5Guy;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER5_GUY] = setPlayer5Guy;
    const [player5Deck, setPlayer5Deck] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER5_DECK] = player5Deck;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER5_DECK] = setPlayer5Deck;
    const [player5Sponsor, setPlayer5Sponsor] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER5_SPONSOR] = player5Sponsor;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER5_SPONSOR] = setPlayer5Sponsor;

    const [streetVendor5, setStreetVendor5] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_VENDOR5] = streetVendor5;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_VENDOR5] = setStreetVendor5;

    const [streetSpot5, setStreetSpot5] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_SPOT5] = streetSpot5;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_SPOT5] = setStreetSpot5;

    const [storeSpot5, setStoreSpot5] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STORE_SPOT5] = storeSpot5;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STORE_SPOT5] = setStoreSpot5;

    // 6
    const [player6Discard, setPlayer6Discard] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER6_DISCARD] = player6Discard;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER6_DISCARD] = setPlayer6Discard;
    const [player6Hand, setPlayer6Hand] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER6_HAND] = player6Hand;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER6_HAND] = setPlayer6Hand;
    const [player6Guy, setPlayer6Guy] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER6_GUY] = player6Guy;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER6_GUY] = setPlayer6Guy;
    const [player6Deck, setPlayer6Deck] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER6_DECK] = player6Deck;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER6_DECK] = setPlayer6Deck;
    const [player6Sponsor, setPlayer6Sponsor] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.PLAYER6_SPONSOR] = player6Sponsor;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.PLAYER6_SPONSOR] = setPlayer6Sponsor;


    const [streetVendor6, setStreetVendor6] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_VENDOR6] = streetVendor6;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_VENDOR6] = setStreetVendor6;

    // 7
    const [streetVendor7, setStreetVendor7] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_VENDOR7] = streetVendor7;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_VENDOR7] = setStreetVendor7;

    // 8

    const [streetVendor8, setStreetVendor8] = useState({});
    stackNameToStack[CONSTANTS.STACK_NAMES.STREET_VENDOR8] = streetVendor8;
    stackNameToStackUpdater[CONSTANTS.STACK_NAMES.STREET_VENDOR8] = setStreetVendor8;


    // ########################################################################################
    const [cardSelectorOpen, setCardSelectorOpen] = useState(false);
    const [cardSelectorStack, setCardSelectorStack] = useState({});

    const [command, setCommand] = useState(new Command());

    const [zoomedStackName, setZoomedStackName] = useState(null);
    const [isZoomedStackFaceUp, setIsZoomedStackFaceUp] = useState(true);
    const [zoomedStackLabel, setZoomedStackLabel] = useState("");

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

    const sendCommand = useCallback(() => {
        console.log("SENDING COMMAND");
        console.log(moment.now())
        ws.sendMessageToHost(makeCommandMessage(command));
        setCommand(new Command());
    }, [command]);

    const onStackClick = useCallback((e, stackProps) =>{
        e.stopPropagation();
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
    }, [command]);

    const onStackRightClick = (e, stackProps)=>{
        const stack = stackProps.stack;
        e.preventDefault();
        if(stack.cards.length > 0){
            setCardSelectorStack(stack);
            setCardSelectorOpen(true);
        }
    }

    const onStackMouseEnter = useCallback( (e, stackProps)=>{
        const stack = stackProps.stack;
        const isFaceUp = stackProps.isFaceUp;

        if(stack){
            setZoomedStackName(stack.name);
            setIsZoomedStackFaceUp(isFaceUp);
            setZoomedStackLabel(stackProps.label);
        }
    },[zoomedStackName, zoomedStackLabel, isZoomedStackFaceUp]);

    const selectAllCards = useCallback( (e, stackProps)=>{
        e.stopPropagation();

        const newCommand = new Command();
        newCommand.type = CONSTANTS.COMMAND_TYPE.MOVE;
        newCommand.fromStack = stackProps.stack.name;
        newCommand.selectedCards = stackProps.stack.cards;
        setCommand(newCommand);
    }, [command]);

    const onStackShuffle = (e, stackProps)=>{
        e.stopPropagation();

        const stackNameToShuffle = stackProps.stack.name;
        const shuffleCommand = new Command();
        shuffleCommand.type = CONSTANTS.COMMAND_TYPE.SHUFFLE;
        shuffleCommand.fromStack = stackNameToShuffle;

        ws.sendMessageToHost(makeCommandMessage(shuffleCommand));
    }

    const onCardInCardSelectorClicked = useCallback( (e, clickedCard, stackProps) =>{
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
    }, [command]);

    const basicActions = [
        { displayName: "Shuffle", onClick: onStackShuffle },
        { displayName: "Select All", onClick: selectAllCards}
    ];

    const createBasicStack = (stackName, stackLabel, sizeClass, isFaceUp=true, labelSizeClass="")=>{
        const stack = stackNameToStack[stackName];

        let isClickable = false;
        if(stack?.cards?.length > 0 || (command?.fromStack !== stack?.name && command?.selectedCards.length > 0)){
            isClickable = true;
        }
        const isSelected = stack?.isAnyCardInStack?.(command?.selectedCards) || false;

        return (
            <Stack
                stack={stackNameToStack[stackName]}
                label={stackLabel}
                isFaceUp={isFaceUp}
                onClick={onStackClick}
                onRightClick={onStackRightClick}
                onMouseEnter={onStackMouseEnter}
                hoverMenuActions={basicActions}
                sizeClass={sizeClass}
                labelSizeClass={labelSizeClass}
                isClickable={isClickable}
                isSelected={isSelected}
            />
        );
    };

    return (
        <div
            onClick={()=>setCommand(new Command())}
        >
            <CardSelectorView
                open={cardSelectorOpen}
                setOpen={setCardSelectorOpen}
                stack={cardSelectorStack}
                onCardClick={onCardInCardSelectorClicked}
                command={command}
            />
            <div className={"fc-flex-container fc-background-image-div"}>
                <div>
                    <div className={"fc-flex-container"}>
                        <div className={"fc-flex-container"}>
                            {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER1_GUY, "", "fc-card-player-large")}
                            <div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER1_HAND, "HAND", "fc-card-player-small", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER1_DECK, "DECK", "fc-card-player-small", false)}
                                </div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER1_DISCARD, "DISCARD", "fc-card-player-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER1_SPONSOR, "SPONSOR", "fc-card-player-small")}
                                </div>
                            </div>
                        </div>
                        <div className={"fc-flex-container"}>
                            {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER2_GUY, "", "fc-card-player-large")}
                            <div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER2_HAND, "HAND","fc-card-player-small", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER2_DECK, "DECK", "fc-card-player-small", false)}
                                </div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER2_DISCARD, "DISCARD", "fc-card-player-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER2_SPONSOR, "SPONSOR", "fc-card-player-small")}
                                </div>
                            </div>
                        </div>
                        <div className={"fc-flex-container"}>
                            {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER3_GUY, "", "fc-card-player-large")}
                            <div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER3_HAND, "HAND", "fc-card-player-small", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER3_DECK, "DECK", "fc-card-player-small", false)}
                                </div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER3_DISCARD, "DISCARD", "fc-card-player-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER3_SPONSOR, "SPONSOR", "fc-card-player-small")}
                                </div>
                            </div>
                        </div>
                        <div className={"fc-flex-container"}>
                            {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER4_GUY, "", "fc-card-player-large")}
                            <div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER4_HAND, "HAND", "fc-card-player-small", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER4_DECK, "DECK", "fc-card-player-small", false)}
                                </div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER4_DISCARD, "DISCARD", "fc-card-player-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER4_SPONSOR, "SPONSOR", "fc-card-player-small")}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"fc-flex-container fc-div-max-width-screen"}>
                        <div className={"fc-flex-container"}>
                            {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER5_GUY, "", "fc-card-player-large")}
                            <div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER5_HAND, "HAND", "fc-card-player-small", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER5_DECK, "DECK", "fc-card-player-small", false)}
                                </div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER5_DISCARD, "DISCARD", "fc-card-player-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER5_SPONSOR, "SPONSOR", "fc-card-player-small")}
                                </div>
                            </div>
                        </div>
                        <div className={"fc-flex-container"}>
                            {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER6_GUY, "", "fc-card-player-large")}
                            <div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER6_HAND, "HAND", "fc-card-player-small", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER6_DECK, "DECK", "fc-card-player-small", false)}
                                </div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER6_DISCARD, "DISCARD", "fc-card-player-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.PLAYER6_SPONSOR, "SPONSOR", "fc-card-player-small")}
                                </div>
                            </div>
                        </div>
                        <div className={"fc-flex-container"}>
                            <div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STOREFRONT, "STOREFRONT", "fc-card-small", false, "fc-card-tiny-text")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STORE_SPOT1, "STORE", "fc-card-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STORE_SPOT2, "STORE", "fc-card-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STORE_SPOT3, "STORE", "fc-card-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STORE_SPOT4, "STORE", "fc-card-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STORE_SPOT5, "STORE", "fc-card-small")}
                                </div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.DONATION_BIN, "DONATION", "fc-card-small", true, "fc-card-tiny-text")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_SPOT1, "STREET", "fc-card-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_SPOT2,"STREET", "fc-card-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_SPOT3,"STREET", "fc-card-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_SPOT4,"STREET", "fc-card-small")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_SPOT5,"STREET", "fc-card-small")}
                                </div>
                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.GUYS, "GUYS", "fc-card-tiny", false, "fc-card-tiny-text")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.SOCKS, "SOCKS", "fc-card-tiny", false, "fc-card-tiny-text")}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.SPONSORS, "SPONSORS", "fc-card-tiny", false, "fc-card-tiny-text")}
                                </div>

                                <div className={"fc-flex-container"}>
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_VENDOR1, "", "fc-card-tiny", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_VENDOR2, "", "fc-card-tiny", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_VENDOR3, "", "fc-card-tiny", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_VENDOR4, "", "fc-card-tiny", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_VENDOR5, "", "fc-card-tiny", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_VENDOR6, "", "fc-card-tiny", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_VENDOR7, "", "fc-card-tiny", false)}
                                    {createBasicStack(CONSTANTS.STACK_NAMES.STREET_VENDOR8, "", "fc-card-tiny", false)}
                                </div>
                            </div>
                            <div className={"fc-flex-right-column"}>
                                <Stack
                                    stack={stackNameToStack[zoomedStackName]}
                                    label={zoomedStackLabel}
                                    command={command}
                                    isFaceUp={isZoomedStackFaceUp}
                                    sizeClass={"fc-card-huge"}
                                    otherClass={"fc-no-select"}
                                    isClickable={false}
                                    isSelected={stackNameToStack[zoomedStackName]?.isAnyCardInStack?.(command.selectedCards) || false}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
