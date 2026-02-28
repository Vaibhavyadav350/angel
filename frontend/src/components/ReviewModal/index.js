import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProductsContext } from '../../context/products_context';
import { useUserContext } from '../../context/user_context';
import ReviewStars from '../ReviewStars/';

function ReviewModal({ product }) {
  const { _id: id, reviews } = product;
  const { reviewProduct } = useProductsContext();
  const { currentUser } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const { success, message } = await reviewProduct(id, stars, comment);
    setLoading(false);
    if (success) {
      return toast.success(message);
    } else {
      return toast.error(message);
    }
  };

  const updateStars = (number) => {
    setStars(number);
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (reviews && currentUser) {
      const userReview = reviews.find((rev) => rev.email === currentUser.email);
      if (userReview) {
        setStars(userReview.rating);
        setComment(userReview.comment);
      }
    }
    // eslint-disable-next-line
  }, [product, currentUser]);

  return (
    <div>
      <button
        className="w-full py-4 border border-bronze/20 text-bronze text-[10px] font-bold uppercase tracking-[0.3em] hover:border-gold hover:text-gold transition-colors text-center"
        onClick={onOpen}
      >
        Leave A Mark
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-bronze/40 backdrop-blur-sm" onClick={onClose}></div>
          <div className="relative bg-white border border-bronze/10 rounded-lg p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-editorial font-bold text-bronze mb-6">Chronicle Your Experience</h3>
            <div className="space-y-6">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-bronze/60 mb-2">Heritage Rating</span>
                <ReviewStars stars={stars} updateStars={updateStars} />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-bronze/60 mb-2">Your Diary Entry</span>
                <textarea
                  className="w-full bg-champagne/50 border border-bronze/20 rounded p-4 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors min-h-[120px] resize-y"
                  placeholder="Share your experience with this artifact..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              {currentUser ? (
                <div className="flex gap-4 pt-4">
                  <button
                    disabled={loading}
                    className="flex-1 py-3 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-gold transition-colors disabled:opacity-50"
                    onClick={handleSubmit}
                  >
                    {loading ? 'Submitting...' : 'Submit Entry'}
                  </button>
                  <button
                    className="px-6 py-3 border border-bronze/20 text-bronze text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-bronze/5 transition-colors"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="pt-4">
                  <Link
                    to="/login"
                    className="block w-full text-center py-3 border border-bronze text-bronze text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-bronze hover:text-white transition-colors"
                  >
                    Login to Review
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewModal;
