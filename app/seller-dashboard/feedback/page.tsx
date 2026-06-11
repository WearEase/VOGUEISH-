"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Check, Trash2 } from 'lucide-react';

interface FeedbackItem {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  images?: string[];
}

const defaultFeedbacks: FeedbackItem[] = [
  {
    id: '1',
    userName: 'Rohan Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    comment: 'The home trial session for the linen trousers was extremely convenient. The fit was perfect right out of the box. Delivery agent was very helpful too.',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=80&h=80&fit=crop'
    ]
  },
  {
    id: '2',
    userName: 'Priya Patel',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    comment: 'Absolutely love the high-waist denim jeans. The fabric is super stretchable and comfortable. Trying three sizes at home made selecting the right one so easy.',
  },
  {
    id: '3',
    userName: 'Aarav Mehta',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    rating: 4,
    comment: 'Solid fabric quality. The joggers are great for loungewear. Collection process was very smooth, though the agent arrived slightly late.',
  },
  {
    id: '4',
    userName: 'Ananya Iyer',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    comment: 'First time trying home wardrobe trials for skirts. The pleated design looks premium. Great concept, saves so much time going to malls.',
  },
  {
    id: '5',
    userName: 'Kabir Sen',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop&crop=face',
    rating: 3,
    comment: 'Trousers material is premium, but the color was slightly different than shown online. Customer service was helpful in scheduling a swift replacement.',
  }
];

const StarRating: React.FC<{ rating: number; maxStars?: number }> = ({ 
  rating, 
  maxStars = 5 
}) => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating 
              ? 'fill-yellow-400 text-yellow-400 dark:fill-yellow-550 dark:text-yellow-550' 
              : 'fill-gray-200 text-gray-200 dark:fill-zinc-800 dark:text-zinc-850'
          }`}
        />
      ))}
    </div>
  );
};

const FeedbackCard: React.FC<{ feedback: FeedbackItem; isSelected: boolean }> = ({ feedback, isSelected }) => {
  return (
    <div className={`rounded-xl p-5 mb-4 shadow-sm border transition-all duration-300 cursor-pointer ${
      isSelected 
        ? "bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900" 
        : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-850 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-850">
            <Image
              src={feedback.userAvatar}
              alt={feedback.userName}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-sm">{feedback.userName}</span>
        </div>
        <StarRating rating={feedback.rating} />
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
        {feedback.comment}
      </p>
      
      {feedback.images && feedback.images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {feedback.images.map((img, idx) => (
            <div key={idx} className="relative w-12 h-12 rounded overflow-hidden border border-gray-200 dark:border-zinc-800 bg-gray-100">
              <Image
                src={img}
                alt={`Review image ${idx + 1}`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FeedbackDetailModal: React.FC<{ 
  feedback: FeedbackItem; 
  onClose: () => void 
}> = ({ feedback, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-850">
              <Image
                src={feedback.userAvatar}
                alt={feedback.userName}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">{feedback.userName}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition"
          >
            <XIcon />
          </button>
        </div>
        
        <div className="mb-4">
          <StarRating rating={feedback.rating} />
        </div>
        
        <p className="text-gray-650 dark:text-gray-400 text-sm leading-relaxed my-4">
          {feedback.comment}
        </p>
        
        {feedback.images && feedback.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {feedback.images.map((img, idx) => (
              <div key={idx} className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800 bg-gray-150">
                <Image
                  src={img}
                  alt={`Review image ${idx + 1}`}
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <button className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition shadow-sm">
            <Check className="w-4 h-4" /> Publish
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-red-650 hover:bg-red-750 text-white py-2 px-4 rounded-lg text-sm font-medium transition shadow-sm">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Feedback() {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);

  // Set default selection on load
  useEffect(() => {
    if (defaultFeedbacks.length > 0) {
      setSelectedFeedback(defaultFeedbacks[0]);
    }
  }, []);

  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-zinc-950 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Feedback</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main feedback list */}
        <div className="lg:col-span-2">
          {defaultFeedbacks.map((feedback) => (
            <div key={feedback.id} onClick={() => setSelectedFeedback(feedback)}>
              <FeedbackCard 
                feedback={feedback} 
                isSelected={selectedFeedback?.id === feedback.id}
              />
            </div>
          ))}
        </div>
        
        {/* Detail panel - hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          {selectedFeedback && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-850 rounded-xl p-6 sticky top-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-850">
                  <Image
                    src={selectedFeedback.userAvatar}
                    alt={selectedFeedback.userName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white block">{selectedFeedback.userName}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Verified Customer</span>
                </div>
              </div>
              
              <div className="mb-4">
                <StarRating rating={selectedFeedback.rating} />
              </div>
              
              <p className="text-gray-650 dark:text-gray-400 text-sm leading-relaxed my-4">
                {selectedFeedback.comment}
              </p>
              
              {selectedFeedback.images && selectedFeedback.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {selectedFeedback.images.map((img, idx) => (
                    <div key={idx} className="relative w-full h-20 rounded overflow-hidden border border-gray-250 dark:border-zinc-800 bg-gray-150">
                      <Image
                        src={img}
                        alt={`Review image ${idx + 1}`}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <button className="flex-1 flex items-center justify-center gap-2 bg-purple-650 hover:bg-purple-750 text-white py-2 px-4 rounded-lg text-sm font-medium transition shadow-sm font-sans">
                  <Check className="w-4 h-4" /> Publish
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-red-650 hover:bg-red-750 text-white py-2 px-4 rounded-lg text-sm font-medium transition shadow-sm font-sans">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile modal */}
      {selectedFeedback && (
        <div className="lg:hidden">
          <FeedbackDetailModal 
            feedback={selectedFeedback} 
            onClose={() => setSelectedFeedback(null)} 
          />
        </div>
      )}
    </div>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}