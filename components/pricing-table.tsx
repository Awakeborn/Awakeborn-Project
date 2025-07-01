"use client";

import { useState } from "react";

const pricingPlans = [
  {
    name: "Freelancer",
    annual: 7,
    monthly: 9,
    description: "Freelancer includes:",
    features: [
      "50 users per month",
      "Email, Live Chat, WhatsApp",
      "Unlimited dashboards",
      "Custom integrations"
    ],
    popular: false
  },
  {
    name: "Small Team",
    annual: 27,
    monthly: 29,
    description: "Everything in Freelancer, plus:",
    features: [
      "No seat limits",
      "Real-time space syncing",
      "Automatic data enrichment",
      "Custom billing"
    ],
    popular: false
  },
  {
    name: "Business",
    annual: 47,
    monthly: 49,
    description: "Everything in Small Team, plus:",
    features: [
      "Adjustable permissions",
      "Unlimited reporting",
      "Bulk email sending",
      "Priority support"
    ],
    popular: true
  },
  {
    name: "Enterprise Team",
    annual: 87,
    monthly: 89,
    description: "Everything in Business, plus:",
    features: [
      "Strongest connection",
      "First calendar interaction",
      "Historical attributes",
      "Time comparisons"
    ],
    popular: false
  }
];

export default function PricingTable() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="w-full animate-fade-in-up">
      {/* Toggle */}
      <div className="flex justify-center mb-12">
        <label className="flex items-center gap-4 bg-gray-900/70 border border-purple-900/40 rounded-full px-4 py-2 shadow-md backdrop-blur-xl">
          <span className={`px-3 py-1 rounded-full transition-all duration-200 ${annual ? 'text-gray-200 bg-purple-900/30' : 'text-indigo-200/65'}`}>Billed Annually</span>
          <input
            type="checkbox"
            className="sr-only"
            checked={annual}
            onChange={() => setAnnual(!annual)}
          />
          <span className="relative w-12 h-6 flex items-center bg-gray-800 rounded-full p-1 transition-all duration-200 border border-purple-900/30">
            <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${annual ? 'translate-x-0' : 'translate-x-6'}`}></span>
          </span>
          <span className={`px-3 py-1 rounded-full transition-all duration-200 ${!annual ? 'text-gray-200 bg-purple-900/30' : 'text-indigo-200/65'}`}>Billed Monthly</span>
        </label>
      </div>
      {/* Pricing grid */}
      <div className="mx-auto grid max-w-xs gap-8 sm:max-w-2xl sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-2 xl:max-w-7xl xl:grid-cols-4">
        {pricingPlans.map((plan, idx) => (
          <div
            key={plan.name}
            className={`relative flex flex-col h-full rounded-2xl bg-gray-950/80 border border-purple-900/40 shadow-2xl p-8 backdrop-blur-xl transition-all duration-300 hover:shadow-purple-500/20 hover:scale-[1.03] group animate-fade-in ${plan.popular ? 'ring-2 ring-purple-400/40' : ''}`}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute -top-4 right-4 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg animate-fade-in-up">Popular</div>
            )}
            {/* Header */}
            <div className="mb-6 border-b border-purple-900/20 pb-6">
              <h3 className="font-nacelle text-xl font-semibold text-gray-200 mb-2">{plan.name}</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl text-indigo-200/65">$</span>
                <span className="text-4xl font-bold tabular-nums text-gray-200 transition-all duration-300">{annual ? plan.annual : plan.monthly}</span>
              </div>
              <p className="text-sm text-indigo-200/65 mb-4">Per user/month, billed {annual ? 'annually' : 'monthly'}.</p>
              <a
                href="#0"
                className={`w-full py-3 px-4 rounded-xl font-bold shadow-lg transition-all duration-200 text-white text-lg mt-2 bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 cursor-pointer ring-1 ring-inset ring-purple-400/20 hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 relative ${plan.popular ? 'ring-2 ring-purple-400/40' : ''}`}
              >
                Start free trial
              </a>
            </div>
            {/* Features */}
            <div className="flex-1">
              <p className="mb-4 text-sm italic text-gray-200">{plan.description}</p>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="mr-3 h-4 w-4 shrink-0 fill-current text-indigo-500" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" /></svg>
                    <span className="text-sm text-indigo-200/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
