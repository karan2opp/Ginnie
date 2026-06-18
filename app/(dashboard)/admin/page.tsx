import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { navLinks } from "@/lib/nav";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { desc } from "drizzle-orm";
import { AdminUserTable } from "./AdminUserTable";

export default async function AdminPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  if (!email || email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect("/chat");
  }

  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      <Sidebar currentPath="/admin" navLinks={navLinks} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="min-h-[80px] py-4 md:py-0 border-b border-neutral-800/60 bg-neutral-950 flex flex-col md:flex-row items-center justify-between px-4 md:px-10 gap-4 shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-white truncate">
            Admin Dashboard
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Users & Subscriptions</h2>
              <p className="text-neutral-500">Manage all registered users and their subscription plans.</p>
            </div>
            
            <AdminUserTable initialUsers={allUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}
