import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Board extends React.Component {
  constructor(props) {
    super(props);
    const boardlength = 5;

    this.state = {
      boardlength: boardlength,
      dragging: false,
      squares: [
        "circle red", "", "circle green", "", "circle yellow",
        "", "", "circle blue", "", "circle orange",
        "", "", "", "", "",
        "", "circle green", "", "circle yellow", "",
        "", "circle red", "circle blue", "circle orange"
      ],
      
    }
  }
  
  onMouseEnter = (e, i) => {
    if (!this.state.dragging)
      return
    if (this.state.squares[i])
      return;
    const squareslice = this.state.squares.slice(0);
    squareslice[i] = "rectangle " + this.state.dragging;
    this.setState({ squares: squareslice});
  }
  
  onMouseDown = (e, i) => {
    const squaresplit = this.state.squares[i].split(" ");
    if (squaresplit.length < 2) {
      return;
    }
    const color = squaresplit[1];
    this.setState({ dragging: color });
  }
  
  onMouseUp = (e, i) => {
    this.setState({ dragging: false });
  }
  
                   
  renderSquare(i) {
    const squareClass = "" + this.state.squares[i];

    return (
      <td 
        key={i} 
        className="square"
        onPointerDown={ (e) => this.onMouseDown(e,i) }
        onPointerEnter={ (e) => this.onMouseEnter(e,i) }
        onPointerUp={ (e) => this.onMouseUp(e,i) }
        onTouchStart={ (e) => this.onMouseDown(e,i) }
        onTouchEnd={ (e) => this.onMouseUp(e,i) }
        >
        <div className={squareClass}>&nbsp;{}</div>
      </td>
    );
  }

  renderRow(rowNum) {
    const baseNum = rowNum * 5;
    const numbers = Array.from(new Array(5), (x, i) => i + baseNum);

    const rowItems = numbers.map((number) => {
      return this.renderSquare(number);
    });

    return (
      <tr key={rowNum} className="board-row">
        {rowItems}
      </tr>
    );
  }

  render() {
    const status = '';

    const boardRows = [...Array(this.state.boardlength)].map((x, i) => {
      return this.renderRow(i)
    });

    return (
      <div>
        <div className="status">{status}</div>
        <table 
          className="game-board"
          draggable="true"
          onDragStart={e => {
            //console.log(e.target.is('td.square'));
            if (e.target.localName === "td") {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <tbody>
            {boardRows}
          </tbody>
        </table>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
