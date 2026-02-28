import React from 'react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

function ReviewStars({ stars, updateStars = () => { } }) {
  const tempStars = Array.from({ length: 5 }, (_, index) => {
    const number = index + 0.5;
    return (
      <span key={index} onClick={() => updateStars(index + 1)} className="cursor-pointer hover:scale-110 transition-transform text-gold">
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
    <div className='flex items-center gap-1 text-sm'>
      {tempStars}
    </div>
  );
}

export default ReviewStars;
