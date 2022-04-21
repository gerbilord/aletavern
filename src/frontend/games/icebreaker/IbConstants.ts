class CONSTANTS {
    public static readonly MIN_PLAYERS = 2;
    public static readonly MESSAGE_TYPE_KEY = 'MESSAGE_TYPE';
    public static readonly MESSAGE_TYPE= {
        START_ROUND: 'STARTROUND',
        END_ROUND: 'ENDROUND',
        ROUND_INSTRUCTIONS: 'ROUNDINSTRUCTIONS',
    } as const;

    public static readonly ROUND_KEY = 'ROUND';
    public static readonly ROUNDS = {
        LOBBY: 'LOBBY',
        HOST_ASKS_TEXT_PROMPT_TO_ALL: 'HOSTASKTEXTPROMPTTOALL',
        HOST_ASKS_RANK_PROMPT_TO_ALL: 'HOSTASKSRANKPROMPTTOALL',
        HOST_ASKS_MULTIPLE_CHOICE_PROMPT_TO_ALL: 'HOSTASKSMULTIPLECHOICEPROMPTTOALL',
        HOST_ASKS_MATCHING_PROMPT_TO_ALL: 'HOSTASKSMATCHINGPROMPTTOALL',
        HOST_SENDS_READ_ONLY_TEXT_TO_ALL: 'HOSTSENDSREADONLYTEXTTOALL',
        HOST_NEVER_HAVE_I_EVER_GAME: "HOSTNEVERHAVEIVEVERGAME",
        PROMPT: 'PROMPT',
    } as const;

    public static readonly PROMPT_TYPE = {
        TEXT: "TEXT",
        RANK: "RANK",
        MULTIPLE_CHOICE: "MULTIPLECHOICE",
        MATCHING:'MATCHING',
        READ_ONLY_TEXT:'READONLYTEXT',
    } as const;

    public static readonly DATA_KEY = 'DATA';

    public static readonly TIME = {
        TO_ANSWER_PROMPT: 20000,
        TO_ANSWER_QUIZ: 10000,
    } as const;
}

export default CONSTANTS;
