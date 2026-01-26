'use client'
import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface FeedbackItem {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  images?: string[];
}

interface FeedbackProps {
  feedbacks?: FeedbackItem[];
}

const StarRating: React.FC<{ rating: number; maxStars?: number }> = ({ 
  rating, 
  maxStars = 5 
}) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

const FeedbackCard: React.FC<{ feedback: FeedbackItem }> = ({ feedback }) => {
  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={feedback.userAvatar}
            alt={feedback.userName}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <span className="font-medium text-gray-900">{feedback.userName}</span>
        </div>
        <StarRating rating={feedback.rating} />
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-3">
        {feedback.comment}
      </p>
      
      {feedback.images && feedback.images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {feedback.images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`Review image ${idx + 1}`}
              width={48}
              height={48}
              className="rounded object-cover border border-gray-200"
            />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image
              src={feedback.userAvatar}
              alt={feedback.userName}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="font-medium text-gray-900">{feedback.userName}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <StarRating rating={feedback.rating} />
        
        <p className="text-gray-600 text-sm leading-relaxed my-4">
          {feedback.comment}
        </p>
        
        {feedback.images && feedback.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {feedback.images.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`Review image ${idx + 1}`}
                width={96}
                height={96}
                className="w-full h-24 rounded object-cover border border-gray-200"
              />
            ))}
          </div>
        )}
        
        <div className="flex gap-2 pt-4 border-t">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700">
            Publish
          </button>
          <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Feedback: React.FC<FeedbackProps> = ({ feedbacks = [] }) => {
  const [selectedFeedback, setSelectedFeedback] = React.useState<FeedbackItem | null>(null);

  // Default feedback data if none provided
  const defaultFeedbacks: FeedbackItem[] = [
    {
      id: '1',
      userName: 'Ekta',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      rating: 5,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=48&h=48&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop',
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=48&h=48&fit=crop',
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=48&h=48&fit=crop'
      ]
    },
    {
      id: '2',
      userName: 'Ekta',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      rating: 4,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      id: '3',
      userName: 'Ekta',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      rating: 3,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      id: '4',
      userName: 'Ekta',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      rating: 4,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      id: '5',
      userName: 'Ekta',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      rating: 4,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      id: '6',
      userName: 'Ekta',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      rating: 4,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  ];

  const displayFeedbacks = feedbacks.length > 0 ? feedbacks : defaultFeedbacks;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Feedback</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main feedback list */}
        <div className="lg:col-span-2">
          {displayFeedbacks.map((feedback) => (
            <div key={feedback.id} onClick={() => setSelectedFeedback(feedback)}>
              <FeedbackCard feedback={feedback} />
            </div>
          ))}
        </div>
        
        {/* Detail panel - hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          {selectedFeedback && (
            <div className="bg-white rounded-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={selectedFeedback.userAvatar}
                    alt={selectedFeedback.userName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-900">{selectedFeedback.userName}</span>
                </div>
              </div>
              
              <StarRating rating={selectedFeedback.rating} />
              
              <p className="text-gray-600 text-sm leading-relaxed my-4">
                {selectedFeedback.comment}
              </p>
              
              {selectedFeedback.images && selectedFeedback.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {selectedFeedback.images.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      width={80}
                      height={64}
                      className="w-full h-16 rounded object-cover border border-gray-200"
                    />
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 pt-4 border-t">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700">
                  Publish
                </button>
                <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-red-700">
                  Delete
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
};

export default Feedback;