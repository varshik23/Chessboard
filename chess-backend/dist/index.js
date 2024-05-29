"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const WebSocket = __importStar(require("ws"));
const GameManager_1 = __importDefault(require("./GameManager"));
const wss = new WebSocket.Server({ port: 8080 });
const gameManager = new GameManager_1.default();
wss.on('connection', (ws) => {
    gameManager.addPlayer(ws);
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'start') {
                gameManager.handleStart(ws);
            }
            else if (data.type === 'move') {
                // Implement move handling if needed
                gameManager.handleMove(ws, data.move);
            }
            else if (data.type === 'end') {
                gameManager.handleEnd(ws);
            }
        }
        catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    ws.on('close', () => {
        gameManager.removePlayer(ws);
    });
});
