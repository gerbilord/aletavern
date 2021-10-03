const baseUrl = window.location;

const CONSTANTS = Object.freeze({
    MESSAGE_TYPE_KEY: 'type',
    MESSAGE_TYPE: {
        UPDATE_STACKS: 'updateStacks',
        COMMAND: 'command',
    },
    STACKS_TO_UPDATE: 'stacksToUpdate',
    BASE_URL: baseUrl,
    STACKS: 'stacks',
    COMMAND: 'command',
    COMMAND_TYPE: {
        MOVE: "move"
    },

    STACK_NAMES: {
        PLAYER1_GUY: "player1_guy",
        PLAYER2_GUY: "player2_guy",

        PLAYER1_DECK: "player1_deck",
        PLAYER2_DECK: "player2_deck",

        PLAYER1_DISCARD: "player1_discard",
        PLAYER2_DISCARD: "player2_discard",

        STORE1: "store1",
        STORE2: "store2",
    },

    DEFAULT: "default",
});

export default CONSTANTS;
