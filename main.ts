import {
  WebSocket,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.0.5/mod.ts";
import { Message } from "./message.ts";

const wss = new WebSocketServer(8080);
const gameMap = new Map<string, WebSocket[]>();
wss.on("connection", function (ws: WebSocket) {
  let room: string;
  ws.on("message", function (str: string) {
    const message: Message = JSON.parse(str);
    switch (message.type) {
      case "create":
        if (!gameMap.has(message.payload)) {
            gameMap.get
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
