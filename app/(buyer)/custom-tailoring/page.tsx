"use client";
import React, { useState, useEffect } from 'react';
import { useHomeTrial } from '@/context/HomeTrialContext';
import { 
  Scissors, Ruler, ShieldCheck, Clock, Award, Users, ArrowRight, Play, Quote, Star,
  Upload, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Check
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { demoOrders } from '@/data/orders';

// Map issues to dynamic options and guides
const ISSUE_TO_ALTERATION_MAP: Record<string, { types: string[]; defaultArea: string; measureLabel: string }> = {
  "Too Loose": {
    types: ["Waist Tightening", "Bust Adjustment", "Hip Adjustment", "Shoulder Adjustment", "Overall Fit Adjustment", "Other"],
    defaultArea: "Waist / Torso",
    measureLabel: "Waist/Bust width"
  },
  "Too Tight": {
    types: ["Waist Loosening", "Bust Adjustment", "Hip Adjustment", "Shoulder Adjustment", "Overall Fit Adjustment", "Other"],
    defaultArea: "Waist / Torso",
    measureLabel: "Waist/Bust width"
  },
  "Too Long": {
    types: ["Length Shortening", "Sleeve Length Adjustment", "Other"],
    defaultArea: "Hemline Length",
    measureLabel: "Hemline / Sleeves length"
  },
  "Too Short": {
    types: ["Length Increase (if possible)", "Sleeve Length Adjustment", "Other"],
    defaultArea: "Hemline Length",
    measureLabel: "Hemline / Sleeves length"
  },
  "Sleeve Fit Issue": {
    types: ["Sleeve Length Adjustment", "Overall Fit Adjustment", "Other"],
    defaultArea: "Sleeves",
    measureLabel: "Sleeve length"
  },
  "Shoulder Fit Issue": {
    types: ["Shoulder Adjustment", "Overall Fit Adjustment", "Other"],
    defaultArea: "Shoulders",
    measureLabel: "Shoulder width"
  },
  "Other": {
    types: [
      "Length Shortening",
      "Length Increase (if possible)",
      "Waist Tightening",
      "Waist Loosening",
      "Sleeve Length Adjustment",
      "Shoulder Adjustment",
      "Bust Adjustment",
      "Hip Adjustment",
      "Neckline Adjustment",
      "Overall Fit Adjustment",
      "Other"
    ],
    defaultArea: "Custom Area",
    measureLabel: "Measurement"
  }
};

const TailoringPage = () => {
  const { homeTrialCompleted, markHomeTrialCompleted } = useHomeTrial();
  const [activeStep, setActiveStep] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Alteration Request Flow Form State
  const [formStep, setFormStep] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState('ORD-8821');
  const [selectedProduct, setSelectedProduct] = useState('Product 1');
  const [selectedIssue, setSelectedIssue] = useState('');
  const [customIssue, setCustomIssue] = useState('');
  const [selectedAlterationType, setSelectedAlterationType] = useState('');
  const [customAlterationType, setCustomAlterationType] = useState('');
  
  const [areaToAlter, setAreaToAlter] = useState('');
  const [currentMeasurement, setCurrentMeasurement] = useState('');
  const [requiredMeasurement, setRequiredMeasurement] = useState('');
  const [description, setDescription] = useState('');
  const [fitPreference, setFitPreference] = useState('Regular Fit');
  
  const [refImageFitName, setRefImageFitName] = useState('');
  const [refImageWearName, setRefImageWearName] = useState('');
  const [isUploadingFit, setIsUploadingFit] = useState(false);
  const [isUploadingWear, setIsUploadingWear] = useState(false);
  const [uploadProgressFit, setUploadProgressFit] = useState(0);
  const [uploadProgressWear, setUploadProgressWear] = useState(0);
  
  const [timelineOption, setTimelineOption] = useState('Standard Timeline');
  const [specificDate, setSpecificDate] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tailoringSteps = [
    {
      number: "01",
      title: "Consultation",
      description: "Personal style consultation with master tailors",
      detail: "Begin your journey with an in-depth consultation where our master tailors understand your lifestyle, preferences, and vision for the perfect garment."
    },
    {
      number: "02", 
      title: "Measurements",
      description: "Precision body measurements with advanced techniques",
      detail: "Using time-honored techniques combined with modern precision, we capture over 40 individual measurements to ensure an impeccable fit."
    },
    {
      number: "03",
      title: "Design",
      description: "Custom design creation and fabric selection",
      detail: "Choose from our curated collection of premium fabrics and work with our designers to create a piece that reflects your unique style."
    },
    {
      number: "04",
      title: "Crafting",
      description: "Hand-crafted construction by master artisans",
      detail: "Each garment is meticulously crafted by hand, with attention to every detail, stitch, and finishing touch that defines true luxury."
    },
    {
      number: "05",
      title: "Fitting",
      description: "Multiple fittings for perfect refinement",
      detail: "Through careful fittings and adjustments, we ensure your garment achieves the perfect silhouette and comfort you deserve."
    }
  ];

  const testimonials = [
    {
      name: "Krishna Sahay",
      role: "Customer",
      quote: "The attention to detail is extraordinary. Every piece fits like it was made for me—because it was.",
      rating: 5
    },
    {
      name: "Priya Singh ",
      role: "Fashion Designer",
      quote: "Impeccable craftsmanship that rivals the finest European ateliers. Truly exceptional.",
      rating: 5
    },
    {
      name: "Sofia Saifi",
      role: "Customer",
      quote: "The quality and service exceeded every expectation. This is luxury tailoring at its finest.",
      rating: 5
    }
  ];

  useEffect(() => {
    if (!homeTrialCompleted) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % tailoringSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [homeTrialCompleted, tailoringSteps.length]);

  // Dynamically set default area and alteration type when issue changes
  useEffect(() => {
    if (selectedIssue && ISSUE_TO_ALTERATION_MAP[selectedIssue]) {
      const config = ISSUE_TO_ALTERATION_MAP[selectedIssue];
      setAreaToAlter(config.defaultArea);
      setSelectedAlterationType(config.types[0] || '');
    }
  }, [selectedIssue]);

  // Handle order product selection updates
  const orderProducts = React.useMemo(() => {
    const selectedRecord = demoOrders.find(o => o.id === selectedOrder);
    return selectedRecord ? selectedRecord.items.map(i => i.name) : [];
  }, [selectedOrder]);

  useEffect(() => {
    if (orderProducts.length > 0) {
      setSelectedProduct(orderProducts[0]);
    }
  }, [selectedOrder, orderProducts]);

  // Handle mock file uploads
  const handleSimulateUpload = (type: 'fit' | 'wear', fileName: string) => {
    if (type === 'fit') {
      setIsUploadingFit(true);
      setUploadProgressFit(0);
      setRefImageFitName(fileName);
      const interval = setInterval(() => {
        setUploadProgressFit(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploadingFit(false);
            return 100;
          }
          return prev + 25;
        });
      }, 200);
    } else {
      setIsUploadingWear(true);
      setUploadProgressWear(0);
      setRefImageWearName(fileName);
      const interval = setInterval(() => {
        setUploadProgressWear(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploadingWear(false);
            return 100;
          }
          return prev + 25;
        });
      }, 200);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setTrackingId(`ALT-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSubmitting(false);
      setFormStep(6);
    }, 1500);
  };

  const resetForm = () => {
    setFormStep(1);
    setSelectedIssue('');
    setSelectedAlterationType('');
    setCustomIssue('');
    setCustomAlterationType('');
    setAreaToAlter('');
    setCurrentMeasurement('');
    setRequiredMeasurement('');
    setDescription('');
    setFitPreference('Regular Fit');
    setRefImageFitName('');
    setRefImageWearName('');
    setTimelineOption('Standard Timeline');
    setSpecificDate('');
    setIsConfirmed(false);
    setTrackingId('');
  };

  if (!homeTrialCompleted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="bg-white max-w-xl w-full p-10 rounded-2xl shadow-xl border border-zinc-100 text-center">
          <div className="w-16 h-16 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Scissors className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif mb-4">Vogueish Tailoring — Access Restricted</h2>
          <p className="text-zinc-600 mb-8 leading-relaxed">
            Advanced tailoring and alteration services are available exclusively for clients who have completed a Vogueish Home Trial. Please complete your Home Trial service and verify with your stylist first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/home-trials" className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-md hover:bg-neutral-800 transition-colors">
              Schedule Home Trial
            </Link>
            <button 
              onClick={markHomeTrialCompleted}
              className="inline-flex items-center justify-center border-2 border-emerald-600 text-emerald-700 bg-emerald-50 px-6 py-3 rounded-md hover:bg-emerald-100/50 transition-colors font-medium"
            >
              Unrestricted Demo Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-100"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 text-center">
          <div className="animate-fadeInUp">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light mb-8 tracking-tight">
              Tailor Your
              <span className="block font-serif italic text-zinc-600">Perfection</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Where artisan craftsmanship meets modern precision. Elevate your wardrobe with adjustments tailored uniquely to your silhouette.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => {
                  document.getElementById('alteration-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group bg-black text-white px-12 py-4 hover:bg-neutral-800 transition-all duration-300 flex items-center gap-3 text-lg"
              >
                Request Alteration
                <Scissors className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </button>
              <button 
                onClick={() => setIsVideoPlaying(true)}
                className="group flex items-center gap-3 text-lg text-zinc-700 hover:text-black transition-colors"
              >
                <div className="w-16 h-16 rounded-full border-2 border-zinc-300 flex items-center justify-center group-hover:border-black transition-colors">
                  <Play className="w-6 h-6 ml-1" />
                </div>
                Watch Our Process
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 animate-float">
          <Scissors className="w-12 h-12 text-zinc-300 animate-pulse" />
        </div>
        <div className="absolute bottom-32 right-32 animate-float-delayed">
          <Ruler className="w-10 h-10 text-zinc-300" />
        </div>
      </section>

      {/* Alteration Form Section */}
      <section id="alteration-form" className="py-28 px-6 md:px-20 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/50">
              Vogueish Alteration Service
            </span>
            <h2 className="text-4xl md:text-5xl font-light mt-4 mb-4 tracking-tight">
              Alteration <span className="font-serif italic text-zinc-700">Request Flow</span>
            </h2>
            <p className="text-zinc-600 max-w-xl mx-auto text-sm md:text-base">
              Submit your specific adjustments below. We will handle courier coordination and route the garments to our tailoring experts.
            </p>
          </div>

          {/* Form Wizard Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden transition-all duration-300">
            
            {/* Step Indicators */}
            {formStep <= 5 && (
              <div className="border-b border-zinc-100 bg-zinc-50/50 px-8 py-5 flex items-center justify-between overflow-x-auto gap-4">
                {[
                  { label: "Product Info", stepNum: 1 },
                  { label: "Issue", stepNum: 2 },
                  { label: "Requirements", stepNum: 3 },
                  { label: "Timeline", stepNum: 4 },
                  { label: "Confirm", stepNum: 5 }
                ].map((s) => (
                  <div key={s.stepNum} className="flex items-center gap-2 flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                      formStep === s.stepNum 
                        ? 'bg-black text-white ring-4 ring-neutral-200' 
                        : formStep > s.stepNum 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-zinc-200 text-zinc-500'
                    }`}>
                      {formStep > s.stepNum ? <Check className="w-4 h-4" /> : s.stepNum}
                    </div>
                    <span className={`text-xs font-medium hidden sm:inline ${
                      formStep === s.stepNum ? 'text-black font-semibold' : 'text-zinc-500'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="p-8 md:p-10">

              {/* STEP 1: PRODUCT DETAILS */}
              {formStep === 1 && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">Select Your Product</h3>
                    <p className="text-xs text-zinc-500">Pick the recent order and the specific item you want altered.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2">Order ID</label>
                      <select 
                        value={selectedOrder}
                        onChange={(e) => setSelectedOrder(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      >
                        {demoOrders.map((o) => (
                          <option key={o.id} value={o.id}>{o.id} ({o.placedAt})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2">Product Name</label>
                      <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      >
                        {orderProducts.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Summary of Selected Order */}
                  <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900">Order Verification</h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        We loaded items from order <span className="font-semibold text-black">{selectedOrder}</span>. This request is linked to your account for safe shipping matching.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="bg-black hover:bg-neutral-800 text-white px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: ISSUE SELECTION & ALTERATION TYPE (DYNAMIC) */}
              {formStep === 2 && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">Identify the Issue</h3>
                    <p className="text-xs text-zinc-500">What issue are you facing with the outfit? Choose one to see recommended alterations.</p>
                  </div>

                  {/* Issue Cards Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: "Too Loose", label: "Too Loose" },
                      { value: "Too Tight", label: "Too Tight" },
                      { value: "Too Long", label: "Too Long" },
                      { value: "Too Short", label: "Too Short" },
                      { value: "Sleeve Fit Issue", label: "Sleeve Fit" },
                      { value: "Shoulder Fit Issue", label: "Shoulder Fit" },
                      { value: "Other", label: "Other / General" }
                    ].map((issue) => (
                      <button
                        key={issue.value}
                        type="button"
                        onClick={() => {
                          setSelectedIssue(issue.value);
                          if (issue.value !== 'Other') {
                            setCustomIssue('');
                          }
                        }}
                        className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                          selectedIssue === issue.value
                            ? 'border-black bg-neutral-900 text-white shadow-lg scale-[1.02]'
                            : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-700'
                        }`}
                      >
                        <span className="text-sm font-medium">{issue.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Issue Details */}
                  {selectedIssue === 'Other' && (
                    <div className="animate-fadeIn">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2">Specify the Issue</label>
                      <input
                        type="text"
                        required
                        value={customIssue}
                        onChange={(e) => setCustomIssue(e.target.value)}
                        placeholder="e.g., Fabric pinching or collar alignment issues"
                        className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                  )}

                  {/* DYNAMIC ALTERATION TYPE SECTION */}
                  {selectedIssue && (
                    <div className="space-y-4 pt-6 border-t border-zinc-100 animate-fadeIn">
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-950">Recommended Alteration Type</h4>
                        <p className="text-xs text-zinc-500">Based on your selection, select what needs adjustment:</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ISSUE_TO_ALTERATION_MAP[selectedIssue]?.types.map((type) => (
                          <label
                            key={type}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                              selectedAlterationType === type
                                ? 'border-black bg-zinc-50 font-semibold'
                                : 'border-zinc-200 bg-white hover:border-zinc-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="alterationType"
                              value={type}
                              checked={selectedAlterationType === type}
                              onChange={() => {
                                setSelectedAlterationType(type);
                                if (type !== 'Other') {
                                  setCustomAlterationType('');
                                }
                              }}
                              className="w-4 h-4 text-black focus:ring-black accent-black"
                            />
                            <span className="text-sm text-zinc-800">{type}</span>
                          </label>
                        ))}
                      </div>

                      {selectedAlterationType === 'Other' && (
                        <div className="pt-2 animate-fadeIn">
                          <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2">Specify Alteration Type</label>
                          <input
                            type="text"
                            required
                            value={customAlterationType}
                            onChange={(e) => setCustomAlterationType(e.target.value)}
                            placeholder="e.g., Narrow cuff, taper sleeves, collar lowering"
                            className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between pt-6 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="border border-zinc-300 hover:bg-zinc-50 text-zinc-700 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    <button
                      type="button"
                      disabled={!selectedIssue || !selectedAlterationType || (selectedIssue === 'Other' && !customIssue) || (selectedAlterationType === 'Other' && !customAlterationType)}
                      onClick={() => setFormStep(3)}
                      className="bg-black hover:bg-neutral-800 text-white px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: MEASUREMENTS & FIT PREFERENCE */}
              {formStep === 3 && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">Alteration Requirements</h3>
                    <p className="text-xs text-zinc-500">Provide measurements and write explicit instructions for our master tailor.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2">Area to be Altered</label>
                      <input
                        type="text"
                        required
                        value={areaToAlter}
                        onChange={(e) => setAreaToAlter(e.target.value)}
                        placeholder="e.g., Waistline, Hem, Sleeves"
                        className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2 flex items-center justify-between">
                        <span>Current (Optional)</span>
                        <span className="text-[10px] text-zinc-400 font-normal">inches</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentMeasurement}
                        onChange={(e) => setCurrentMeasurement(e.target.value)}
                        placeholder={ISSUE_TO_ALTERATION_MAP[selectedIssue]?.measureLabel ? `e.g. Current ${ISSUE_TO_ALTERATION_MAP[selectedIssue].measureLabel}` : "e.g., 34"}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2 flex items-center justify-between">
                        <span>Required Size</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">inches *</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={requiredMeasurement}
                        onChange={(e) => setRequiredMeasurement(e.target.value)}
                        placeholder="e.g., 32"
                        className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2">Detailed Description</label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., Please take in the waist by 2 inches. I'd like the hip area left as is. Ensure seams are pressed clean."
                      className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    />
                  </div>

                  {/* FIT PREFERENCE */}
                  <div className="pt-6 border-t border-zinc-100">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-zinc-950">Preferred Fit Silhouette</h4>
                      <p className="text-xs text-zinc-500">Select how loose or contoured you prefer the garment structure:</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { label: "Body Fit", desc: "Contoured" },
                        { label: "Slim Fit", desc: "Close-fitting" },
                        { label: "Regular Fit", desc: "Standard Comfort" },
                        { label: "Relaxed Fit", desc: "Loose Room" },
                        { label: "Oversized", desc: "Extra Baggy" }
                      ].map((fit) => (
                        <button
                          key={fit.label}
                          type="button"
                          onClick={() => setFitPreference(fit.label)}
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-center ${
                            fitPreference === fit.label
                              ? 'border-black bg-zinc-900 text-white shadow'
                              : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700'
                          }`}
                        >
                          <span className="text-xs font-semibold">{fit.label}</span>
                          <span className={`text-[10px] mt-0.5 ${fitPreference === fit.label ? 'text-zinc-300' : 'text-zinc-400'}`}>{fit.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="border border-zinc-300 hover:bg-zinc-50 text-zinc-700 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    <button
                      type="button"
                      disabled={!areaToAlter || !requiredMeasurement || !description}
                      onClick={() => setFormStep(4)}
                      className="bg-black hover:bg-neutral-800 text-white px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: TIMELINE & PHOTO UPLOAD */}
              {formStep === 4 && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">Upload References & Select Timeline</h3>
                    <p className="text-xs text-zinc-500">Provide photos to help our tailor inspect fit issues, and pick your processing timeline.</p>
                  </div>

                  {/* Reference Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Desired Fit */}
                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700">Reference of Desired Fit (Optional)</label>
                      <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 transition-colors bg-zinc-50/50 text-center relative cursor-pointer" onClick={() => handleSimulateUpload('fit', 'reference-fit-style.jpg')}>
                        <Upload className="w-6 h-6 mx-auto mb-2 text-zinc-400" />
                        <span className="text-xs font-medium text-zinc-700 block">Click to upload fit reference</span>
                        <span className="text-[10px] text-zinc-400 block mt-1">PNG, JPG up to 10MB</span>
                        {refImageFitName && (
                          <div className="mt-4 bg-white border border-zinc-200 rounded-xl p-3 flex items-center justify-between text-left shadow-sm">
                            <div className="truncate text-xs font-semibold text-zinc-800">{refImageFitName}</div>
                            {isUploadingFit ? (
                              <div className="text-[10px] text-zinc-500 font-semibold">{uploadProgressFit}%</div>
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image wearing */}
                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700">Image Wearing the Outfit (Optional)</label>
                      <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 transition-colors bg-zinc-50/50 text-center relative cursor-pointer" onClick={() => handleSimulateUpload('wear', 'user-fitting-photo.jpg')}>
                        <Upload className="w-6 h-6 mx-auto mb-2 text-zinc-400" />
                        <span className="text-xs font-medium text-zinc-700 block">Click to upload your fit photo</span>
                        <span className="text-[10px] text-zinc-400 block mt-1">Shows tailors where fabric pinches</span>
                        {refImageWearName && (
                          <div className="mt-4 bg-white border border-zinc-200 rounded-xl p-3 flex items-center justify-between text-left shadow-sm">
                            <div className="truncate text-xs font-semibold text-zinc-800">{refImageWearName}</div>
                            {isUploadingWear ? (
                              <div className="text-[10px] text-zinc-500 font-semibold">{uploadProgressWear}%</div>
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TIMELINE */}
                  <div className="pt-6 border-t border-zinc-100">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-zinc-950">Service Timeline</h4>
                      <p className="text-xs text-zinc-500">Pick when you need the alteration completed:</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: "Standard Timeline", fee: "Free", desc: "5-7 business days processing" },
                        { label: "Express Service", fee: "+₹350", desc: "2-3 business days delivery" },
                        { label: "Specific Date", fee: "Custom", desc: "Specify absolute target date" }
                      ].map((t) => (
                        <label
                          key={t.label}
                          className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                            timelineOption === t.label
                              ? 'border-black bg-zinc-50 shadow-sm'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-zinc-800">{t.label}</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{t.fee}</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-tight">{t.desc}</p>
                          <input
                            type="radio"
                            name="timelineOption"
                            value={t.label}
                            checked={timelineOption === t.label}
                            onChange={() => setTimelineOption(t.label)}
                            className="hidden"
                          />
                        </label>
                      ))}
                    </div>

                    {timelineOption === 'Specific Date' && (
                      <div className="mt-4 p-4 border border-zinc-200 rounded-2xl bg-zinc-50/50 animate-fadeIn">
                        <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2">Select Completion Date</label>
                        <input
                          type="date"
                          required
                          value={specificDate}
                          onChange={(e) => setSpecificDate(e.target.value)}
                          className="bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-6 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      className="border border-zinc-300 hover:bg-zinc-50 text-zinc-700 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    <button
                      type="button"
                      disabled={(timelineOption === 'Specific Date' && !specificDate)}
                      onClick={() => setFormStep(5)}
                      className="bg-black hover:bg-neutral-800 text-white px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & SUMMARY */}
              {formStep === 5 && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">Review Your Request</h3>
                    <p className="text-xs text-zinc-500">Check all alteration inputs before sending to our tailors.</p>
                  </div>

                  {/* Summary grid */}
                  <div className="border border-zinc-200 rounded-2xl divide-y divide-zinc-200 overflow-hidden shadow-sm bg-zinc-50/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Linked Order & Product</span>
                        <div className="text-sm font-semibold text-zinc-900 mt-0.5">{selectedProduct}</div>
                        <div className="text-xs text-zinc-500">Order Ref: {selectedOrder}</div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Fit Preference</span>
                        <div className="text-sm font-semibold text-zinc-900 mt-0.5">{fitPreference}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Issue / Custom Context</span>
                        <div className="text-sm font-semibold text-zinc-900 mt-0.5">{selectedIssue === 'Other' ? customIssue : selectedIssue}</div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Alteration Required</span>
                        <div className="text-sm font-semibold text-zinc-900 mt-0.5">{selectedAlterationType === 'Other' ? customAlterationType : selectedAlterationType}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Area to alter</span>
                        <div className="text-sm font-semibold text-zinc-900 mt-0.5">{areaToAlter}</div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Current Measurement</span>
                        <div className="text-sm font-semibold text-zinc-900 mt-0.5">{currentMeasurement ? `${currentMeasurement} in` : "Not provided"}</div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Required Size</span>
                        <div className="text-sm font-semibold text-emerald-700 font-bold mt-0.5">{requiredMeasurement} in</div>
                      </div>
                    </div>

                    <div className="p-4">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Special Instructions</span>
                      <p className="text-xs text-zinc-700 mt-1 leading-relaxed whitespace-pre-wrap">{description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Timeline Schedule</span>
                        <div className="text-sm font-semibold text-zinc-900 mt-0.5">{timelineOption}</div>
                        {timelineOption === 'Specific Date' && <div className="text-xs text-zinc-500">Deliver on/before {specificDate}</div>}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Images Uploaded</span>
                        <div className="text-xs text-zinc-600 mt-1 flex flex-col gap-1">
                          {refImageFitName && <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Reference Image</span>}
                          {refImageWearName && <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> User Fit Photo</span>}
                          {!refImageFitName && !refImageWearName && <span>None (Optional)</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Checkbox */}
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-zinc-200 bg-white cursor-pointer select-none hover:bg-zinc-50">
                    <input
                      type="checkbox"
                      required
                      checked={isConfirmed}
                      onChange={(e) => setIsConfirmed(e.target.checked)}
                      className="w-4 h-4 text-black focus:ring-black accent-black rounded mt-0.5"
                    />
                    <span className="text-xs text-zinc-700 leading-tight">
                      I confirm that the measurements and alteration details provided are accurate. I understand that subsequent adjustments cannot be guaranteed once crafting has commenced.
                    </span>
                  </label>

                  <div className="flex justify-between pt-6 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setFormStep(4)}
                      className="border border-zinc-300 hover:bg-zinc-50 text-zinc-700 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors animate-fadeIn"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={!isConfirmed || isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Alteration Request
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: SUCCESS SCREEN */}
              {formStep === 6 && (
                <div className="text-center py-10 space-y-6 animate-fadeIn">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  
                  <div className="max-w-md mx-auto">
                    <h3 className="text-2xl font-serif text-zinc-900">Request Registered!</h3>
                    <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                      Your tailoring order is locked. A courier has been assigned to collect your garment from your default office hub.
                    </p>
                  </div>

                  <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Tracking Reference:</span>
                      <span className="font-bold text-zinc-900 font-mono">{trackingId}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Linked Order:</span>
                      <span className="font-semibold text-zinc-900">{selectedOrder}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Timeline choice:</span>
                      <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">{timelineOption}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Pickup Location:</span>
                      <span className="font-semibold text-zinc-800">Ciena Gurugram Campus</span>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/my-orders" className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-neutral-800 transition-colors">
                      View My Orders
                    </Link>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center justify-center border border-zinc-200 text-zinc-700 px-6 py-3 rounded-full text-xs font-semibold hover:bg-zinc-50 transition-colors"
                    >
                      Request Another Alteration
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
              The Art of <span className="font-serif italic">Precision</span>
            </h2>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
              Our five-step process ensures every garment achieves the perfect balance of comfort, style, and sophistication.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Steps Navigation */}
            <div className="space-y-8">
              {tailoringSteps.map((step, index) => (
                <div
                  key={index}
                  className={`cursor-pointer transition-all duration-500 ${
                    activeStep === index ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-start gap-6">
                    <span className={`text-6xl font-light transition-colors duration-500 ${
                      activeStep === index ? 'text-black' : 'text-zinc-300'
                    }`}>
                      {step.number}
                    </span>
                    <div className="pt-2">
                      <h3 className="text-2xl font-medium mb-2">{step.title}</h3>
                      <p className="text-zinc-600 mb-3">{step.description}</p>
                      {activeStep === index && (
                        <p className="text-zinc-700 animate-fadeIn">{step.detail}</p>
                      )}
                    </div>
                  </div>
                  {activeStep === index && (
                    <div className="ml-20 mt-4 h-0.5 bg-black animate-expandWidth"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Visual Content */}
            <div className="relative">
              <div className="aspect-[4/5] bg-zinc-200 rounded-3xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-300 flex items-center justify-center">
                    <Image
                      src='/fashion.jpg'
                      alt='photo'
                      fill
                      className='rounded-3xl'
                    />
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                {tailoringSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      activeStep === index ? 'bg-black w-8' : 'bg-zinc-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 md:px-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                icon: <Scissors className="w-8 h-8" />,
                title: "Master Craftsmanship",
                description: "Over 200 hours of meticulous handwork goes into every piece, ensuring unparalleled quality and attention to detail."
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Timeless Design",
                description: "Classic silhouettes enhanced with contemporary touches create garments that transcend seasonal trends."
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Premium Materials",
                description: "Sourced from the finest mills in Italy, our fabrics represent the pinnacle of luxury and durability."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Personal Service",
                description: "Dedicated consultants guide you through every step, ensuring a truly personalized experience."
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Lifetime Guarantee",
                description: "We stand behind our craftsmanship with comprehensive alterations and maintenance services."
              },
              {
                icon: <Ruler className="w-8 h-8" />,
                title: "Perfect Fit",
                description: "Advanced measurement techniques ensure every garment fits your body perfectly, enhancing your natural silhouette."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-2xl"
              >
                <div className="mb-6 text-zinc-600 group-hover:text-black transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-4">{feature.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 md:px-20 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Client <span className="font-serif italic">Testimonials</span>
            </h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              Hear from our discerning clients who have experienced the pinnacle of tailoring excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-neutral-900 p-8 rounded-2xl hover:bg-neutral-800 transition-colors duration-300"
              >
                <Quote className="w-8 h-8 text-zinc-500 mb-6" />
                <p className="text-lg mb-6 leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-zinc-400 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-white text-white" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 md:px-20 bg-gradient-to-br from-zinc-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-light mb-8 tracking-tight">
            Ready to Experience
            <span className="block font-serif italic text-zinc-600">Tailoring Excellence?</span>
          </h2>
          <p className="text-xl text-zinc-600 mb-12 leading-relaxed">
            Begin your journey to owning garments that reflect your unique style and sophistication. Book your consultation today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href='/shop'>
            <button className="border-2 flex items-center gap-5 border-zinc-300 text-zinc-700 px-12 py-4 hover:border-black hover:text-black transition-all duration-300 text-lg">
              View Our Gallery
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-light">48h</div>
              <div className="text-zinc-600">Consultation Response</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-light">3-4 weeks</div>
              <div className="text-zinc-600">Completion Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-light">Lifetime</div>
              <div className="text-zinc-600">Service Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-6">
          <div className="relative max-w-4xl w-full aspect-video bg-neutral-900 rounded-2xl overflow-hidden">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 text-white hover:text-zinc-300 transition-colors z-10"
            >
              <div className="w-8 h-8 flex items-center justify-center">✕</div>
            </button>
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg opacity-70">Video not available for now </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-expandWidth {
          animation: expandWidth 0.5s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
};

export default TailoringPage;