import Card from 'Games/fashionCents/Card';
import Stack from 'Games/fashionCents/Stack';

import * as listUtils from 'Utils/listUtils';

import CONSTANTS from 'Games/fashionCents/fcConstants';
import Command from 'Games/fashionCents/Command';

export default class HostGameEngine {
    constructor(ws) {
        this.ws = ws;
        this.players = [];
        this.listenForPlayers();

        this.logs = [];
        this.stacks = {};
        this.totalCards = 0;
        this.setupStacks();
    }

    listenForPlayers() {
        const onPlayerConnect = (serverResponse) =>{
            const player = {};
            player.name = serverResponse.data.playerName;
            player.id = serverResponse.playerId;
            this.players.push(player);
            this.updatePlayerStacks();
        };

        this.ws.onOtherJoinGame.push(onPlayerConnect);
        this.ws.onOtherReconnectGame.push(onPlayerConnect);
    }

    updatePlayerStacks(stacksToUpdate=[]) {
        const message = {};
        message[CONSTANTS.MESSAGE_TYPE_KEY] = CONSTANTS.MESSAGE_TYPE.UPDATE_STACKS;
        message[CONSTANTS.STACKS] = this.stacks;
        message[CONSTANTS.STACKS_TO_UPDATE] = stacksToUpdate;

        this.ws.sendMessageToAllOthers(message);
    }

    setLogUpdater(updateLogs){
        this.updateLogs = updateLogs;
    }

    log(logItem){
        this.logs.push(logItem);
        this.updateLogs(this.logs);
    }

    setStackList (stackList){
        this.stackList = stackList;
    }

    setupStacks(){
        fetch('FashionCents/directory_details.json')
            .then((response)=>response.json())
            .then((jsonData)=>this.setStackList(jsonData))
            .then(()=>{this.getAllStacks()});
    }

    getAllStacks() {
        // stack path, then stack name
        this.getStack("./FashionCents/Cards/player1/guy/card_details.json", CONSTANTS.STACK_NAMES.PLAYER1_GUY);
        this.getStack("./FashionCents/Cards/player2/guy/card_details.json", CONSTANTS.STACK_NAMES.PLAYER2_GUY);
        this.getStack("./FashionCents/Cards/player1/deck/card_details.json", CONSTANTS.STACK_NAMES.PLAYER1_DECK);
        this.getStack("./FashionCents/Cards/player2/deck/card_details.json", CONSTANTS.STACK_NAMES.PLAYER2_DECK);
        this.getStack("./FashionCents/Cards/store1/card_details.json", CONSTANTS.STACK_NAMES.STORE1);
        this.getStack("./FashionCents/Cards/store2/card_details.json", CONSTANTS.STACK_NAMES.STORE2, true);
    }


    getStack(stackPath, stackName, doneAfter=false){
        fetch(stackPath)
            .then((response)=>response.json())
            .then((jsonData)=>this.setupStack(jsonData, stackName))
            .then(()=>{if(doneAfter){this.startGame()}});
    }

    setupStack(stackData, stackName){
        this.stacks[stackName] = new Stack();

        this.stacks[stackName].name = stackName;

        const defaultData = stackData.filter(card => card.location === CONSTANTS.DEFAULT)[0];
        const defaultCount = defaultData.count;

        const cardData = stackData.filter(card => card.location !== CONSTANTS.DEFAULT);

        for(let i = 0; i < cardData.length; i++){
            const cardCount = cardData[i].count == null ? defaultCount : cardData[i].count;

            for(let j = 0; j < cardCount; j++){
                this.stacks[stackName].cards.push(this.createCard(cardData[i]));
            }
        }
    }

    setupEmptyStack(stackName){
        this.stacks[stackName] = new Stack();
        this.stacks[stackName].name = stackName;
    }

    createCard(cardData){
        const cardId = this.totalCards;
        this.totalCards++;
        return new Card(cardId,cardData.location, "./FashionCents/Cards/cardBacks/FC_Cards_Wardrobe_Purple small.png") // TODO Make card back dynamic
    }

    startGame(){
        this.log("Json Data loaded.");

        this.log("Running specific game logic");
        this.setupGame();

        this.log("Syncing player stacks.")
        this.updatePlayerStacks();

        this.log("Listening for commands");
        this.listenForCommands();

    }

    setupGame(){
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER1_DISCARD);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER2_DISCARD);
    }

    listenForCommands() {
        const onCommand = (serverResponse) =>{
            const data = serverResponse.data;
            if(data[CONSTANTS.MESSAGE_TYPE_KEY] === CONSTANTS.MESSAGE_TYPE.COMMAND){
                this.executeCommand(data[CONSTANTS.COMMAND]);
            }
        };

        this.ws.onMessageGame.push(onCommand);
    }

    executeCommand(jsonCommand){
        const command = Command.fromJson(jsonCommand);
        this.log("Executing: " + command.toString());

        if(command.type === CONSTANTS.COMMAND_TYPE.MOVE){
            this.executeMoveCommand(command);
        } else {
            this.log("" + command.type +" unknown");
        }
    }

    executeMoveCommand(command){
        const fromStack = this.stacks[command.fromStack];
        const toStack = this.stacks[command.toStack];
        const cardsToMove = command.selectedCards;

        if(fromStack!=null && toStack!=null && cardsToMove?.length > 0){
            this.addCardsToList(
                this.removeCardsFromList(cardsToMove, fromStack.cards),
                toStack.cards);
            this.updatePlayerStacks([fromStack.name, toStack.name]);
        } else {
            this.log("Move command failed. Missing argument.");
        }
    }

    // In place removes any card in cardsToRemove from listToRemoveFrom.
    // Returns list of all removed cards.
    removeCardsFromList(cardsToRemove, listToRemoveFrom){
        const removedCards = [];

        const originalListSize = listToRemoveFrom.length;
        const expectedListSize = originalListSize - cardsToRemove.length;
        const expectedAmountOfRemovals = cardsToRemove.length;

        cardsToRemove.forEach(cardToRemove=>{
                const sizeBefore = listToRemoveFrom.length;
                listUtils.filterInPlace(listToRemoveFrom, card=>!cardToRemove.equals(card));
                const sizeAfter = listToRemoveFrom.length;

                if(sizeBefore > sizeAfter){
                    removedCards.push(cardToRemove);
                }
        });

        const actualListSize = listToRemoveFrom.length;
        const actualAmountOfRemovals = originalListSize - actualListSize;

        if(expectedListSize !== actualListSize){
            this.log("Expected to remove " + expectedAmountOfRemovals + ". Actually removed " + actualAmountOfRemovals);
        }

        return removedCards;
    }

    addCardsToList(cardsToAdd, listToAddTo){
        listToAddTo.unshift(...cardsToAdd);
    };
}