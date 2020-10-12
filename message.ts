export interface IncomingMessage {
    type: 'create' | 'join' | 'move';
    payload: 'string';
}

export interface OutgoingMessage {
    type: 'join' | 'move' | 'error';
    payload: 'string';
}