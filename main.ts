import {
  WebSocket,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.0.5/mod.ts";
import { IncomingMessage } from "./message.ts";

const wss = new WebSocketServer(8080);
const gameMap = new Map<string, WebSocket[]>();
wss.on("connection", function (ws: WebSocket) {
  let room: string;
  let type: string; // No, move to the gameMap
  ws.on("message", function (str: string) {
    const message: IncomingMessage = JSON.parse(str);
    switch (message.type) {
      case "create":
        room = message.room;
        type = message.gameType;
        if (!gameMap.has(message.room)) {
            gameMap.set(message.room, [ws]);
            ws.send(JSON.stringify({type: 'join', room, gameType: type}));
        } else {
            ws.send(JSON.stringify({type: 'error', error: 'Error while creating room'}));
        }
        break;
        case "join":
            room = message.room;
            if (gameMap.has(message.room) && gameMap.get(message.room)?.length === 1) {
                gameMap.get(message.room)?.push(ws);
                ws.send(JSON.stringify({type: 'join', room, gameType: type}));
            } else {
                ws.send(JSON.stringify({type: 'error', error: 'Error while joining room'}));
            }
            break;
        case "move":
            const otherws = gameMap.get(room)?.find(socket => socket !== ws);
            if (otherws) {
                otherws.send(str);
            }
            break;
    }
  });
  ws.on("close", () => {
    const otherWs = gameMap.get(room)?.find(socket => socket !== ws);
    if (otherWs && !otherWs.isClosed) {
        otherWs.close();
    }
    gameMap.delete(room);
  });
});
