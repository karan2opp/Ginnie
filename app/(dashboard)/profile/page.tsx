import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { Sidebar } from "@/components/Sidebar";
import { navLinks } from "@/lib/nav";
import Image from "next/image";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();

  // Fetch local user record for plan details
  const localUsers = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const localUser = localUsers[0];

  const plan = localUser?.plan || "free";
  const planExpiresAt = localUser?.planExpiresAt ? new Date(localUser.planExpiresAt).toLocaleDateString() : null;
  const createdAt = localUser?.createdAt ? new Date(localUser.createdAt).toLocaleDateString() : "Recently";

  // Plan styling details
  let planColor = "text-neutral-400";
  let planBg = "bg-neutral-800";
  let planBorder = "border-neutral-700";

  if (plan === "pro") {
    planColor = "text-indigo-400";
    planBg = "bg-indigo-500/10";
    planBorder = "border-indigo-500/30";
  } else if (plan === "elite") {
    planColor = "text-[#10b981]";
    planBg = "bg-[#10b981]/10";
    planBorder = "border-[#10b981]/30";
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      <Sidebar currentPath="/profile" navLinks={navLinks} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0a0a0a] custom-scrollbar relative">
        {/* Background glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-4xl w-full mx-auto px-6 py-12 relative z-10">
          
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">Your Profile</h1>
            <p className="text-neutral-500 text-lg">Manage your personal information and subscription plan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* User Details Card */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center text-center shadow-xl">
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-neutral-800 shadow-2xl relative z-10 bg-neutral-800 flex items-center justify-center">
                  {clerkUser?.imageUrl ? (
                    <img 
                      src={clerkUser.imageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-neutral-500">
                      {clerkUser?.firstName?.[0] || "?"}
                    </span>
                  )}
                </div>
                {/* Decorative ring */}
                <div className="absolute inset-[-10px] border border-neutral-800/60 rounded-full z-0" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">{clerkUser?.firstName} {clerkUser?.lastName}</h2>
              <p className="text-neutral-400 mb-6 font-medium">{clerkUser?.emailAddresses[0]?.emailAddress}</p>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent my-2" />

              <div className="w-full flex justify-between items-center py-4 text-sm">
                <span className="text-neutral-500">Member Since</span>
                <span className="text-white font-medium">{createdAt}</span>
              </div>
              <div className="w-full flex justify-between items-center py-4 border-t border-neutral-800/50 text-sm">
                <span className="text-neutral-500">Account ID</span>
                <span className="text-neutral-400 font-mono text-xs">{userId.split("_")[1] || userId.substring(0, 12)}...</span>
              </div>
            </div>

            {/* Plan Details Card */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div>
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center border border-neutral-700 shadow-inner">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border font-bold uppercase tracking-widest text-xs ${planBg} ${planColor} ${planBorder}`}>
                    {plan} Plan
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Current Plan</h3>
                <p className="text-neutral-400 relative z-10">
                  {plan === "elite" 
                    ? "You have unlocked the full potential of Ginnie AI." 
                    : plan === "pro" 
                    ? "You are on the Pro tier. Upgrade to Elite for unlimited power." 
                    : "You are currently on the Free tier with standard limits."}
                </p>
              </div>

              <div className="mt-10 relative z-10">
                <div className="bg-neutral-950/50 rounded-2xl p-5 border border-neutral-800/80">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-neutral-500">Billing Cycle</span>
                    <span className="text-white font-medium">Monthly</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <span className="text-neutral-500">Next Renewal</span>
                    <span className="text-white font-medium">{planExpiresAt || "N/A"}</span>
                  </div>
                </div>
                
                <button className="w-full mt-6 py-4 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  {plan === "elite" ? "Manage Subscription" : "Upgrade Plan"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
