"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerState;
(function (PlayerState) {
    PlayerState["IDLE"] = "idle";
    PlayerState["WAITING"] = "waiting";
    PlayerState["IN_GAME"] = "in_game";
})(PlayerState || (PlayerState = {}));
class GameManager {
    constructor() {
        this.players = [];
        this.games = [];
    }
    addPlayer(socket) {
        this.players.push({ socket, state: PlayerState.IDLE });
    }
    handleStart(socket) {
        const currentPlayer = this.players.find(player => player.socket === socket);
        if (!currentPlayer || currentPlayer.state !== PlayerState.IDLE)
            return;
        const waitingPlayer = this.players.find(player => player.state === PlayerState.WAITING);
        console.log(waitingPlayer);
        if (waitingPlayer !== undefined) {
            this.startGame(currentPlayer.socket, waitingPlayer.socket);
        }
        else {
            currentPlayer.state = PlayerState.WAITING;
        }
    }
    handleMove(socket, move) {
        const game = this.findGame(socket);
        if (!game || game.state !== 'in_progress')
            return;
        game.moves.push(move);
        this.sendGameUpdate(game, socket);
    }
    removePlayer(socket) {
        const index = this.players.findIndex(player => player.socket === socket);
        if (index !== -1) {
            this.players.splice(index, 1);
            const game = this.findGame(socket);
            if (game) {
                game.state = 'ended'; // Game ends if a player disconnects
                this.sendGameUpdate(game);
            }
        }
    }
    startGame(player1Socket, player2Socket) {
        const player1Color = 'white';
        const player2Color = 'black';
        const newGame = {
            player1: { socket: player1Socket, color: player1Color },
            player2: { socket: player2Socket, color: player2Color },
            moves: [],
            state: 'in_progress',
        };
        this.games.push(newGame);
        // Set player states to in_game
        this.setPlayerState(player1Socket, PlayerState.IN_GAME);
        this.setPlayerState(player2Socket, PlayerState.IN_GAME);
        // Send initial game state to both players
        this.sendGameUpdate(newGame);
    }
    setPlayerState(socket, state) {
        const player = this.players.find(p => p.socket === socket);
        if (player) {
            player.state = state;
        }
    }
    findGame(socket) {
        return this.games.find(game => game.player1.socket === socket || game.player2.socket === socket);
    }
    sendGameUpdate(game, socket) {
        console.log(game, "Sending game update");
        const gameState = {
            playerColor: game.player1.socket === socket ? game.player1.color : game.player2.color,
            moves: game.moves,
            state: game.state,
        };
        const jsonGameState = JSON.stringify(gameState);
        game.player1.socket.send(jsonGameState);
        game.player2.socket.send(jsonGameState);
    }
    handleEnd(socket) {
        const game = this.findGame(socket);
        const player1 = game === null || game === void 0 ? void 0 : game.player1.socket;
        const player2 = game === null || game === void 0 ? void 0 : game.player2.socket;
        if (player1) {
            this.setPlayerState(player1, PlayerState.IDLE);
        }
        if (player2) {
            this.setPlayerState(player2, PlayerState.IDLE);
        }
        if (game) {
            game.state = 'ended';
            this.sendGameUpdate(game, socket);
        }
        this.games = this.games.filter(g => g !== game);
    }
}
exports.default = GameManager;
