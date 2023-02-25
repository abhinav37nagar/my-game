import { useState, useEffect } from "react";
const Square = ({ val, i, j, size }) => {

  const [scale, setScale] = useState(0);
  const [z, setZ] = useState(20)

  useEffect(() => {
    setScale(1);
    if (!val) setZ(1);
  }, [val]);

  const side = (500 - 10 * (size + 1)) / size;


  const style = {
    top: `${10 + (side + 10) * i}px`,
    left: `${10 + (side + 10) * j}px`,
    width: `${side}px`,
    height: `${side}px`,
    transform: `scale(${scale})`,
    zIndex: `${z}`,
    lineHeight: `${side}px`
  }

  return (
    <div className={`square`} style={style}>
      {val ? val : ''}
    </div>
  );
};

export default Square;
