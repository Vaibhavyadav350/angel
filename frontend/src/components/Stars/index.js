import React from 'react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

const Stars = ({ stars, reviews }) => {
  const tempStars = Array.from({ length: 5 }, (_, index) => {
    const number = index + 0.5;
    return (
      <span key={index}>
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

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center text-gold gap-0.5">{tempStars}</div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-bronze/50">
        ({reviews} customer reviews)
      </p>
    </div>
  );
};

export default Stars;
