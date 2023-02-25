import { useState, useEffect, useCallback } from 'react';
import Square from './Square';
import { useThrottledCallback } from "use-debounce";

const Board = () => {
  const [size, setSize] = useState(4);
  const [grid, setGrid] = useState([]);

  const empty = (curr, key, i, j) => {
    for (let item of curr) {
      if (item && item.key === key) return false;
      if (item && item.i === i && item.j === j) return false;
    }
    return true;
  };

  const style = {
    gridTemplateRows: `repeat(${size}, minmax(50px, 1fr))`,
    gridTemplateColumns: `repeat(${size}, minmax(50px, 1fr))`,
  };

  const generate = useCallback((curr) => {
    if (curr.length === size * size) return curr.slice();
    let i = Math.floor(Math.random() * size);
    let j = Math.floor(Math.random() * size);
    let key = Math.random();
    while (!empty(curr, key, i, j)) {
      key = Math.random();
      i = Math.floor(Math.random() * size);
      j = Math.floor(Math.random() * size);
    }
    let temp = curr.slice();
    temp.push({ key: key, i: i, j: j, val: 2 });
    return (temp);
  }, [size]);

  const moveLeft = () => {
    let newGrid = [];
    for (let s = 0; s < size; s++) {
      let temp = [];
      for (let item of grid) if (item && item.i === s && item.val) temp.push({ ...item });
      temp.sort((a, b) => a.j - b.j)
      let idx = 0;
      for (let i = 0; i < temp.length; i++) {
        if (i + 1 < temp.length && temp[i].val === temp[i + 1].val) {
          newGrid.push({ key: temp[i].key, i: temp[i].i, j: idx, val: temp[i].val + temp[i + 1].val });
          newGrid.push({ key: temp[i + 1].key, i: temp[i + 1].i, j: idx, val: 0 });
          i++;
        } else {
          newGrid.push({ key: temp[i].key, i: temp[i].i, j: idx, val: temp[i].val });
        }
        idx++;
      }
    }
    setGrid(generate([...newGrid]))
  };

  const moveRight = () => {
    let newGrid = [];
    for (let s = 0; s < size; s++) {
      let temp = [];
      for (let item of grid) if (item && item.i === s && item.val) temp.push({ ...item });
      temp.sort((a, b) => b.j - a.j)
      let idx = size - 1;
      for (let i = 0; i < temp.length; i++) {
        if (i + 1 < temp.length && temp[i].val === temp[i + 1].val) {
          newGrid.push({ key: temp[i].key, i: temp[i].i, j: idx, val: temp[i].val + temp[i + 1].val });
          newGrid.push({ key: temp[i + 1].key, i: temp[i + 1].i, j: idx, val: 0 });
          i++;
        } else {
          newGrid.push({ key: temp[i].key, i: temp[i].i, j: idx, val: temp[i].val });
        }
        idx--;
      }
    }
    setGrid(generate([...newGrid]))
  };

  const moveUp = () => {
    let newGrid = [];
    for (let s = 0; s < size; s++) {
      let temp = [];
      for (let item of grid) if (item && item.j === s && item.val) temp.push({ ...item });
      temp.sort((a, b) => a.i - b.i)
      let idx = 0;
      for (let i = 0; i < temp.length; i++) {
        if (i + 1 < temp.length && temp[i].val === temp[i + 1].val) {
          newGrid.push({ key: temp[i].key, i: idx, j: temp[i].j, val: temp[i].val + temp[i + 1].val });
          newGrid.push({ key: temp[i + 1].key, i: idx, j: temp[i + 1].j, val: 0 });
          i++;
        } else {
          newGrid.push({ key: temp[i].key, i: idx, j: temp[i].j, val: temp[i].val });
        }
        idx++;
      }
    }
    setGrid(generate([...newGrid]))
  };

  const moveDown = () => {
    let newGrid = [];
    for (let s = 0; s < size; s++) {
      let temp = [];
      for (let item of grid) if (item && item.j === s && item.val) temp.push({ ...item });
      temp.sort((a, b) => b.i - a.i)
      let idx = size - 1;
      for (let i = 0; i < temp.length; i++) {
        if (i + 1 < temp.length && temp[i].val === temp[i + 1].val) {
          newGrid.push({ key: temp[i].key, i: idx, j: temp[i].j, val: temp[i].val + temp[i + 1].val });
          newGrid.push({ key: temp[i + 1].key, i: idx, j: temp[i + 1].j, val: 0 });
          i++;
        } else {
          newGrid.push({ key: temp[i].key, i: idx, j: temp[i].j, val: temp[i].val });
        }
        idx--;
      }
    }
    setGrid(generate([...newGrid]))
  };

  useEffect(() => {
    setGrid(generate([]));
  }, [size, generate]);


  const handleKeyDown = (e) => {
    e.preventDefault();

    switch (e.code) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowUp":
        moveUp();
        break;
      case "ArrowDown":
        moveDown();
        break;
      default:
        return;
    }
  };

  const throttledHandleKeyDown = useThrottledCallback(
    handleKeyDown,
    500,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    window.addEventListener("keydown", throttledHandleKeyDown);

    return () => {
      window.removeEventListener("keydown", throttledHandleKeyDown);
    };
  }, [throttledHandleKeyDown]);

  return (
    <>
      <div className="board" style={style}>
        {
          (new Array(size * size).fill(0)).map((val, idx) => <div key={idx} className="board-box-backdrop"></div>)
        }
        {
          grid.map((item) => (
            < Square key={item.key} val={item.val} i={item.i} j={item.j} size={size} />
          ))
        }
      </div>
      <div class="btn-group" style={{ width: `500px` }} role="group" aria-label="Basic example">
        <button type="button" class={`btn ${size === 3 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSize(3)} >3x3</button>
        <button type="button" class={`btn ${size === 4 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSize(4)} >4x4</button>
        <button type="button" class={`btn ${size === 5 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSize(5)} >5x5</button>
      </div>
    </>
  );
};

export default Board;
