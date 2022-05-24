import Card from 'Games/fashionCents/Card';
import Stack from 'Games/fashionCents/Stack';

import * as listUtils from 'Utils/listUtils';

import CONSTANTS from 'Games/fashionCents/fcConstants';
import Command from 'Games/fashionCents/Command';
import moment from 'moment';

export default class HostGameEngine {
    constructor(ws) {
        this.ws = ws;
        this.players = [];
        this.listenForPlayers();

        this.logs = [];
        this.stacks = {};
        this.totalCards = 0;
        this.historicalStacks = [];
        this.MAX_HISTORY = 15;
        this.CURRENT_GAME_KEY = "fc-current-game"
        this.RECOVERY_GAME_KEY = "fc-recovery-game"
        this.movePreviousGameToRecoveryGame();
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
        message[CONSTANTS.STACKS] = this.getStackObjectsToUpdate(stacksToUpdate);
        message[CONSTANTS.STACKS_TO_UPDATE] = stacksToUpdate;

        console.log("SENDING UPDATING STACKS")
        console.log(moment.now())
        this.ws.sendMessageToAllOthers(message);
    }

    getStackObjectsToUpdate(stacksToUpdate){
        if (stacksToUpdate == null || stacksToUpdate.length === 0) {
            return this.stacks;
        }

        let stacksToUpdateNoDuplicates = new Set(stacksToUpdate);

        const stackObjectsToUpdate = {};

        stacksToUpdateNoDuplicates.forEach((stackToUpdate)=>{
            stackObjectsToUpdate[stackToUpdate] = this.stacks[stackToUpdate];
        });

        return stackObjectsToUpdate;
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

    // Fetches the list of directories, sets it for our class, then calls getAllStacks, then setup the rest of the game.
    setupStacks(){
        fetch('FashionCents/directory_details.json')
            .then((response)=>response.json())
            .then((jsonData)=>this.setStackList(jsonData))
            .then(()=>{this.getAllStacks()
                .then(()=>{this.setupGame();}
            )});
    }

    getAllStacks() {
        return Promise.all([
            // stack path, then stack name
            this.getStack("./FashionCents/Cards/P1 Deck/card_details.json", CONSTANTS.STACK_NAMES.PLAYER1_DECK),
            this.getStack("./FashionCents/Cards/P2 Deck/card_details.json", CONSTANTS.STACK_NAMES.PLAYER2_DECK),
            this.getStack("./FashionCents/Cards/P3 Deck/card_details.json", CONSTANTS.STACK_NAMES.PLAYER3_DECK),
            this.getStack("./FashionCents/Cards/P4 Deck/card_details.json", CONSTANTS.STACK_NAMES.PLAYER4_DECK),
            this.getStack("./FashionCents/Cards/P5 Deck/card_details.json", CONSTANTS.STACK_NAMES.PLAYER5_DECK),
            this.getStack("./FashionCents/Cards/P6 Deck/card_details.json", CONSTANTS.STACK_NAMES.PLAYER6_DECK),

            this.getStack("./FashionCents/Cards/Guy Arts/card_details.json", CONSTANTS.STACK_NAMES.GUYS),
            this.getStack("./FashionCents/Cards/Socks/card_details.json", CONSTANTS.STACK_NAMES.SOCKS),
            this.getStack("./FashionCents/Cards/Sponsors (Gold Deck)/card_details.json", CONSTANTS.STACK_NAMES.SPONSORS),
            this.getStack("./FashionCents/Cards/Storefront (Blue Deck)/card_details.json", CONSTANTS.STACK_NAMES.STOREFRONT),

            this.getStack("./FashionCents/Cards/Street Vendor 1/card_details.json", CONSTANTS.STACK_NAMES.STREET_VENDOR1),
            this.getStack("./FashionCents/Cards/Street Vendor 2/card_details.json", CONSTANTS.STACK_NAMES.STREET_VENDOR2),
            this.getStack("./FashionCents/Cards/Street Vendor 3/card_details.json", CONSTANTS.STACK_NAMES.STREET_VENDOR3),
            this.getStack("./FashionCents/Cards/Street Vendor 4/card_details.json", CONSTANTS.STACK_NAMES.STREET_VENDOR4),
            this.getStack("./FashionCents/Cards/Street Vendor 5/card_details.json", CONSTANTS.STACK_NAMES.STREET_VENDOR5),
            this.getStack("./FashionCents/Cards/Street Vendor 6/card_details.json", CONSTANTS.STACK_NAMES.STREET_VENDOR6),
            this.getStack("./FashionCents/Cards/Street Vendor 7/card_details.json", CONSTANTS.STACK_NAMES.STREET_VENDOR7),
            this.getStack("./FashionCents/Cards/Street Vendor 8/card_details.json", CONSTANTS.STACK_NAMES.STREET_VENDOR8)
            ]
        ).then((allStacks)=>this.createAllStacks(allStacks));

    }

    getStack(stackPath, stackName){
        return fetch(stackPath).then((response)=>response.json())
            .then((jsonData)=>{return {stack: jsonData, stackName: stackName}});
    }

    createAllStacks(allStacks){
        allStacks.forEach(
            ({stack, stackName})=>{
                this.createStack(stack, stackName);
            }
        );
    }

    createStack(stackData, stackName){
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

    createCard(cardData){
        const cardId = this.totalCards;
        this.totalCards++;
        return new Card(cardId,cardData.location, "./FashionCents/Cards/Wardrobes and Storefront Top/FC_Cards_Wardrobe_Purple small.png") // TODO Make card back dynamic
    }

    setupGame(){
        this.log("Json Data loaded.");

        this.setupEmptyStacks();

        this.runSetupGameLogic();

        this.updateStackHistory(this.stacks);

        this.log("Syncing player stacks.")
        this.updatePlayerStacks();

        this.log("Listening for commands");
        this.listenForCommands();

    }

    setupEmptyStacks(){
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER1_DISCARD);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER2_DISCARD);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER3_DISCARD);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER4_DISCARD);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER5_DISCARD);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER6_DISCARD);

        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER1_SPONSOR);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER2_SPONSOR);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER3_SPONSOR);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER4_SPONSOR);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER5_SPONSOR);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER6_SPONSOR);

        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER1_HAND);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER2_HAND);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER3_HAND);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER4_HAND);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER5_HAND);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER6_HAND);

        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER1_GUY);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER2_GUY);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER3_GUY);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER4_GUY);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER5_GUY);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.PLAYER6_GUY);

        this.setupEmptyStack(CONSTANTS.STACK_NAMES.STORE_SPOT1);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.STORE_SPOT2);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.STORE_SPOT3);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.STORE_SPOT4);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.STORE_SPOT5);

        this.setupEmptyStack(CONSTANTS.STACK_NAMES.STREET_SPOT1);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.STREET_SPOT2);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.STREET_SPOT3);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.STREET_SPOT4);
        this.setupEmptyStack(CONSTANTS.STACK_NAMES.STREET_SPOT5);

        this.setupEmptyStack(CONSTANTS.STACK_NAMES.DONATION_BIN);
    }

    setupEmptyStack(stackName){
        this.stacks[stackName] = new Stack();
        this.stacks[stackName].name = stackName;
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
        const stacksToUpdate = [];
        this.log("Executing: " + command.toString());

        if(command.type === CONSTANTS.COMMAND_TYPE.MOVE){
            stacksToUpdate.push(...this.executeMoveCommand(command));
        } else if (command.type === CONSTANTS.COMMAND_TYPE.SHUFFLE){
            stacksToUpdate.push(...this.executeShuffleCommand(command));
        } else {
            this.log("Command type: '" + command.type + "' is unknown");
        }

        stacksToUpdate.push(...this.runPostCommandGameLogic());
        this.updateStackHistory();
        this.updateLocalStorageGame();

        if(stacksToUpdate.length > 0){
            this.updatePlayerStacks(stacksToUpdate);
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
            return [fromStack.name, toStack.name];
        } else {
            this.log("Move command failed. Missing argument.");
        }
        return [];
    }


    executeShuffleCommand(command){
        const stackToShuffle = this.stacks[command.fromStack];
        if(stackToShuffle!=null){
            listUtils.shuffleList(stackToShuffle.cards);
            return [stackToShuffle.name];
        }
        return [];
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

    exportGameToJson(){
        this.log("Exporting game to clipboard");
        return JSON.stringify(this.stacks);
    }

    importGameFromJson(jsonStacks){
        let importedStacks = JSON.parse(jsonStacks);

        // Save current game in case importing goes poorly
        localStorage.setItem(this.RECOVERY_GAME_KEY, localStorage.getItem(this.CURRENT_GAME_KEY));

        this.replaceCurrentStacks(importedStacks);
        localStorage.setItem(this.CURRENT_GAME_KEY, jsonStacks);

        this.log("Successfully imported game");
        this.updatePlayerStacks();
    }

    addCardsToList(cardsToAdd, listToAddTo){
        listToAddTo.unshift(...cardsToAdd);
    };

    movePreviousGameToRecoveryGame() {
        // When we closed the browser last time, we kept that game in "CURRENT_GAME_KEY".
        // We need to save it before we start using "CURRENT_GAME_KEY" for our new game.
        localStorage.setItem(this.RECOVERY_GAME_KEY, localStorage.getItem(this.CURRENT_GAME_KEY));
    }

    attemptRecovery(){
        let recoveryStacks = localStorage.getItem(this.RECOVERY_GAME_KEY);

        if(recoveryStacks){
            this.importGameFromJson(recoveryStacks)
        }
    }

    updateLocalStorageGame() {
        localStorage.setItem(this.CURRENT_GAME_KEY, JSON.stringify(this.stacks));
    }

    updateStackHistory() {
        this.historicalStacks.push(JSON.stringify(this.stacks))
        if(this.historicalStacks.length > this.MAX_HISTORY){
            this.historicalStacks.shift();
        }
    }

    undoCommand(){
        this.historicalStacks.pop(); // Top of the stack is current.
        if(this.historicalStacks.length > 0){
            this.stacks = JSON.parse(this.historicalStacks[this.historicalStacks.length - 1]);
            this.log("Undid last move. Amount of history remaining: " + this.historicalStacks.length);
            this.updatePlayerStacks();
        }
    }

    replaceCurrentStacks(newStacks){
        this.stacks = newStacks;
        this.updateStackHistory();
    }

    runSetupGameLogic() {
        this.log("Running specific game logic");

        this.executeShuffleCommand(Command.fromJson({fromStack:CONSTANTS.STACK_NAMES.STOREFRONT}));
        this.dealPlayerCards();
        this.dealSocksToPlayers();
        this.dealPlayerHands();
        this.runPostCommandGameLogic();
    }

    runPostCommandGameLogic() {
        let stacksToUpdate = [];
        stacksToUpdate.push(...this.updateStores());
        return stacksToUpdate;
    }

    updateStores(){
        let stacksToUpdate = [];
        stacksToUpdate.push(...this.addCardToStoreIfEmpty());
        return stacksToUpdate;
    }

    addCardToStoreIfEmpty(){
        let stacksToUpdate = [];

        // Consider doing this with execute move command
        let updateStoreFront = (toStack)=>{
            if(this.stacks[CONSTANTS.STACK_NAMES.STOREFRONT].cards.length > 0 && toStack.cards.length === 0){
                return this.moveTopCardFromStackToStack(this.stacks[CONSTANTS.STACK_NAMES.STOREFRONT], toStack);
            }
            return [];
        }

        stacksToUpdate.push(...updateStoreFront(this.stacks[CONSTANTS.STACK_NAMES.STORE_SPOT1]));
        stacksToUpdate.push(...updateStoreFront(this.stacks[CONSTANTS.STACK_NAMES.STORE_SPOT2]));
        stacksToUpdate.push(...updateStoreFront(this.stacks[CONSTANTS.STACK_NAMES.STORE_SPOT3]));
        stacksToUpdate.push(...updateStoreFront(this.stacks[CONSTANTS.STACK_NAMES.STORE_SPOT4]));
        stacksToUpdate.push(...updateStoreFront(this.stacks[CONSTANTS.STACK_NAMES.STORE_SPOT5]));

        return stacksToUpdate;
    }

    dealPlayerCards() {
        this.executeShuffleCommand(Command.fromJson({fromStack:CONSTANTS.STACK_NAMES.GUYS}));
        this.moveTopCardFromStackToStack(this.stacks[CONSTANTS.STACK_NAMES.GUYS], this.stacks[CONSTANTS.STACK_NAMES.PLAYER1_GUY]);
        this.moveTopCardFromStackToStack(this.stacks[CONSTANTS.STACK_NAMES.GUYS], this.stacks[CONSTANTS.STACK_NAMES.PLAYER2_GUY]);
        this.moveTopCardFromStackToStack(this.stacks[CONSTANTS.STACK_NAMES.GUYS], this.stacks[CONSTANTS.STACK_NAMES.PLAYER3_GUY]);
        this.moveTopCardFromStackToStack(this.stacks[CONSTANTS.STACK_NAMES.GUYS], this.stacks[CONSTANTS.STACK_NAMES.PLAYER4_GUY]);
        this.moveTopCardFromStackToStack(this.stacks[CONSTANTS.STACK_NAMES.GUYS], this.stacks[CONSTANTS.STACK_NAMES.PLAYER5_GUY]);
        this.moveTopCardFromStackToStack(this.stacks[CONSTANTS.STACK_NAMES.GUYS], this.stacks[CONSTANTS.STACK_NAMES.PLAYER6_GUY]);
    }

    moveTopCardFromStackToStack(fromStack, toStack){
        let cardsToMove = [Card.fromJson(fromStack.cards[0])];

        this.addCardsToList(
            this.removeCardsFromList(cardsToMove, fromStack.cards),
            toStack.cards);
        return [fromStack.name, toStack.name];
    }

    moveNTopCardsFromStackToStack(nCards, fromStack, toStack){
        for(let i = 0; i < nCards; i++){
            this.moveTopCardFromStackToStack(fromStack, toStack);
        }
    }

    dealSocksToPlayers() {
        let fromStack = this.stacks[CONSTANTS.STACK_NAMES.SOCKS];
        this.moveNTopCardsFromStackToStack(8, fromStack, this.stacks[CONSTANTS.STACK_NAMES.PLAYER1_DECK]);
        this.moveNTopCardsFromStackToStack(8, fromStack, this.stacks[CONSTANTS.STACK_NAMES.PLAYER2_DECK]);
        this.moveNTopCardsFromStackToStack(8, fromStack, this.stacks[CONSTANTS.STACK_NAMES.PLAYER3_DECK]);
        this.moveNTopCardsFromStackToStack(8, fromStack, this.stacks[CONSTANTS.STACK_NAMES.PLAYER4_DECK]);
        this.moveNTopCardsFromStackToStack(8, fromStack, this.stacks[CONSTANTS.STACK_NAMES.PLAYER5_DECK]);
        this.moveNTopCardsFromStackToStack(8, fromStack, this.stacks[CONSTANTS.STACK_NAMES.PLAYER6_DECK]);

    }

    dealPlayerHands() {
        this.executeShuffleCommand(Command.fromJson({fromStack:CONSTANTS.STACK_NAMES.PLAYER1_DECK}));
        this.executeShuffleCommand(Command.fromJson({fromStack:CONSTANTS.STACK_NAMES.PLAYER2_DECK}));
        this.executeShuffleCommand(Command.fromJson({fromStack:CONSTANTS.STACK_NAMES.PLAYER3_DECK}));
        this.executeShuffleCommand(Command.fromJson({fromStack:CONSTANTS.STACK_NAMES.PLAYER4_DECK}));
        this.executeShuffleCommand(Command.fromJson({fromStack:CONSTANTS.STACK_NAMES.PLAYER5_DECK}));
        this.executeShuffleCommand(Command.fromJson({fromStack:CONSTANTS.STACK_NAMES.PLAYER6_DECK}));

        this.moveNTopCardsFromStackToStack(5, this.stacks[CONSTANTS.STACK_NAMES.PLAYER1_DECK], this.stacks[CONSTANTS.STACK_NAMES.PLAYER1_HAND]);
        this.moveNTopCardsFromStackToStack(5, this.stacks[CONSTANTS.STACK_NAMES.PLAYER2_DECK], this.stacks[CONSTANTS.STACK_NAMES.PLAYER2_HAND]);
        this.moveNTopCardsFromStackToStack(5, this.stacks[CONSTANTS.STACK_NAMES.PLAYER3_DECK], this.stacks[CONSTANTS.STACK_NAMES.PLAYER3_HAND]);
        this.moveNTopCardsFromStackToStack(5, this.stacks[CONSTANTS.STACK_NAMES.PLAYER4_DECK], this.stacks[CONSTANTS.STACK_NAMES.PLAYER4_HAND]);
        this.moveNTopCardsFromStackToStack(5, this.stacks[CONSTANTS.STACK_NAMES.PLAYER5_DECK], this.stacks[CONSTANTS.STACK_NAMES.PLAYER5_HAND]);
        this.moveNTopCardsFromStackToStack(5, this.stacks[CONSTANTS.STACK_NAMES.PLAYER6_DECK], this.stacks[CONSTANTS.STACK_NAMES.PLAYER6_HAND]);
    }
}