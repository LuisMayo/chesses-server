import { WebSocket } from "https://deno.land/x/websocket@v0.0.5/mod.ts";

export class GameState {
    private wslist: WebSocket[] = [];
    constructor(public gameType: string, ws: WebSocket) {
        this.wslist.push(ws);
    }

    registerPlayer(ws: WebSocket) {
        this.wslist.push(ws);
    }

    get roomFull() {
        return this.wslist.length === 2;
    }
}