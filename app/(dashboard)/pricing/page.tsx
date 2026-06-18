"use client";

import { useState } from "react";
import Script from "next/script";
import { Sidebar } from "@/components/Sidebar";
import { navLinks } from "@/lib/nav";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: 'pro' | 'elite') => {
    try {
      setLoading(plan);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Ginnie AI",
        description: `Upgrade to ${plan.toUpperCase()} Plan`,
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await fetch('/api/webhooks/razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful! Your plan has been upgraded.");
            window.location.reload();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: data.user.name,
          email: data.user.email,
        },
        theme: {
          color: "#10b981"
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      <Sidebar currentPath="/pricing" navLinks={navLinks} />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
        <header className="px-10 py-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">Upgrade Your Plan</h1>
          <p className="text-neutral-500 font-medium text-lg">Get more out of Ginnie AI with higher request limits.</p>
        </header>

        <main className="px-10 pb-10 flex flex-col sm:flex-row gap-6 max-w-6xl">
          
          {/* FREE PLAN */}
          <div className="flex-1 bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-8 flex flex-col relative overflow-hidden group">
            <h2 className="text-2xl font-bold text-white mb-2">Free</h2>
            <div className="text-4xl font-bold text-white mb-4">₹0<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
            <p className="text-neutral-400 text-sm mb-6 flex-1">Basic access to Ginnie AI features.</p>
            <ul className="space-y-3 text-sm text-neutral-300 mb-8">
              <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> 30 AI Requests per day</li>
              <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Standard response speed</li>
              <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Calendar & Gmail integration</li>
            </ul>
            <button disabled className="w-full py-3 rounded-xl bg-neutral-800 text-neutral-400 font-semibold cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="flex-1 bg-neutral-900/60 border border-[#10b981]/50 rounded-2xl p-8 flex flex-col relative overflow-hidden group transform hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.1)]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#10b981] to-emerald-400"></div>
            <h2 className="text-2xl font-bold text-[#10b981] mb-2">Pro</h2>
            <div className="text-4xl font-bold text-white mb-4">₹500<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
            <p className="text-neutral-400 text-sm mb-6 flex-1">Perfect for professionals who need more power.</p>
            <ul className="space-y-3 text-sm text-neutral-300 mb-8">
              <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> 150 AI Requests per day</li>
              <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Fast response speed</li>
              <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Priority support</li>
            </ul>
            <button 
              onClick={() => handleUpgrade('pro')}
              disabled={loading !== null}
              className="w-full py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-semibold transition-colors"
            >
              {loading === 'pro' ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* ELITE PLAN */}
          <div className="flex-1 bg-neutral-900/30 border border-purple-500/30 rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <h2 className="text-2xl font-bold text-purple-400 mb-2">Elite</h2>
            <div className="text-4xl font-bold text-white mb-4">₹1000<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
            <p className="text-neutral-400 text-sm mb-6 flex-1">Unlimited power for heavy users and executives.</p>
            <ul className="space-y-3 text-sm text-neutral-300 mb-8">
              <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Unlimited AI Requests</li>
              <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Fastest response speed</li>
              <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Premium support</li>
            </ul>
            <button 
              onClick={() => handleUpgrade('elite')}
              disabled={loading !== null}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
            >
              {loading === 'elite' ? 'Processing...' : 'Upgrade to Elite'}
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
