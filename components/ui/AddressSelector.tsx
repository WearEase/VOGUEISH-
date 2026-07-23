/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

interface AddressSelectorProps {
  onSelectAddress: (address: Address) => void;
  selectedAddressId?: string;
}

export default function AddressSelector({ onSelectAddress, selectedAddressId }: AddressSelectorProps) {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({ country: 'India' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchAddresses();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
        // Automatically select the first address or default address if none selected
        if (data.addresses.length > 0 && !selectedAddressId) {
          const defaultAddr = data.addresses.find((a: Address) => a.isDefault) || data.addresses[0];
          onSelectAddress(defaultAddr);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      });

      if (res.ok) {
        const data = await res.json();
        setAddresses([...addresses, data.address]);
        setIsAddingNew(false);
        onSelectAddress(data.address);
        toast.success('Address saved successfully!');
        setNewAddress({ country: 'India' });
      } else {
        toast.error('Failed to save address.');
      }
    } catch (error) {
      toast.error('An error occurred while saving the address.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse flex gap-4 overflow-x-auto pb-4"><div className="w-64 h-32 bg-gray-200 rounded-xl"></div></div>;
  }

  if (!session?.user) {
    return null; // Don't show saved addresses if not logged in
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900">Select Delivery Address</h3>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {addresses.map((address, index) => {
          const isSelected = selectedAddressId === address._id || (!selectedAddressId && addresses.indexOf(address) === 0);
          return (
            <div 
              key={address._id || index}
              onClick={() => onSelectAddress(address)}
              className={`min-w-[280px] cursor-pointer rounded-xl border-2 p-4 transition-all snap-start relative ${isSelected ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-black text-white rounded-full p-1">
                  <Check className="w-3 h-3" />
                </div>
              )}
              {address.isDefault && <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700 mb-2 inline-block">Default</span>}
              <p className="font-medium text-gray-900 line-clamp-1">{address.street}</p>
              <p className="text-sm text-gray-500 mt-1">{address.city}, {address.state}</p>
              <p className="text-sm text-gray-500">{address.postalCode}, {address.country}</p>
            </div>
          );
        })}
        
        <div 
          onClick={() => setIsAddingNew(!isAddingNew)}
          className={`min-w-[280px] cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all snap-start ${isAddingNew ? 'border-black text-black bg-gray-50' : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:bg-gray-50'}`}
        >
          <Plus className="w-6 h-6 mb-2" />
          <span className="font-medium">Add New Address</span>
        </div>
      </div>

      {isAddingNew && (
        <form onSubmit={handleSaveNewAddress} className="bg-white p-6 rounded-xl border border-gray-200 mt-4 animate-in fade-in slide-in-from-top-4">
          <h4 className="font-medium mb-4 text-gray-900">New Address Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
              <input required type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border" value={newAddress.street || ''} onChange={e => setNewAddress({...newAddress, street: e.target.value})} placeholder="Flat / House No / Street" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input required type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border" value={newAddress.city || ''} onChange={e => setNewAddress({...newAddress, city: e.target.value})} placeholder="City" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input required type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border" value={newAddress.state || ''} onChange={e => setNewAddress({...newAddress, state: e.target.value})} placeholder="State" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode / ZIP *</label>
              <input required type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border" value={newAddress.postalCode || ''} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} placeholder="Pincode" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border" value={newAddress.country || 'India'} onChange={e => setNewAddress({...newAddress, country: e.target.value})} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddingNew(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-neutral-800 disabled:opacity-70">{isSaving ? 'Saving...' : 'Save & Select Address'}</button>
          </div>
        </form>
      )}
    </div>
  );
}

