"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function InvoicePage() {
  const { id: orderId } = useParams() as { id: string };
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/invoices/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            setInvoice(data);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load invoice");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
        <FileText className="w-16 h-16 text-zinc-300 mb-4" />
        <h2 className="text-xl font-semibold text-zinc-900">No Invoice Found</h2>
        <p className="text-sm text-zinc-500 mt-2 text-center max-w-sm">
          This order might not have an invoice generated yet, or it was not paid via online payment.
        </p>
        <Link href="/my-orders" className="mt-6 px-6 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-zinc-800 transition">
          Back to Orders
        </Link>
      </div>
    );
  }

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 print:bg-white print:py-0 print:px-0">
      <div className="max-w-3xl mx-auto">
        
        {/* Controls - Hidden when printing */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
          <button
            onClick={printInvoice}
            className="flex items-center gap-2 text-sm font-semibold bg-black text-white px-5 py-2.5 rounded-full hover:bg-zinc-800 transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>

        {/* Invoice Paper */}
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden print:shadow-none print:border-none print:rounded-none">
          
          {/* Header */}
          <div className="p-8 sm:p-12 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-start gap-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-black tracking-tight">Vogueish</h1>
              <p className="text-sm text-zinc-500 mt-1">Premium Fashion & Tailoring</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {invoice.status}
              </span>
              <h2 className="text-2xl font-light text-zinc-900 tracking-tight">Invoice</h2>
              <p className="text-sm font-medium text-zinc-500 mt-1">{invoice.invoiceId}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="p-8 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-12 bg-zinc-50/50">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Billed To</p>
              <div className="text-sm text-zinc-800 space-y-1">
                <p className="font-semibold">{invoice.userEmail}</p>
                {invoice.billingAddress && (
                  <>
                    <p>{invoice.billingAddress.street}</p>
                    <p>{invoice.billingAddress.city}, {invoice.billingAddress.state} {invoice.billingAddress.zipCode}</p>
                    <p>{invoice.billingAddress.country}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Order Reference</p>
                <p className="text-sm font-semibold text-zinc-800">{invoice.orderId}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Issue Date</p>
                <p className="text-sm text-zinc-800">{new Date(invoice.issuedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              
              {/* Razorpay Meta */}
              <div className="p-4 bg-zinc-100/80 rounded-xl border border-zinc-200/60">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Transaction Details</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-zinc-500">Payment ID:</span>
                    <span className="text-xs font-mono text-zinc-700">{invoice.razorpayPaymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-zinc-500">Order ID (PG):</span>
                    <span className="text-xs font-mono text-zinc-700">{invoice.razorpayOrderId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-8 sm:p-12 border-t border-zinc-100">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Order Items</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="py-3 text-xs font-semibold text-zinc-500">Item</th>
                    <th className="py-3 text-xs font-semibold text-zinc-500 text-right">Qty</th>
                    <th className="py-3 text-xs font-semibold text-zinc-500 text-right">Price</th>
                    <th className="py-3 text-xs font-semibold text-zinc-500 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {invoice.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="group hover:bg-zinc-50/50 transition">
                      <td className="py-4 text-sm font-medium text-zinc-900">{item.name}</td>
                      <td className="py-4 text-sm text-zinc-600 text-right">{item.quantity}</td>
                      <td className="py-4 text-sm text-zinc-600 text-right">₹{item.price.toLocaleString()}</td>
                      <td className="py-4 text-sm font-medium text-zinc-900 text-right">₹{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-8 flex justify-end">
              <div className="w-full sm:w-1/2 md:w-1/3 space-y-3">
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Subtotal</span>
                  <span>₹{invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Shipping</span>
                  <span>₹{invoice.shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-600 pb-3 border-b border-zinc-200">
                  <span>Tax (18% GST)</span>
                  <span>₹{invoice.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-zinc-900 pt-1">
                  <span>Total Paid</span>
                  <span>₹{invoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 sm:p-12 bg-zinc-900 text-zinc-400 text-center text-xs">
            <p>Thank you for shopping with Vogueish!</p>
            <p className="mt-1">For any queries regarding this invoice, please contact support@vogueish.com</p>
          </div>

        </div>
      </div>
    </div>
  );
}
