import {
    WebSocketClient,
  } from "https://deno.land/x/websocket@v0.1.3/mod.ts";

export class GameState {
    public wslist: WebSocketClient[] = [];
    constructor(public gameType: string, ws: WebSocketClient) {
        this.wslist.push(ws);
    }

    registerPlayer(ws: WebSocketClient) {
        this.wslist.push(ws);
    }

    get roomFull() {
        return this.wslist.length === 2;
    }
}