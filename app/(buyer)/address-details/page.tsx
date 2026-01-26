'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; // Ensure zod is installed or use standard validation
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone } from 'lucide-react';
import { toast } from 'sonner';

// Schema for validation
const addressSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    addressLine1: z.string().min(5, "Address is required"),
    pincode: z.string().min(6, "Valid pincode is required"),
    serviceType: z.enum(["Female", "Male"]),
    date: z.string().min(1, "Date is required"),
    timeSlot: z.string().min(1, "Time slot is required"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function AddressDetailsPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            serviceType: 'Female',
        },
    });

    const selectedServiceType = watch('serviceType');

    const onSubmit = async (data: AddressFormValues) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Save to local storage or context if needed (omitted for now)
        console.log('Booking Data:', data);

        toast.success('Address details saved!');
        router.push('/tracking');
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[#f9f8f6] py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/service-fees" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Service Fees
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-neutral-900 px-8 py-6">
                        <h1 className="text-2xl font-serif text-white">Book Your Home Trial</h1>
                        <p className="text-gray-400 mt-1">Enter your details for the stylist visit.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                        {/* Contact Details */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-gray-400" />
                                Contact Details
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        {...register('fullName')}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. Jane Doe"
                                    />
                                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        {...register('phone')}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 9876543210"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="pt-6 border-t border-gray-100">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                Delivery Address
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Street Address</label>
                                    <textarea
                                        {...register('addressLine1')}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all min-h-[100px]"
                                        placeholder="Flat / House No / Floor / Building"
                                    />
                                    {errors.addressLine1 && <p className="text-xs text-red-500">{errors.addressLine1.message}</p>}
                                </div>
                                <div className="w-full md:w-1/2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                                    <input
                                        {...register('pincode')}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 110001"
                                    />
                                    {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Service & Slot */}
                        <div className="pt-6 border-t border-gray-100">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-400" />
                                Service Preferences
                            </h2>

                            <div className="space-y-6">
                                {/* Service Type */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Stylist Preference</label>
                                    <div className="flex gap-4">
                                        {['Female', 'Male'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setValue('serviceType', type as 'Female' | 'Male')}
                                                className={`flex-1 py-3 px-4 rounded-lg border transition-all ${selectedServiceType === type
                                                        ? 'bg-black text-white border-black'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Date */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            Preferred Date
                                        </label>
                                        <input
                                            type="date"
                                            {...register('date')}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
                                    </div>

                                    {/* Time Slot */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            Time Slot
                                        </label>
                                        <select
                                            {...register('timeSlot')}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                                        >
                                            <option value="">Select a slot</option>
                                            <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                                            <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                                            <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                                            <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                                            <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                                        </select>
                                        {errors.timeSlot && <p className="text-xs text-red-500">{errors.timeSlot.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium tracking-wide hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
