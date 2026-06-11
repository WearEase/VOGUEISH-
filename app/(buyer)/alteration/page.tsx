"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Upload, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Check
} from "lucide-react";
import Link from "next/link";
import { demoOrders } from "@/data/orders";

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

function AlterationContent() {
  const searchParams = useSearchParams();

  // URL Params prefill
  const paramTrialId = searchParams.get("trialId") || "";
  const paramProductName = searchParams.get("productName") || "";

  // Alteration Request Flow Form State
  const [formStep, setFormStep] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState("ORD-8821");
  const [selectedProduct, setSelectedProduct] = useState("Product 1");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [customIssue, setCustomIssue] = useState("");
  const [selectedAlterationType, setSelectedAlterationType] = useState("");
  const [customAlterationType, setCustomAlterationType] = useState("");
  
  const [areaToAlter, setAreaToAlter] = useState("");
  const [currentMeasurement, setCurrentMeasurement] = useState("");
  const [requiredMeasurement, setRequiredMeasurement] = useState("");
  const [description, setDescription] = useState("");
  const [fitPreference, setFitPreference] = useState("Regular Fit");
  
  const [refImageFitName, setRefImageFitName] = useState("");
  const [refImageWearName, setRefImageWearName] = useState("");
  const [isUploadingFit, setIsUploadingFit] = useState(false);
  const [isUploadingWear, setIsUploadingWear] = useState(false);
  const [uploadProgressFit, setUploadProgressFit] = useState(0);
  const [uploadProgressWear, setUploadProgressWear] = useState(0);
  
  const [timelineOption, setTimelineOption] = useState("Standard Timeline");
  const [specificDate, setSpecificDate] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with URL query parameters if available
  useEffect(() => {
    if (paramTrialId) {
      setSelectedOrder(paramTrialId);
    }
    if (paramProductName) {
      setSelectedProduct(paramProductName);
    }
  }, [paramTrialId, paramProductName]);

  // Dynamically set default area and alteration type when issue changes
  useEffect(() => {
    if (selectedIssue && ISSUE_TO_ALTERATION_MAP[selectedIssue]) {
      const config = ISSUE_TO_ALTERATION_MAP[selectedIssue];
      setAreaToAlter(config.defaultArea);
      setSelectedAlterationType(config.types[0] || "");
    }
  }, [selectedIssue]);

  // Handle order product selection updates
  const orderProducts = useMemo(() => {
    // If it is a mock home trial, provide items or check demoOrders
    if (selectedOrder.startsWith("HT-")) {
      // Return mock list for the trial
      return [paramProductName || "Product A", "Product B"];
    }
    const selectedRecord = demoOrders.find(o => o.id === selectedOrder);
    return selectedRecord ? selectedRecord.items.map(i => i.name) : ["Product 1"];
  }, [selectedOrder, paramProductName]);

  useEffect(() => {
    if (orderProducts.length > 0 && !orderProducts.includes(selectedProduct)) {
      setSelectedProduct(orderProducts[0]);
    }
  }, [selectedOrder, orderProducts, selectedProduct]);

  // Handle mock file uploads
  const handleSimulateUpload = (type: "fit" | "wear", fileName: string) => {
    if (type === "fit") {
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
    setSelectedIssue("");
    setSelectedAlterationType("");
    setCustomIssue("");
    setCustomAlterationType("");
    setAreaToAlter("");
    setCurrentMeasurement("");
    setRequiredMeasurement("");
    setDescription("");
    setFitPreference("Regular Fit");
    setRefImageFitName("");
    setRefImageWearName("");
    setTimelineOption("Standard Timeline");
    setSpecificDate("");
    setIsConfirmed(false);
    setTrackingId("");
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/50">
            Vogueish Alteration Service
          </span>
          <h1 className="text-4xl md:text-5xl font-light mt-4 mb-4 tracking-tight">
            Alteration <span className="font-serif italic text-zinc-700">Request Flow</span>
          </h1>
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
                      ? "bg-black text-white ring-4 ring-neutral-200" 
                      : formStep > s.stepNum 
                        ? "bg-emerald-600 text-white" 
                        : "bg-zinc-200 text-zinc-500"
                  }`}>
                    {formStep > s.stepNum ? <Check className="w-4 h-4" /> : s.stepNum}
                  </div>
                  <span className={`text-xs font-medium hidden sm:inline ${
                    formStep === s.stepNum ? "text-black font-semibold" : "text-zinc-500"
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
                  <p className="text-xs text-zinc-500">Pick the recent trial and the specific item you want altered.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-700 mb-2">Home Trial ID / Order ID</label>
                    <input
                      type="text"
                      readOnly
                      value={selectedOrder}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-500 outline-none"
                    />
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
                    <h4 className="text-sm font-semibold text-zinc-900">Custom Tailoring Eligibility</h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      This request is linked to your home trial <span className="font-semibold text-black">{selectedOrder}</span>. Our tailoring expert will adjust this garment specifically for you.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-zinc-100">
                  <Link
                    href="/my-account#home-trials"
                    className="border border-zinc-300 hover:bg-zinc-50 text-zinc-700 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Profile
                  </Link>

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
                        if (issue.value !== "Other") {
                          setCustomIssue("");
                        }
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                        selectedIssue === issue.value
                          ? "border-black bg-neutral-900 text-white shadow-lg scale-[1.02]"
                          : "border-zinc-200 bg-white hover:border-zinc-400 text-zinc-700"
                      }`}
                    >
                      <span className="text-sm font-medium">{issue.label}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Issue Details */}
                {selectedIssue === "Other" && (
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
                              ? "border-black bg-zinc-50 font-semibold"
                              : "border-zinc-200 bg-white hover:border-zinc-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="alterationType"
                            value={type}
                            checked={selectedAlterationType === type}
                            onChange={() => {
                              setSelectedAlterationType(type);
                              if (type !== "Other") {
                                setCustomAlterationType("");
                              }
                            }}
                            className="w-4 h-4 text-black focus:ring-black accent-black"
                          />
                          <span className="text-sm text-zinc-800">{type}</span>
                        </label>
                      ))}
                    </div>

                    {selectedAlterationType === "Other" && (
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
                    disabled={!selectedIssue || !selectedAlterationType || (selectedIssue === "Other" && !customIssue) || (selectedAlterationType === "Other" && !customAlterationType)}
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
                            ? "border-black bg-zinc-900 text-white shadow"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span className="text-xs font-semibold">{fit.label}</span>
                        <span className={`text-[10px] mt-0.5 ${fitPreference === fit.label ? "text-zinc-300" : "text-zinc-400"}`}>{fit.desc}</span>
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
                    <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 transition-colors bg-zinc-50/50 text-center relative cursor-pointer" onClick={() => handleSimulateUpload("fit", "reference-fit-style.jpg")}>
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
                    <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 transition-colors bg-zinc-50/50 text-center relative cursor-pointer" onClick={() => handleSimulateUpload("wear", "user-fitting-photo.jpg")}>
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
                            ? "border-black bg-zinc-50 shadow-sm"
                            : "border-zinc-200 bg-white hover:border-zinc-300"
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

                  {timelineOption === "Specific Date" && (
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
                    disabled={(timelineOption === "Specific Date" && !specificDate)}
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
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Linked ID & Product</span>
                      <div className="text-sm font-semibold text-zinc-900 mt-0.5">{selectedProduct}</div>
                      <div className="text-xs text-zinc-500">Ref: {selectedOrder}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Fit Preference</span>
                      <div className="text-sm font-semibold text-zinc-900 mt-0.5">{fitPreference}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Issue / Custom Context</span>
                      <div className="text-sm font-semibold text-zinc-900 mt-0.5">{selectedIssue === "Other" ? customIssue : selectedIssue}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Alteration Required</span>
                      <div className="text-sm font-semibold text-zinc-900 mt-0.5">{selectedAlterationType === "Other" ? customAlterationType : selectedAlterationType}</div>
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
                      {timelineOption === "Specific Date" && <div className="text-xs text-zinc-500">Deliver on/before {specificDate}</div>}
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
                    Your tailoring order is locked. A courier has been assigned to collect your garment from your default address.
                  </p>
                </div>

                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Tracking Reference:</span>
                    <span className="font-bold text-zinc-900 font-mono">{trackingId}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Linked ID:</span>
                    <span className="font-semibold text-zinc-900">{selectedOrder}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Timeline choice:</span>
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">{timelineOption}</span>
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/my-account#home-trials" className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-neutral-800 transition-colors">
                    Back to Profile
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
    </div>
  );
}

export default function AlterationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading alteration form...</div>}>
      <AlterationContent />
    </Suspense>
  );
}
