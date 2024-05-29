// index.ts
import * as WebSocket from 'ws';
import GameManager from './GameManager';

const wss = new WebSocket.Server({ port: 8080 });
const gameManager = new GameManager();

wss.on('connection', (ws: WebSocket) => {
    gameManager.addPlayer(ws);

    ws.on('message', (message: string) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'start') {
                gameManager.handleStart(ws);
            } else if (data.type === 'move') {
                // Implement move handling if needed
                gameManager.handleMove(ws, data.move);
            } else if (data.type === 'end') {
                gameManager.handleEnd(ws);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        gameManager.removePlayer(ws);
    });
});
