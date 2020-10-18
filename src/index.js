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
      lines: {
        "blue": [],
        "green": [],
        "red": [],
        "orange": [],
        "yellow": [],
      },

      starts: {
        "blue": [7, 22],
        "green": [2, 16],
        "red": [0, 21],
        "orange": [9, 23],
        "yellow": [4, 18],
      },
    }
  }
  
  onMouseEnter = (e, i) => {
    const lines = { ...this.state.lines };
    if (!this.state.dragging)
      return;

    const dragColor = this.state.dragging;
    
    // test if adjacent to existing
    const adjacentTiles = [ i-5, i+5 ];
    // left-most-tile doesn't have -1 adjacent
    if ((i % this.state.boardlength) !== 0)
      adjacentTiles.push(i-1);
    // right-most-tile doesn't have +1 adjacent
    if ((i % this.state.boardlength) !== this.state.boardlength-1)
      adjacentTiles.push(i+1);

    if(!adjacentTiles.some(element => lines[dragColor].includes(element))) {
      return;
    }

    // don't continue growing after both starts
    if (this.state.starts[dragColor].every(start => lines[dragColor].includes(start)))
      return;

    for (var color in lines) {
      // can't go over foreign starts
      if(dragColor !== color && this.state.starts[color].includes(i)) {
        return;
      }
      // cut off overlapping lines
      if(lines[color].includes(i)) {
        const index = lines[color].indexOf(i);
        lines[color] = lines[color].slice(0, index)
      }
    }

    lines[dragColor].push(i);
    this.setState({ lines });
  }
  
  onMouseDown = (e, i) => {
    const lines = { ...this.state.lines };
    var dragColor;

    for (var color in lines) {
      // if grabbing from startpoint, start clean
      if(this.state.starts[color].includes(i)) {
        lines[color] = [];
        dragColor = color;
      }
      // if line is grabbed in the middle, remove following
      if(lines[color].includes(i)) {
        const index = lines[color].indexOf(i);
        lines[color] = lines[color].slice(0, index);
        dragColor = color;
      }
    }

    lines[dragColor].push(i);

    this.setState({
      dragging: dragColor,
      lines
    });
  }
  
  onMouseUp = (e, i) => {
    this.setState({ dragging: false });
  }
                   
  renderSquare(i) {
    var squareClass;

    for (var color in this.state.lines) {
      if(this.state.starts[color].includes(i)) {
        squareClass = "circle " + color;
        break;
      }
      if(this.state.lines[color].includes(i)) {
        squareClass = "rectangle " + color;
        break;
      }
    }

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
    const status = this.testFinished() ? "finished" : "not finished";

    const boardRows = [...Array(this.state.boardlength)].map((x, i) => {
      return this.renderRow(i)
    });

    return (
      <div>
        <table 
          className="game-board"
          draggable="true"
          // prevent text selections
          onDragStart={e => {
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
        <div className="status">{status}</div>
      </div>
    );
  }

  testFinished() {
    for (var color in this.state.lines) {
      if (!this.state.starts[color].every(v => this.state.lines[color].includes(v))) {
        return false;
     }
    }
    return true;
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
