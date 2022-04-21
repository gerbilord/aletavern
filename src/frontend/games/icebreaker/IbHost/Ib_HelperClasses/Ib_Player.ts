export default class Player {
    public name: string;
    public id: string;
    constructor(serverPayload:any) {
        const {
            data: { playerName },
            playerId,
        } = serverPayload;

        this.name = playerName;
        this.id = playerId;
    }
}
