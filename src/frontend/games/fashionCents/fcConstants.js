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
        PLAYER1: "player1",
        STORE1: "store1",
    },

    DEFAULT: "default",
});

export default CONSTANTS;
