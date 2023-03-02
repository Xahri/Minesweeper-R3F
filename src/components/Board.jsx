import { useState, useEffect } from "react";
import Cell from "./Cell";
import Timer from "./Timer";
import Stopwatch from "./Stopwatch";

export default function Board ({ width, height, mines }) {
  const [grid, setGrid] = useState([]);
  const [minesCount, setMinesCount] = useState(mines);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [restarted, setRestarted] = useState(false);
  const [rightClickRefresher, setrightClickRefresher] = useState(false);
  const [emoji, setEmoji] = useState('😃');
  const [firstClick, setFirstClick] = useState(true);
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  

  useEffect(() => {
    createNewBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createNewBoard = (x = null, y = null) => {

    // if x and y are not null,
    // it means that we called this function with their values equal to a mine cell coordinates
    // so we'll create a new board with this cell execluded from the mines pool.
    let flattened_index = x !== null ? y * 8 + x : null;

    setMinesCount(mines);
    const newGrid = [];
    const minesArray = getRandomMines(mines, width, height, flattened_index);

    // for (let i = 0; i < height; i++) {
    //   newGrid.push([]);
    //   for (let j = 0; j < width; j++) {
    //     const cell = new GridCell(i, j, minesArray.includes(i * width + j));
    //     addGridCell(newGrid, cell);
    //   }
    // }

    for (let i = 0; i < height; i++) {
      newGrid.push([]);
      for (let j = 0; j < width; j++) {
        const cell = {
          x: j,
          y: i,
          n: 0,
          isMine: minesArray.includes(i * width + j),
          isRevealed: false,
          isFlagged: false,
          isUnknown: false,
          isClicked: false,
          get isEmpty() {
            return this.n === 0 && !this.isMine;
          }
        };
        addGridCell(newGrid, cell);
      }
    }

    // that's so we can use useEffect to open the new safe cell that was a mine before
    // by calling handleLeftClick(y, x)
    setX(x);
    setY(y);
    setGrid(newGrid);
  };

  useEffect(() => {
    if (x !== null){
      handleLeftClick(y, x);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y]);

  function addGridCell(grid, gridCell) {
    const y = grid.length - 1;
    const x = grid[y].length;
    const lastGridCell = gridCell;
    const neighbours = getNeighbours(grid, y, x);

    for (let neighbourGridCell of neighbours) {
      if (lastGridCell.isMine) {
        neighbourGridCell.n += 1;
      }
      else if (neighbourGridCell.isMine) {
        lastGridCell.n += 1;
      }
    }

    grid[y].push(gridCell);
  }

  const getRandomMines = (amount, columns, rows, starter = null) => {
    const minesArray = [];
    const limit = columns * rows;
    const minesPool = [...Array(limit).keys()];

    console.log("Starter is: " + starter);

    if (starter >= 0 && starter < limit && starter !== null) {
      minesPool.splice(starter, 1);
    }

    console.log(minesPool)

    for (let i = 0; i < amount; i++) {
      const n = Math.floor(Math.random() * minesPool.length);
      minesArray.push(...minesPool.splice(n, 1));
    }

    console.log(minesArray)

    return minesArray;
  };

  const revealBoard = (message) => {

    console.log(message);

    const updatedGrid = [...grid];

    updatedGrid.forEach((row) =>
      row.forEach((cell) => {
        cell.isRevealed = true;
      })
    );

    setGrid(updatedGrid);

    setIsTimerRunning(false);
  };

  const restartBoard = () => {
    setMinesCount(mines);
    createNewBoard();
    setIsTimerRunning(true);
    setRestarted(!restarted);
    setEmoji('😃');
    setFirstClick(true);
  };

  const handleFirstClickMine = (x, y) => {
    console.log(x, y);
    createNewBoard(x, y);
  };

  const getNeighbours = (grid, y, x) => {
    const neighbours = [];
  
    // Loop through the surrounding rows and columns of the current cell
    for (let row = y - 1; row <= y + 1; row++) {
      for (let col = x - 1; col <= x + 1; col++) {
        // Check if the current row and column are within the grid boundaries
        if (row >= 0 && row < grid.length && col >= 0 && col < grid[row].length) {
          // Skip the current cell itself
          if (row === y && col === x) continue;
          // Add the neighbouring cell to the array
          neighbours.push(grid[row][col]);
        }
      }
    }
  
    return neighbours;
  };  

  function revealEmptyNeighbours(y, x) {
    const updatedGrid = [...grid];
    const queue = [{ y, x }]; // Start with the clicked cell
    const visited = new Set(); // Keep track of visited cells
  
    while (queue.length) {
      const { y, x } = queue.shift(); // Get the next cell from the queue
  
      // Skip if the cell is already visited or flagged
      if (visited.has(`${y},${x}`) || updatedGrid[y][x].isFlagged) continue;
  
      // Mark the cell as visited and revealed
      visited.add(`${y},${x}`);
      updatedGrid[y][x].isUnknown = false;
      updatedGrid[y][x].isRevealed = true;
  
      // Stop if the cell is not empty
      if (!updatedGrid[y][x].isEmpty) continue;
  
      // Add the neighbouring cells to the queue
      for (const neighbour of getNeighbours(updatedGrid, y, x)) {
        const { y: ny, x: nx } = neighbour;
        queue.push({ y: ny, x: nx });
      }
    }
    
    return updatedGrid;
  }

  function checkVictory() {
    const revealed = getRevealed();

    if (revealed >= (height * width) - mines) {
      revealBoard("won");
      setEmoji('😎');
    }
  }

  const getRevealed = () => {
    // Flatten the 2D grid into a 1D array of objects.
    const flattenedGrid = [].concat(...grid);
  
    // Use reduce to count the number of objects where isRevealed is truthy.
    const numRevealed = flattenedGrid.reduce((count, obj) => {
      return count + (obj.isRevealed ? 1 : 0);
    }, 0);
  
    return numRevealed;
  };
  
  function handleLeftClick(y, x) {
    const gridCell = grid[y][x];
  
    gridCell.isClicked = true;

    if (gridCell.isRevealed || gridCell.isFlagged || gridCell.isUnknown) {
      return false;
    }

    if (gridCell.isMine && firstClick) {
      console.log("First Click Mine!")
      setFirstClick(false);
      setMinesCount(mines);
      handleFirstClickMine(x, y);
      return;
    }
    else if (gridCell.isMine && !firstClick) {
      console.log("Not a First Click Mine!")
      revealBoard("lost")
      setEmoji('🙁');
      setFirstClick(false);
      return false;
    }
    
    if (gridCell.isEmpty) {
      revealEmptyNeighbours(y, x);
    }

    setFirstClick(false);
  
    let updatedGrid = [...grid];
    updatedGrid[y][x].isFlagged = false;
    updatedGrid[y][x].isUnknown = false;
    updatedGrid[y][x].isRevealed = true;
    setGrid(updatedGrid);
  
    checkVictory();
  }
  
  function handleRightClick(e, y, x) {
    e.preventDefault();
    let minesLeft = minesCount;

    if (grid[y][x].isRevealed) return false;

    if (grid[y][x].isUnknown) {
      grid[y][x].isUnknown = false;
      grid[y][x].isFlagged = false;
      setrightClickRefresher(!rightClickRefresher);
    }
    else if (grid[y][x].isFlagged) {
      grid[y][x].isFlagged = false;
      minesLeft++;
      grid[y][x].isUnknown = true;
    }
    else{
      grid[y][x].isFlagged = true;
      minesLeft--;
    }
    
    console.log("isRevealed: " + grid[y][x].isRevealed)
    console.log("isFlagged: " + grid[y][x].isFlagged)
    console.log("isUnknown: " + grid[y][x].isUnknown)

    setMinesCount(minesLeft)
  }

  function renderBoard() {

    const handleMouseDown = () => {
      setEmoji('😨');
    };
  
    const handleMouseUp = () => {
      setEmoji('😃');
    };
  
    return grid.map((row, rowIndex) => {
      const rowCells = row.map((gridCell, cellIndex) => (
        <Cell
          key={cellIndex}
          onClick={() => handleLeftClick(gridCell.y, gridCell.x)}
          cMenu={e => handleRightClick(e, gridCell.y, gridCell.x)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          value={gridCell}
        />
      ));
  
      return <div className="row" key={rowIndex} >{rowCells}</div>;
    });
  }

  function handleTimerOver() {
    revealBoard("Time is up")
  }

    return (

      <div key={restarted} className={'gameContainer'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          padding: '8px',
          margin: '0 auto',
          maxWidth: '800px',
        }}>

        <div style={{display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '12px',
          fontFamily: 'Bebas Neue',
          alignContent: 'center',
          alignItems: 'center'
        }}>
          
          <Timer onTimerOver={handleTimerOver} timeInMinutes={40} isRunning={isTimerRunning} key={restarted} />

          <div >
            <span>💣: {minesCount}</span>
          </div>

          <div>
            <button
              onClick={restartBoard}
              style={{
                borderRadius: '12%',
                border: '2px solid white',
                background: 'rgba(255, 255, 255, .1)',
                fontSize: '1em',
                lineHeight: '1',
                padding: '0.5em',
              }}
            >
              {emoji}
            </button>
          </div>

          {/* to not collide with the Timer's key */}
          <Stopwatch isRunning={isTimerRunning} key={!restarted} />

        </div>

        <div style={{alignSelf: 'center', marginBottom: '24px'}} key={grid}>{renderBoard()}</div>
        
      </div>

    );
}
