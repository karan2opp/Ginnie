"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function NaturalLanguage() {
  const [text, setText] = useState("");
  const fullText = '"Schedule a meeting with Rahul next Thursday and send a follow-up email."';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-8 py-32 z-10 flex flex-col md:flex-row items-center gap-16">
      
      {/* Left Column */}
      <div className="flex-1">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
          Natural Language,<br/>Real Power.
        </h2>
        <p className="text-zinc-400 text-lg mb-8 max-w-md">
          Speak to your inbox. Ginne understands context, stakeholders, and timing without needing rigid templates.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#22c55e] flex-shrink-0" fill="#22c55e" stroke="#000" />
            <span className="text-white font-medium">Meeting scheduled</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#22c55e] flex-shrink-0" fill="#22c55e" stroke="#000" />
            <span className="text-white font-medium">Calendar updated</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#22c55e] flex-shrink-0" fill="#22c55e" stroke="#000" />
            <span className="text-white font-medium">Email drafted</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#22c55e] flex-shrink-0" fill="#22c55e" stroke="#000" />
            <span className="text-white font-medium">Reminder created</span>
          </div>
        </div>
      </div>

      {/* Right Column - Terminal Mockup */}
      <div className="flex-1 w-full max-w-md">
        <div className="bg-[#111111] border border-zinc-800 rounded-3xl p-8 shadow-2xl relative">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="text-[#22c55e] text-lg font-mono leading-relaxed min-h-[150px]">
            {text}
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-5 bg-[#22c55e] ml-1 align-middle"
            />
          </div>
        </div>
      </div>

    </section>
  );
}
