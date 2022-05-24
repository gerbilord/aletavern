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
        MOVE: "move",
        SHUFFLE: "shuffle"
    },

    STACK_NAMES: {
        PLAYER1_GUY: "player1_guy",
        PLAYER2_GUY: "player2_guy",
        PLAYER3_GUY: "player3_guy",
        PLAYER4_GUY: "player4_guy",
        PLAYER5_GUY: "player5_guy",
        PLAYER6_GUY: "player6_guy",

        PLAYER1_DECK: "player1_deck",
        PLAYER2_DECK: "player2_deck",
        PLAYER3_DECK: "player3_deck",
        PLAYER4_DECK: "player4_deck",
        PLAYER5_DECK: "player5_deck",
        PLAYER6_DECK: "player6_deck",

        PLAYER1_HAND: "player1_hand",
        PLAYER2_HAND: "player2_hand",
        PLAYER3_HAND: "player3_hand",
        PLAYER4_HAND: "player4_hand",
        PLAYER5_HAND: "player5_hand",
        PLAYER6_HAND: "player6_hand",

        PLAYER1_DISCARD: "player1_discard",
        PLAYER2_DISCARD: "player2_discard",
        PLAYER3_DISCARD: "player3_discard",
        PLAYER4_DISCARD: "player4_discard",
        PLAYER5_DISCARD: "player5_discard",
        PLAYER6_DISCARD: "player6_discard",

        PLAYER1_SPONSOR: "player1_sponsor",
        PLAYER2_SPONSOR: "player2_sponsor",
        PLAYER3_SPONSOR: "player3_sponsor",
        PLAYER4_SPONSOR: "player4_sponsor",
        PLAYER5_SPONSOR: "player5_sponsor",
        PLAYER6_SPONSOR: "player6_sponsor",

        STREET_VENDOR1: "street_vendor1",
        STREET_VENDOR2: "street_vendor2",
        STREET_VENDOR3: "street_vendor3",
        STREET_VENDOR4: "street_vendor4",
        STREET_VENDOR5: "street_vendor5",
        STREET_VENDOR6: "street_vendor6",
        STREET_VENDOR7: "street_vendor7",
        STREET_VENDOR8: "street_vendor8",

        STORE_SPOT1: "store_spot1",
        STORE_SPOT2: "store_spot2",
        STORE_SPOT3: "store_spot3",
        STORE_SPOT4: "store_spot4",
        STORE_SPOT5: "store_spot5",

        STREET_SPOT1: "street_spot1",
        STREET_SPOT2: "street_spot2",
        STREET_SPOT3: "street_spot3",
        STREET_SPOT4: "street_spot4",
        STREET_SPOT5: "street_spot5",

        EXTRA_SPOT1: "extra_spot1",
        EXTRA_SPOT2: "extra_spot2",
        EXTRA_SPOT3: "extra_spot3",
        EXTRA_SPOT4: "extra_spot4",
        EXTRA_SPOT5: "extra_spot5",
        EXTRA_SPOT6: "extra_spot6",
        EXTRA_SPOT7: "extra_spot7",
        EXTRA_SPOT8: "extra_spot8",

        GUYS: "guys",
        SOCKS: "socks",
        SPONSORS: "sponsors",
        STOREFRONT:"storefront",
        DONATION_BIN:"donation_bin",
    },

    DEFAULT: "default",
});

export default CONSTANTS;
