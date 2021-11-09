export default class Player {
    constructor(serverPayload) {
        const {
            data: { playerName },
            playerId,
        } = serverPayload;

        this.name = playerName;
        this.id = playerId;
    }
}
