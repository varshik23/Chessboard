// GameManager.ts
import * as WebSocket from 'ws';

enum PlayerState {
    IDLE = 'idle',
    WAITING = 'waiting',
    IN_GAME = 'in_game',
}

interface Player {
    socket: WebSocket;
    state: PlayerState;
}

interface Game {
    player1: {
        socket: WebSocket;
        color: 'white' | 'black';
    };
    player2: {
        socket: WebSocket;
        color: 'white' | 'black';
    };
    moves: any[];
    state: 'in_progress' | 'ended';
}

export default class GameManager {
    private players: Player[] = [];
    private games: Game[] = [];

    public addPlayer(socket: WebSocket) {
        this.players.push({ socket, state: PlayerState.IDLE });
    }

    public handleStart(socket: WebSocket) {
        const currentPlayer = this.players.find(player => player.socket === socket);
        if (!currentPlayer || currentPlayer.state !== PlayerState.IDLE) return;

        const waitingPlayer = this.players.find(player => player.state === PlayerState.WAITING);
        if (waitingPlayer) {
            this.startGame(currentPlayer.socket, waitingPlayer.socket);
        } else {
            currentPlayer.state = PlayerState.WAITING;
        }
    }

    public handleMove(socket: WebSocket, move: any) {
        const game = this.findGame(socket);
        if (!game || game.state !== 'in_progress') return;

        game.moves.push(move);
        this.sendGameUpdate(game, socket);
    }

    public removePlayer(socket: WebSocket) {
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

    private startGame(player1Socket: WebSocket, player2Socket: WebSocket) {
        const player1Color = 'white';
        const player2Color = 'black';
        const newGame: Game = {
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

    private setPlayerState(socket: WebSocket, state: PlayerState) {
        const player = this.players.find(p => p.socket === socket);
        if (player) {
            player.state = state;
        }
    }

    private findGame(socket: WebSocket): Game | undefined {
        return this.games.find(game => game.player1.socket === socket || game.player2.socket === socket);
    }

    private sendGameUpdate(game: Game, socket?: WebSocket) {
        const gameState = {
            playerColor: game.player1.socket === socket ? game.player1.color : game.player2.color,
            moves: game.moves,
            state: game.state,
        };

        const jsonGameState = JSON.stringify(gameState);
        game.player1.socket.send(jsonGameState);
        game.player2.socket.send(jsonGameState);
    }

    public handleEnd(socket: WebSocket) {
        const game = this.findGame(socket);
        const player1 = game?.player1.socket;
        const player2 = game?.player2.socket;
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
