import React, { useState } from "react";

type Props = {};

function Filters({}: Props) {
  const [current, setCurrent] = useState(0);

  const handleClick = (id: number) => {
    setCurrent(id);
  };

  return (
    <>
      <div className="btn-group mb-2 d-flex gap-1">
        <button onClick={() => handleClick(0)} className={`btn btn-xs ${current == 0 ? "btn-secondary" : "btn-light"} `}>
          Today
        </button>
        <button onClick={() => handleClick(1)} className={`btn btn-xs ${current == 1 ? "btn-secondary" : "btn-light"} `}>
          Monthly
        </button>
        <button onClick={() => handleClick(2)} className={`btn btn-xs ${current == 2 ? "btn-secondary" : "btn-light"} `}>
          Weekly
        </button>
      </div>
    </>
  );
}

export default Filters;
