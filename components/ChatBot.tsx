'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Bot, ShoppingBag, Paperclip } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface ProductRecommendation {
    _id: string;
    id: string;
    name: string;
    slug: string;
    brand: string;
    discountedPrice: number | string;
    realPrice: number | string;
    mainImage: string;
    description?: string;
    gender?: string;
    collectionType?: string;
}

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
    suggestions?: string[];
    followUps?: string[];
    products?: ProductRecommendation[];
    imageUrl?: string;
    imageUrls?: string[];
}

type TranscriptMessage = {
    sender: 'user' | 'bot';
    text: string;
};

const GUEST_QUERY_LIMIT = 8;
const GUEST_QUERY_COUNT_KEY = 'vogueish_guest_query_count';
const GUEST_TRANSCRIPT_KEY = 'vogueish_guest_transcript';
const GUEST_REFINED_KEY = 'vogueish_guest_refined';
const GUEST_ENDED_KEY = 'vogueish_guest_ended';

function renderInlineStyle(text: string) {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);

        return parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
                }

                return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
        });
}

function RichMessage({ text }: { text: string }) {
        const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);

        if (lines.length === 0) {
            return null;
        }

        return (
            <div className="space-y-2">
                {lines.map((line, index) => {
                    const isBullet = /^[-*•]\s+/.test(line);
                    const content = line.replace(/^[-*•]\s+/, '');

                    if (isBullet) {
                        return (
                            <div key={`${line}-${index}`} className="flex gap-2">
                                <span className="mt-1 text-[10px] leading-4">•</span>
                                <p className="leading-relaxed">{renderInlineStyle(content)}</p>
                            </div>
                        );
                    }

                    return (
                        <p key={`${line}-${index}`} className="leading-relaxed">
                            {renderInlineStyle(line)}
                        </p>
                    );
                })}
            </div>
        );
}

export default function ChatBot() {
    const { data: session } = useSession();
    const [guestQueryCount, setGuestQueryCount] = useState(0);
    const [isGuestLocked, setIsGuestLocked] = useState(false);
    const [isGuestEnded, setIsGuestEnded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'bot',
            text: "Hi, I’m your Vogueish stylist ✨ Tell me the occasion, your vibe, colors you like, and what you want to avoid. I’ll keep it practical and stylish.",
            timestamp: new Date(),
        }
    ]);

    useEffect(() => {
        const saved = window.localStorage.getItem('vogueish_chat_messages');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
                }
            } catch {}
        }
    }, []);

    useEffect(() => {
        if (messages.length > 1) {
            window.localStorage.setItem('vogueish_chat_messages', JSON.stringify(messages));
        }
    }, [messages]);
    const [inputText, setInputText] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const addImages = (newFiles: File[]) => {
        if (newFiles.length === 0) return;
        
        setImageFiles(prev => {
            const combined = [...prev, ...newFiles].slice(0, 3);
            return combined;
        });
        
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => {
                    if (prev.length >= 3) return prev;
                    return [...prev, reader.result as string].slice(0, 3);
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        addImages(files);
        if (e.target) e.target.value = ''; // Reset input
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = Array.from(e.clipboardData.items);
        const files = items
            .filter(item => item.type.startsWith('image/'))
            .map(item => item.getAsFile())
            .filter(Boolean) as File[];
        addImages(files);
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (session?.user) {
            setGuestQueryCount(0);
            setIsGuestLocked(false);
            setIsGuestEnded(false);
            return;
        }

        const storedCount = Number(window.localStorage.getItem(GUEST_QUERY_COUNT_KEY) ?? '0');
        const safeCount = Number.isFinite(storedCount) ? storedCount : 0;
        setGuestQueryCount(safeCount);
        setIsGuestLocked(safeCount >= GUEST_QUERY_LIMIT);
        setIsGuestEnded(window.localStorage.getItem(GUEST_ENDED_KEY) === 'true');
    }, [session?.user]);

    const readGuestTranscript = (): TranscriptMessage[] => {
        try {
            const raw = window.localStorage.getItem(GUEST_TRANSCRIPT_KEY);
            const parsed = raw ? (JSON.parse(raw) as TranscriptMessage[]) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const writeGuestTranscript = (nextTranscript: TranscriptMessage[]) => {
        window.localStorage.setItem(GUEST_TRANSCRIPT_KEY, JSON.stringify(nextTranscript));
    };

    const refineGuestContext = async (transcript: TranscriptMessage[]) => {
        const alreadyRefined = window.localStorage.getItem(GUEST_REFINED_KEY) === 'true';

        if (alreadyRefined || transcript.length === 0) {
            return;
        }

        const response = await fetch('/api/chat/refine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: transcript }),
        });

        if (!response.ok) {
            return;
        }

        window.localStorage.setItem(GUEST_REFINED_KEY, 'true');
        window.localStorage.removeItem(GUEST_TRANSCRIPT_KEY);
    };

    const endGuestChat = async () => {
        if (session?.user || isGuestEnded) {
            return;
        }

        const transcript = readGuestTranscript();

        if (transcript.length > 0) {
            setIsTyping(true);
            try {
                await refineGuestContext(transcript);
            } finally {
                setIsTyping(false);
            }
        }

        window.localStorage.setItem(GUEST_ENDED_KEY, 'true');
        window.localStorage.removeItem(GUEST_TRANSCRIPT_KEY);
        window.localStorage.removeItem(GUEST_QUERY_COUNT_KEY);
        setGuestQueryCount(0);
        setIsGuestLocked(true);
        setIsGuestEnded(true);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'bot',
            text: 'I’ve saved a compact style memory from this chat. Sign in to continue and I’ll keep your preferences ready ✨',
            timestamp: new Date(),
        }]);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputText.trim() && imageFiles.length === 0) return;
        if (!session?.user && isGuestLocked) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputText,
            imageUrls: imagePreviews.length > 0 ? imagePreviews : undefined,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setImageFiles([]);
        setImagePreviews([]);
        setIsTyping(true);

        try {
            const nextCount = guestQueryCount + 1;
            if (!session?.user) {
                window.localStorage.setItem(GUEST_QUERY_COUNT_KEY, String(nextCount));
                setGuestQueryCount(nextCount);
                if (nextCount >= GUEST_QUERY_LIMIT) {
                    setIsGuestLocked(true);
                }
            }

            const nextTranscript: TranscriptMessage[] = !session?.user
                ? [...readGuestTranscript(), { sender: 'user', text: userMsg.text }]
                : [];

            const chatPromise = fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map(({ sender, text }) => ({ sender, text })),
                }),
            });

            const recPromise = fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: userMsg.text, imageUrls: userMsg.imageUrls }),
            }).then(res => res.json()).catch(() => ({ recommendations: [] }));

            const [chatResponse, recPayload] = await Promise.all([chatPromise, recPromise]);
            const payload = await chatResponse.json();

            const allProducts = [...(recPayload.recommendations || []), ...(payload.products || [])];
            const uniqueProducts = Array.from(new Map(allProducts.map((p: { _id?: string; id?: string }) => [p._id || p.id, p])).values()).slice(0, 4);

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: payload.reply || payload.error || 'I could not generate a response right now.',
                timestamp: new Date(),
                suggestions: Array.isArray(payload.suggestions) ? payload.suggestions : [],
                products: uniqueProducts as ProductRecommendation[],
            };

            setMessages(prev => [...prev, botResponse]);

            // Automatically trigger background refinement every 3 messages to store memory in MongoDB
            const totalMsgCount = messages.length + 2; // previous messages + userMsg + botResponse
            if (totalMsgCount >= 3 && totalMsgCount % 3 === 0) {
                const transcriptToRefine = [...messages, userMsg, botResponse].map(({ sender, text }) => ({ sender, text }));
                fetch('/api/chat/refine', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: transcriptToRefine }),
                }).catch(err => console.error("Auto-refinement failed:", err));
            }

            if (!session?.user) {
                const transcriptWithAssistant: TranscriptMessage[] = [
                    ...nextTranscript,
                    { sender: 'bot', text: botResponse.text },
                ];
                writeGuestTranscript(transcriptWithAssistant);
            }

            if (!session?.user && nextCount >= GUEST_QUERY_LIMIT) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 2).toString(),
                    sender: 'bot',
                    text: 'I’ve helped with a few free questions now. You can end this chat to save a compact style memory, then sign in to continue ✨',
                    timestamp: new Date(),
                }]);
            }
        } catch {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: 'I am having trouble connecting to the stylist service right now. Please try again in a moment.',
                timestamp: new Date(),
            }]);
        } finally {
            setIsTyping(false);
        }
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
                <div className="flex items-center gap-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
                        Free chats left: {Math.max(GUEST_QUERY_LIMIT - guestQueryCount, 0)}
                    </span>
                    {!session?.user && !isGuestEnded && (
                        <button
                            type="button"
                            onClick={() => void endGuestChat()}
                            className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white transition-colors hover:bg-white/15"
                        >
                            End chat !
                        </button>
                    )}
                    <Sparkles className="text-yellow-400 w-5 h-5 opacity-50" />
                </div>
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
                                <RichMessage text={msg.text} />
                                {msg.imageUrl && !msg.imageUrls && (
                                    <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border border-neutral-200">
                                        <Image src={msg.imageUrl} alt="Uploaded" fill className="object-cover" />
                                    </div>
                                )}
                                {msg.imageUrls && msg.imageUrls.length > 0 && (
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        {msg.imageUrls.map((url, i) => (
                                            <div key={i} className="relative w-32 h-32 rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
                                                <Image src={url} alt={`Uploaded ${i+1}`} fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {msg.products && msg.products.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Recommended Products</p>
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                                            {msg.products.map((product) => {
                                                const realPriceNum = typeof product.realPrice === 'string' ? Number(product.realPrice.replace(/[^0-9.]/g, '')) : product.realPrice;
                                                const discountedPriceNum = typeof product.discountedPrice === 'string' ? Number(product.discountedPrice.replace(/[^0-9.]/g, '')) : product.discountedPrice;
                                                const discountPercentage = realPriceNum > discountedPriceNum 
                                                    ? Math.round(((realPriceNum - discountedPriceNum) / realPriceNum) * 100)
                                                    : 0;

                                                return (
                                                    <Link
                                                        key={product._id || product.id}
                                                        href={`/shop/${product.slug}`}
                                                        className="group flex-shrink-0 w-40 bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                                                    >
                                                        <div className="relative w-full h-28 bg-neutral-50 overflow-hidden">
                                                            <Image
                                                                src={product.mainImage}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                                sizes="160px"
                                                            />
                                                            {discountPercentage > 0 && (
                                                                <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
                                                                    -{discountPercentage}%
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                                                            <div>
                                                                <span className="text-[9px] text-neutral-400 font-semibold tracking-wider uppercase block mb-0.5">{product.brand}</span>
                                                                <h4 className="text-[11px] font-semibold text-neutral-800 line-clamp-2 leading-snug group-hover:text-black transition-colors">
                                                                    {product.name}
                                                                </h4>
                                                            </div>
                                                            <div className="mt-2 flex items-center justify-between">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs font-bold text-neutral-900">
                                                                        ₹{new Intl.NumberFormat('en-IN').format(discountedPriceNum)}
                                                                    </span>
                                                                    {discountPercentage > 0 && (
                                                                        <span className="text-[9px] text-neutral-400 line-through">
                                                                            ₹{new Intl.NumberFormat('en-IN').format(realPriceNum)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                    <ShoppingBag className="w-2.5 h-2.5" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {msg.suggestions && msg.suggestions.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {msg.suggestions.map((suggestion, index) => {
                                            const suggestionObj = suggestion as unknown;
                                            const text = typeof suggestionObj === 'object' && suggestionObj !== null
                                                ? (suggestionObj as Record<string, unknown>).text as string || JSON.stringify(suggestionObj)
                                                : String(suggestion);
                                            return (
                                                <span
                                                    key={index}
                                                    className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium text-neutral-700"
                                                >
                                                    {text}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                                {msg.followUps && msg.followUps.length > 0 && (
                                    <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3 text-gray-700">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Need one quick detail</p>
                                        <div className="mt-2 space-y-2 text-sm leading-relaxed">
                                            {msg.followUps.slice(0, 2).map((followUp, index) => {
                                                const followUpObj = followUp as unknown;
                                                const text = typeof followUpObj === 'object' && followUpObj !== null
                                                    ? (followUpObj as Record<string, unknown>).text as string || JSON.stringify(followUpObj)
                                                    : String(followUp);
                                                return <p key={index}>{text}</p>;
                                            })}
                                        </div>
                                    </div>
                                )}
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
            <div className="flex flex-col bg-white border-t border-gray-100">
                {imagePreviews.length > 0 && (
                    <div className="px-4 py-3 flex flex-wrap gap-3 bg-gray-50 border-b border-gray-100 items-center">
                        {imagePreviews.map((preview, i) => (
                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                <Image src={preview} alt={`Preview ${i+1}`} fill className="object-cover" />
                                <button 
                                    onClick={() => removeImage(i)} 
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        {imagePreviews.length < 3 && (
                            <div className="text-[10px] text-gray-400 font-medium ml-2">
                                {3 - imagePreviews.length} more allowed
                            </div>
                        )}
                    </div>
                )}
                <div className="p-4 flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        multiple
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isGuestLocked || isGuestEnded}
                        className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Attach an image"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onPaste={handlePaste}
                        placeholder={isGuestLocked || isGuestEnded ? "Sign in to keep chatting..." : "Type your fashion question or paste images..."}
                        disabled={isGuestLocked || isGuestEnded}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <button
                        onClick={handleSend}
                        disabled={(!inputText.trim() && imageFiles.length === 0) || isGuestLocked || isGuestEnded}
                        className="bg-black text-white p-3 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                {isGuestEnded || isGuestLocked ? (
                    <div className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                        <p className="text-sm text-gray-700">
                            You’ve ended the guest chat. Sign in to continue the conversation and let me remember your style better ✨
                        </p>
                        <Link
                            href="/login"
                            className="mt-3 inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                        >
                            Sign in to continue
                        </Link>
                    </div>
                ) : (
                    <p className="text-center text-xs text-gray-400 mt-2">
                        AI can make mistakes. Please contact support for critical issues.
                    </p>
                )}
            </div>
        </div>
    );
}
