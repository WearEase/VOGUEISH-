'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Bot } from 'lucide-react';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

export default function ChatBot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'bot',
            text: "Hello! I'm Vougeish AI. I can help you with style advice, returns, shipping, or finding the perfect outfit. How can I assist you today?",
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const generateResponse = (text: string): string => {
        const lowerText = text.toLowerCase();

        // Simple rule-based logic for demo
        if (lowerText.includes('return') || lowerText.includes('exchange')) {
            return "Returns are easy! You can return any item within 30 days of delivery. Just go to your order history to initiate a return. We also offer free pickups.";
        }
        if (lowerText.includes('shipping') || lowerText.includes('delivery')) {
            return "We offer free shipping on orders above ₹1999. Valid orders usually arrive within 3-5 business days.";
        }
        if (lowerText.includes('size') || lowerText.includes('fit')) {
            return "Unsure about sizing? I recommend checking our Size Guide on the product page. Or try our Home Trial service to try multiple sizes at home!";
        }
        if (lowerText.includes('home trial') || lowerText.includes('trial')) {
            return "Our Home Trial service is perfect for you! Select 5-10 items, pay a small deposit, and our stylist will bring them to your doorstep. You only pay for what you keep.";
        }
        if (lowerText.includes('party') || lowerText.includes('black dress')) {
            return "Looking for a party outfit? Our 'Midnight Velvet' collection is trending right now. I'd suggest pairing a black midi dress with silver accessories.";
        }
        if (lowerText.includes('men') || lowerText.includes('suit')) {
            return "For men, our bespoke tailoring service is top-notch. Or check out our new arrivals in the Men's section for premium blazers.";
        }

        return "I see! That's interesting. Could you tell me more specifically what you're looking for? I can help with styling, sizing, or order support.";
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulate network delay
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: generateResponse(userMsg.text),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="flex flex-col h-[700px] w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-neutral-900 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Bot className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-white font-serif text-lg tracking-wide">Vogueish Assistant</h2>
                        <p className="text-white/60 text-xs flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Online
                        </p>
                    </div>
                </div>
                <Sparkles className="text-yellow-400 w-5 h-5 opacity-50" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div
                                className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${msg.sender === 'user' ? 'bg-black' : 'bg-white border border-gray-200'
                                    }`}
                            >
                                {msg.sender === 'user' ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Bot className="w-4 h-4 text-black" />
                                )}
                            </div>

                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-black text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                {msg.text}
                                <span className={`text-[10px] block mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'
                                    }`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-black" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your question..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className="bg-black text-white p-3 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                    AI can make mistakes. Please contact support for critical issues.
                </p>
            </div>
        </div>
    );
}
