import HostView from './HostView';
import PlayerView from './PlayerView';

import HostGameEngine from 'Games/fashionCents/HostGameEngine';
import PlayerGameEngine from 'Games/fashionCents/PlayerGameEngine';


export default class fashionCentsWrapper {
    // REQUIRED
    constructor(gameWebSocket, otherArgs) {
        this.ws = gameWebSocket;

        if (this.ws.isHost()){
            this.gameEngine = new HostGameEngine(this.ws);
        } else {
            this.gameEngine = new PlayerGameEngine(this.ws);
        }
    }

    // REQUIRED
    getGlobalGameView() {
        return this.ws.isHost() ? HostView : PlayerView;
    }
}
