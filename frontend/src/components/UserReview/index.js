import React from 'react';
import { ReviewStars } from '..';

function UserReview({ name, rating, comment }) {
  return (
    <div>
      <ReviewStars stars={rating} />
      <p className='comment'>{comment}</p>
      <div className='user-info'>
        <span>{name}</span>
        <span className='dot'></span>
        <span>Certified Buyer</span>
      </div>
    </div>
  );
}

export default UserReview;
