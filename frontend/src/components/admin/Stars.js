import React from 'react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

function Stars({ stars }) {
  const tempStars = Array.from({ length: 5 }, (_, index) => {
    const number = index + 0.5;
    return (
      <span key={index} className="text-gold">
        {stars >= index + 1 ? (
          <BsStarFill />
        ) : stars >= number ? (
          <BsStarHalf />
        ) : (
          <BsStar />
        )}
      </span>
    );
  });

  return <div className="flex items-center gap-0.5">{tempStars}</div>;
}

export default Stars;
