"use client";
import React, { useState } from 'react';
import { Phone, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface ContactOption {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
}

const HelpSupport: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I configure my styling consultation time slots?",
      answer: "Go to the 'Products' tab in your seller dashboard and click the 'Manage Slots' calendar icon. Here you can toggle standard slots or define custom time windows for stylist home trial visits."
    },
    {
      question: "When do I receive payouts for completed home trial sales?",
      answer: "Payouts are processed automatically and transferred on the billing date listed in the Customers section, typically 7-10 business days after the stylist verification OTP is cleared and alterations are approved."
    },
    {
      question: "How do I manage customer garment alteration requests?",
      answer: "Once stylist arrival is verified at the customer's home, the customer can request custom alterations. These details populate inside your 'Feedback' dashboard section where you can track sewing specs."
    },
    {
      question: "Who handles return logistics for unsold items?",
      answer: "Our automated delivery partner collects and routes any returned/unsold items back to your warehouse. You can track progress of all returns in the 'Shipment' section."
    }
  ];

  const defaultOptions: ContactOption[] = [
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      icon: <Phone className="w-8 h-8 text-gray-700" />,
      action: () => {}
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: <MessageCircle className="w-8 h-8 text-gray-700" />,
      action: () => {}
    }
  ];

  const displayOptions = defaultOptions;

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
        
        {/* FAQ Accordion Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto text-left mb-12">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm transition-all duration-200">
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between font-semibold text-gray-800 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 py-4 text-sm text-gray-600 bg-gray-50 border-t border-gray-150 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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