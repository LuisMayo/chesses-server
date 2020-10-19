export interface IncomingMessage {
    type: 'create' | 'join' | 'move';
    room: string;
    gameType: string;
    move: {
      from: string;
      to: string;
    };
}

export interface OutgoingMessage {
    type: 'join' | 'move' | 'error';
    room: string;
    gameType: string;
    error: string;
    move: {
      from: string;
      to: string;
    };
}
