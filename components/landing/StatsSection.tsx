export function StatsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-8 py-32 z-10 border-t border-zinc-800/50">
      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-y-24 gap-x-12 max-w-3xl mx-auto text-center">
        
        <div className="flex flex-col items-center">
          <div className="text-5xl md:text-6xl font-bold text-[#22c55e] mb-4 tracking-tight">10k+</div>
          <div className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">Enterprise Users</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">2.4M</div>
          <div className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">Emails Processed</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">85%</div>
          <div className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">Time Saved</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">99.9%</div>
          <div className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">Uptime SLA</div>
        </div>

      </div>

    </section>
  );
}
