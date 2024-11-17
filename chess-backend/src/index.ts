// index.ts
import * as WebSocket from 'ws';
import GameManager from './GameManager';

const wss: WebSocket.Server = new WebSocket.Server({ port: 8080 });
const gameManager: GameManager = new GameManager();

wss.on('connection', (ws: WebSocket) => {
    console.log('socket connected');
    gameManager.addPlayer(ws);

    ws.on('message', (message: string) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'start') {
                gameManager.handleStart(ws);
            } else if (data.type === 'move') {
                gameManager.handleMove(ws, data.move);
            } else if (data.type === 'end') {
                gameManager.handleEnd(ws);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('socket disconnected');
        gameManager.removePlayer(ws);
    });
});
