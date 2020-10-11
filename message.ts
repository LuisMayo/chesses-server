export interface Message {
    type: 'create' | 'join' | 'move';
    payload: 'string';
}