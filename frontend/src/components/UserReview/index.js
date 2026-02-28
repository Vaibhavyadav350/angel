import React from 'react';
import { ReviewStars } from '..';

function UserReview({ name, rating, comment }) {
  return (
    <div className="bg-white border border-bronze/10 rounded-lg p-6 space-y-4 shadow-sm">
      <div className="flex justify-between items-start">
        <ReviewStars stars={rating} />
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-bronze/40">Verified Custom</span>
      </div>
      <p className="text-sm font-medium leading-relaxed text-bronze/80 italic">"{comment}"</p>
      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze/60 pt-2 border-t border-bronze/5">
        <span>{name}</span>
        <span className="w-1 h-1 bg-gold/50 rounded-full"></span>
        <span>Certified Patron</span>
      </div>
    </div>
  );
}

export default UserReview;
