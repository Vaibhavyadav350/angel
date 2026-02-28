import React, { useState } from 'react';
import { MdEmail, MdDelete } from 'react-icons/md';
import { Stars } from '.';
import { useProductContext } from '../../context/admin_product_context';
import { toast } from 'react-toastify';

function SingleProductReviews({ reviews, productId }) {
  const { deleteReview } = useProductContext();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (reviewId) => {
    setLoading(true);
    const { success, message } = await deleteReview(productId, reviewId);
    setLoading(false);
    if (success) {
      toast.success(message, { position: 'top-center' });
    } else {
      toast.error(message, { position: 'top-center' });
    }
  };

  return (
    <>
      {loading ? (
        <div className="bg-white border border-bronze/10 rounded-lg p-8 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-bronze/20 border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-bronze/10 rounded-lg p-8 space-y-6 divide-y divide-bronze/10">
          {reviews.map((review, index) => {
            const { rating, comment, name, email, _id: id } = review;
            return (
              <div key={index} className={`flex flex-col sm:flex-row sm:items-start gap-4 ${index > 0 ? 'pt-6' : ''}`}>
                <div className="flex-1 space-y-2">
                  <Stars stars={rating} />
                  <p className="text-sm text-bronze">{comment}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-bronze">{name}</span>
                    <MdEmail className="text-bronze/40" />
                    <a
                      href={`mailto:${email}`}
                      className="text-sm text-gold underline hover:text-bronze transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest border border-red-300 text-red-500 rounded hover:bg-red-50 transition-colors self-start"
                >
                  Delete <MdDelete />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default SingleProductReviews;
