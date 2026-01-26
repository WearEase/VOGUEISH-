'use client'
import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface ContactOption {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface HelpSupportProps {
  contactOptions?: ContactOption[];
  onPhoneClick?: () => void;
  onChatClick?: () => void;
}

const HelpSupport: React.FC<HelpSupportProps> = ({ 
  contactOptions,
  onPhoneClick,
  onChatClick 
}) => {
  // Default contact options if none provided
  const defaultOptions: ContactOption[] = [
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      icon: <Phone className="w-8 h-8 text-gray-700" />,
      action: onPhoneClick || (() => console.log('Phone support clicked'))
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: <MessageCircle className="w-8 h-8 text-gray-700" />,
      action: onChatClick || (() => console.log('Live chat clicked'))
    }
  ];

  const displayOptions = contactOptions || defaultOptions;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Help & Support</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {displayOptions.map((option) => (
            <button
              key={option.id}
              onClick={option.action}
              className="bg-gray-200 hover:bg-gray-300 transition-colors duration-200 rounded-lg p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[150px] md:min-h-[200px] group"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform duration-200">
                {option.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                {option.title}
              </h3>
              {option.description && (
                <p className="text-sm text-gray-600">
                  {option.description}
                </p>
              )}
            </button>
          ))}
        </div>
        
        {/* Additional help sections can be added here */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need More Help?</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Our support team is available 24/7 to assist you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@example.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Email Support
            </a>
            <Link 
              href="/faq"
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;