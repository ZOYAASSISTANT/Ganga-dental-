import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, Quote, X, Send } from 'lucide-react';
import { PATIENT_TESTIMONIALS, Testimonial } from '../config/clinicData';
import { Interactive3DCard } from './Interactive3DCard';

export const ReviewsSection: React.FC = React.memo(() => {
  const [reviews, setReviews] = useState<Testimonial[]>(PATIENT_TESTIMONIALS);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTreatment, setNewTreatment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const newRev: Testimonial = {
      id: `rev-${Date.now()}`,
      name: newAuthor,
      role: 'Verified Patient',
      treatment: newTreatment || 'General Dental Treatment',
      rating: newRating,
      review: newComment,
      date: 'Just now'
    };

    setReviews([newRev, ...reviews]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowReviewModal(false);
      setNewAuthor('');
      setNewTreatment('');
      setNewComment('');
    }, 1500);
  };

  return (
    <section id="reviews" className="py-8 sm:py-14 bg-white relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header matching reference mockup */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0a2540] tracking-tight">
              What Our Patients Say
            </h2>
            <p className="text-xs sm:text-base text-slate-500 font-medium mt-1">
              Real Stories from Real Smiles
            </p>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#005f73] border border-cyan-200 font-bold text-xs flex items-center space-x-2 transition-colors shadow-2xs min-h-[40px] cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-cyan-700" />
            <span>Leave a Review</span>
          </button>
        </div>

        {/* 4 Cards Grid (Exact matching Rohit Sharma, Sneha Patel, Onic Verma, Pooja Singh) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reviews.slice(0, 4).map((item) => (
            <Interactive3DCard key={item.id} variant="cyan">
              <div className="p-4 sm:p-6 h-full bg-[#f8fdfe] flex flex-col justify-between text-left">
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center space-x-1 mb-2.5 sm:mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    "{item.review}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-3.5 sm:pt-4 mt-3.5 sm:mt-4 border-t border-cyan-100/80 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-[#0a2540] leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-cyan-800 font-medium">
                      {item.treatment}
                    </p>
                  </div>
                </div>
              </div>
            </Interactive3DCard>
          ))}
        </div>

      </div>

      {/* Leave Review Modal */}
      {showReviewModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowReviewModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-cyan-100 text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-extrabold text-[#0a2540]">Share Your Experience</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="font-bold text-base text-slate-800">Thank You for Your Review!</p>
                <p className="text-xs text-slate-500">Your feedback helps fellow patients choose Ganga Dental Clinic.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Rating</label>
                  <div className="flex items-center space-x-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Sharma"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Treatment Received</label>
                  <input
                    type="text"
                    placeholder="e.g. Teeth Whitening, Root Canal, Braces"
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Review</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your care, comfort, and experience at Ganga Dental Clinic..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-xs resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#005f73] hover:bg-[#074755] text-white font-bold flex items-center space-x-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
});
