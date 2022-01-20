import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import { IncomingMessage } from "./message.ts";
import { GameState } from "./game-state.ts";

const wss = new WebSocketServer(8080);
const gameMap = new Map<string, GameState>();
wss.on("connection", function (ws: WebSocketClient) {
  let room: string;
  let type: string; // No, move to the gameMap
  ws.on("message", function (str: string) {
    const message: IncomingMessage = JSON.parse(str);
    switch (message.type) {
      case "create":
        room = message.room;
        type = message.gameType;
        if (!gameMap.has(message.room)) {
            gameMap.set(message.room, new GameState(message.gameType, ws));
            ws.send(JSON.stringify({type: 'join', room, gameType: type}));
        } else {
            ws.send(JSON.stringify({type: 'error', error: 'Error while creating room'}));
        }
        break;
        case "join":
            room = message.room;
            if (gameMap.has(message.room) && !gameMap.get(message.room)?.roomFull) {
              const savedRoom = gameMap.get(message.room);
                savedRoom?.registerPlayer(ws);
                ws.send(JSON.stringify({type: 'join', room, gameType: savedRoom?.gameType}));
            } else {
                ws.send(JSON.stringify({type: 'error', error: 'Error while joining room'}));
            }
            break;
        case "move":
            const otherws = gameMap.get(room)?.wslist.find(socket => socket !== ws);
            if (otherws) {
                otherws.send(str);
            }
            break;
    }
  });
  ws.on("close", () => {
    const otherWs = gameMap.get(room)?.wslist.find(socket => socket !== ws);
    if (otherWs && !otherWs.isClosed) {
        otherWs.close(0);
    }
    gameMap.delete(room);
  });
});
