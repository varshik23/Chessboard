import React, { useState, useEffect } from 'react';
import './Board.css';

const initialBoard = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
];

const Board = () => {
    const [board, setBoard] = useState(initialBoard);
    const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
    const [sourceSquare, setSourceSquare] = useState<{ row: number, col: number } | null>(null);
    const [moves, setMoves] = useState<string[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);


    const handleDragStart = (piece: string, row: number, col: number) => {
        setDraggedPiece(piece);
        setSourceSquare({ row, col });
    };

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setWs(socket);

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Handle game updates received from the server
            console.log(data);
        };

        return () => {
            socket.close();
            console.log('WebSocket disconnected');
        };
    }, []);

    const handleDrop = (row: number, col: number) => {
        if (draggedPiece && sourceSquare) {
            const newBoard = board.map((r) => r.slice());
            newBoard[sourceSquare.row][sourceSquare.col] = '';
            newBoard[row][col] = draggedPiece;
            setBoard(newBoard);

            const sourceNotation = convertToChessNotation(sourceSquare.row, sourceSquare.col);
            const destinationNotation = convertToChessNotation(row, col);

            ws?.send(JSON.stringify({ type: 'move', move: `${sourceNotation} to ${destinationNotation}` }));

            setMoves([...moves, `${sourceNotation} to ${destinationNotation}`]);



            setDraggedPiece(null);
            setSourceSquare(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const convertToChessNotation = (row: number, col: number) => {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return `${files[col]}${8 - row}`;
    };

    console.log(moves);

    return (
        <div className='board'>
            {
                board.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className="row">
                            {
                                row.map((piece, pieceIndex) => {
                                    const isBrown = (rowIndex + pieceIndex) % 2 === 1;
                                    return (
                                        <div
                                            key={pieceIndex}
                                            className={`square ${isBrown ? 'brown' : 'white'}`}
                                            onDrop={() => handleDrop(rowIndex, pieceIndex)}
                                            onDragOver={handleDragOver}
                                        >
                                            {piece && (
                                                <img
                                                    src={`/${piece}.png`}
                                                    alt={piece}
                                                    className='img'
                                                    draggable
                                                    onDragStart={() => handleDragStart(piece, rowIndex, pieceIndex)}
                                                />
                                            )}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Board;
