'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';

interface HomeTrialItem extends Product {
    selectedSize: string;
}

interface HomeTrialContextType {
    trialItems: HomeTrialItem[];
    addToHomeTrial: (product: Product, size: string) => void;
    removeFromHomeTrial: (productId: string, size: string) => void;
    clearHomeTrial: () => void;
    isValidTrial: boolean; // True if 2 <= items <= 10
    itemCount: number;
    homeTrialCompleted: boolean;
    markHomeTrialCompleted: () => void;
}

const HomeTrialContext = createContext<HomeTrialContextType | undefined>(undefined);

export function HomeTrialProvider({ children }: { children: ReactNode }) {
    const [trialItems, setTrialItems] = useState<HomeTrialItem[]>([]);
    const [homeTrialCompleted, setHomeTrialCompleted] = useState<boolean>(() => {
        try {
            return localStorage.getItem('home-trial-completed') === 'true';
        } catch (e) {
            return false;
        }
    });

    // Load from localStorage on mount
    useEffect(() => {
        const savedItems = localStorage.getItem('home-trial-items');
        if (savedItems) {
            try {
                setTrialItems(JSON.parse(savedItems));
            } catch (e) {
                console.error('Failed to parse home trial items', e);
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('home-trial-items', JSON.stringify(trialItems));
    }, [trialItems]);

    useEffect(() => {
        try {
            localStorage.setItem('home-trial-completed', homeTrialCompleted ? 'true' : 'false');
        } catch (e) {
            // ignore
        }
    }, [homeTrialCompleted]);

    const addToHomeTrial = (product: Product, size: string) => {
        if (trialItems.length >= 10) {
            // We'll handle the UI alert in the component, but strictly strictly prevent > 10 here too
            // Optional: throw error or return false to indicate failure
            return;
        }

        // Check if duplicate
        const exists = trialItems.some(
            (item) => item.id === product.id && item.selectedSize === size
        );

        if (!exists) {
            setTrialItems((prev) => [...prev, { ...product, selectedSize: size }]);
        }
    };

    const removeFromHomeTrial = (productId: string, size: string) => {
        setTrialItems((prev) =>
            prev.filter((item) => !(item.id === productId && item.selectedSize === size))
        );
    };

    const clearHomeTrial = () => {
        setTrialItems([]);
    };

    const markHomeTrialCompleted = () => {
        setHomeTrialCompleted(true);
    };

    const itemCount = trialItems.length;
    const isValidTrial = itemCount >= 2 && itemCount <= 10;

    return (
        <HomeTrialContext.Provider
            value={{
                trialItems,
                addToHomeTrial,
                removeFromHomeTrial,
                clearHomeTrial,
                isValidTrial,
                itemCount,
                homeTrialCompleted,
                markHomeTrialCompleted,
            }}
        >
            {children}
        </HomeTrialContext.Provider>
    );
}

export function useHomeTrial() {
    const context = useContext(HomeTrialContext);
    if (context === undefined) {
        throw new Error('useHomeTrial must be used within a HomeTrialProvider');
    }
    return context;
}
