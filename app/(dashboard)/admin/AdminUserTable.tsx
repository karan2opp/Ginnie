"use client";

import { useState } from "react";
import { updateUserPlan } from "./actions";

type User = {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  planExpiresAt: Date | null;
  createdAt: Date;
};

export function AdminUserTable({ initialUsers }: { initialUsers: User[] }) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newPlan, setNewPlan] = useState<'free' | 'pro' | 'elite'>('free');
  const [newExpiration, setNewExpiration] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setNewPlan(user.plan as any);
    if (user.planExpiresAt) {
      // Format as YYYY-MM-DD for date input
      setNewExpiration(new Date(user.planExpiresAt).toISOString().split('T')[0]);
    } else {
      setNewExpiration('');
    }
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setLoading(true);
    try {
      await updateUserPlan(editingUser.id, newPlan, newExpiration || null);
      setEditingUser(null);
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#141414] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-[#0a0a0a] text-neutral-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Plan</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Expires At</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {initialUsers.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-neutral-200 font-medium">{u.name || "Anonymous"}</div>
                    <div className="text-neutral-500 text-xs mt-0.5">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      u.plan === 'elite' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      u.plan === 'pro' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-neutral-800 text-neutral-400'
                    }`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.planExpiresAt ? new Date(u.planExpiresAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEditModal(u)}
                      className="text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#222] flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Edit Subscription</h3>
              <button onClick={() => setEditingUser(null)} className="text-neutral-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm text-neutral-500 mb-1">User</p>
                <p className="text-neutral-200 font-medium">{editingUser.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Plan Level</label>
                <select 
                  value={newPlan} 
                  onChange={e => setNewPlan(e.target.value as any)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="elite">Elite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Expiration Date (Optional)</label>
                <input 
                  type="date" 
                  value={newExpiration} 
                  onChange={e => setNewExpiration(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="p-6 border-t border-[#222] flex justify-end gap-3 bg-[#0a0a0a]">
              <button 
                onClick={() => setEditingUser(null)}
                className="px-5 py-2.5 rounded-xl font-medium text-neutral-400 hover:text-white hover:bg-[#222] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl font-bold bg-[#10b981] hover:bg-emerald-400 text-black shadow-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
