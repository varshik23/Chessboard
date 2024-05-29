//Lets create a chess board
// Path: chess-frontend/src/screens/board.tsx
import './Board.css';

const Board = () => {
    const board = [['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']];



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
                                        <div key={pieceIndex} className={`square ${isBrown ? 'brown' : 'white'}`}>
                                            {piece && <img src={`/${piece}.png`} alt={piece} />}
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