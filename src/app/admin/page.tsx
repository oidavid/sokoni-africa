"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://watdsaazzjcsyvnpdthe.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPER_ADMIN_PASSWORD = "11881188";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type Role = "super_admin" | "manager" | "support" | "viewer";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  created_at: string;
  last_login?: string;
};

type Merchant = {
  id: string;
  business_name: string;
  business_type: string;
  country: string;
  is_published: boolean;
  created_at: string;
  slug: string;
  email?: string;
  status?: "active" | "suspended" | "terminated" | "flagged";
  admin_notes?: string;
  temp_password?: string;
};

type Stats = {
  totalMerchants: number;
  activeStores: number;
  newThisMonth: number;
  totalLeads: number;
  totalOrders: number;
  suspended: number;
  flagged: number;
};

type AuthState =
  | { type: "none" }
  | { type: "super_admin" }
  | { type: "staff"; user: AdminUser };

const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  manager: "Manager",
  support: "Support",
  viewer: "Viewer",
};

const ROLE_COLORS: Record<Role, string> = {
  super_admin: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  manager: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  support: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  viewer: "text-[#666] bg-white/5 border-white/10",
};

function canDo(auth: AuthState, action: string): boolean {
  if (auth.type === "super_admin") return true;
  if (auth.type === "none") return false;
  const role = auth.user.role;
  const perms: Record<string, Role[]> = {
    view: ["super_admin", "manager", "support", "viewer"],
    flag: ["super_admin", "manager", "support"],
    note: ["super_admin", "manager", "support"],
    reset_password: ["super_admin", "manager", "support"],
    suspend: ["super_admin", "manager"],
    view_revenue: ["super_admin", "manager"],
    terminate: ["super_admin"],
    manage_admins: ["super_admin"],
  };
  return (perms[action] || []).includes(role);
}

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>({ type: "none" });
  const [loginMode, setLoginMode] = useState<"super" | "staff">("super");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<"merchants" | "admins">("merchants");
  const [stats, setStats] = useState<Stats | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filtered, setFiltered] = useState<Merchant[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modals
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [modalType, setModalType] = useState<"actions" | "note" | "new_admin" | null>(null);
  const [noteText, setNoteText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  // New admin form
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "support" as Role, password: "" });

  const categories = [
    "all","Home","Auto","Beauty","Education","Coaching & Mentoring",
    "Health & Wellness","Mental Wellness","Domestic","Childcare & Nanny",
    "Food & Catering","Events","Digital & Tech","Transport","Agriculture",
  ];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [merchantsRes, leadsRes, ordersRes, adminsRes] = await Promise.all([
        supabase.from("merchants").select("*").order("created_at", { ascending: false }),
        supabase.from("leads").select("id", { count: "exact" }),
        supabase.from("orders").select("id", { count: "exact" }),
        supabase.from("admin_users").select("*").order("created_at", { ascending: false }),
      ]);

      const allMerchants: Merchant[] = merchantsRes.data || [];
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      setMerchants(allMerchants);
      setFiltered(allMerchants);
      setAdminUsers(adminsRes.data || []);
      setStats({
        totalMerchants: allMerchants.length,
        activeStores: allMerchants.filter((m) => m.is_published && m.status !== "suspended" && m.status !== "terminated").length,
        newThisMonth: allMerchants.filter((m) => new Date(m.created_at) >= startOfMonth).length,
        totalLeads: leadsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        suspended: allMerchants.filter((m) => m.status === "suspended").length,
        flagged: allMerchants.filter((m) => m.status === "flagged").length,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    if (loginMode === "super") {
      if (password === SUPER_ADMIN_PASSWORD) {
        setAuth({ type: "super_admin" });
        loadData();
      } else {
        setLoginError("Incorrect password.");
      }
      return;
    }

    // Staff login
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .eq("password_hash", password)
      .eq("active", true)
      .single();

    if (error || !data) {
      setLoginError("Invalid email or password.");
      return;
    }

    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", data.id);
    setAuth({ type: "staff", user: data });
    loadData();
  }

  useEffect(() => {
    let result = merchants;
    if (search) result = result.filter((m) =>
      m.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.country?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
    );
    if (filterCategory !== "all") result = result.filter((m) => m.business_type === filterCategory);
    if (filterCountry !== "all") result = result.filter((m) => m.country === filterCountry);
    if (filterStatus !== "all") result = result.filter((m) => (m.status || "active") === filterStatus);
    setFiltered(result);
  }, [search, filterCategory, filterCountry, filterStatus, merchants]);

  const uniqueCountries = ["all", ...Array.from(new Set(merchants.map((m) => m.country).filter(Boolean)))];

  async function handleMerchantAction(merchantId: string, action: string, value?: string) {
    setActionLoading(true);
    setActionMessage("");
    try {
      if (action === "suspend") {
        await supabase.from("merchants").update({ status: "suspended", is_published: false }).eq("id", merchantId);
        setActionMessage("Account suspended.");
      } else if (action === "unsuspend") {
        await supabase.from("merchants").update({ status: "active", is_published: true }).eq("id", merchantId);
        setActionMessage("Account reactivated.");
      } else if (action === "terminate") {
        await supabase.from("merchants").update({ status: "terminated", is_published: false }).eq("id", merchantId);
        setActionMessage("Account terminated.");
      } else if (action === "flag") {
        await supabase.from("merchants").update({ status: "flagged" }).eq("id", merchantId);
        setActionMessage("Account flagged for review.");
      } else if (action === "unflag") {
        await supabase.from("merchants").update({ status: "active" }).eq("id", merchantId);
        setActionMessage("Flag removed.");
      } else if (action === "note" && value) {
        const existing = merchants.find((m) => m.id === merchantId);
        const prev = existing?.admin_notes || "";
        const timestamp = new Date().toLocaleString("en-GB");
        const adminName = auth.type === "super_admin" ? "Super Admin" : (auth as { type: "staff"; user: AdminUser }).user.name;
        const updated = prev ? `${prev}\n[${timestamp} — ${adminName}]: ${value}` : `[${timestamp} — ${adminName}]: ${value}`;
        await supabase.from("merchants").update({ admin_notes: updated }).eq("id", merchantId);
        setActionMessage("Note saved.");
        setNoteText("");
        setModalType("actions");
      } else if (action === "reset_password") {
        const temp = Math.random().toString(36).slice(2, 10).toUpperCase();
        await supabase.from("merchants").update({ temp_password: temp }).eq("id", merchantId);
        setActionMessage(`Temporary password set: ${temp}`);
      }
      await loadData();
      if (selectedMerchant) {
        const updated = merchants.find((m) => m.id === merchantId);
        if (updated) setSelectedMerchant(updated);
      }
    } catch (err) {
      setActionMessage("Something went wrong.");
    }
    setActionLoading(false);
  }

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading(true);
    try {
      await supabase.from("admin_users").insert({
        name: newAdmin.name,
        email: newAdmin.email.toLowerCase().trim(),
        role: newAdmin.role,
        password_hash: newAdmin.password,
        active: true,
      });
      setNewAdmin({ name: "", email: "", role: "support", password: "" });
      setModalType(null);
      setActionMessage("Admin user created.");
      await loadData();
    } catch (err) {
      setActionMessage("Failed to create admin.");
    }
    setActionLoading(false);
  }

  async function toggleAdminActive(adminId: string, current: boolean) {
    await supabase.from("admin_users").update({ active: !current }).eq("id", adminId);
    await loadData();
  }

  const statusBadge = (status?: string) => {
    const map: Record<string, string> = {
      active: "text-emerald-400",
      suspended: "text-amber-400",
      terminated: "text-red-400",
      flagged: "text-orange-400",
    };
    const s = status || "active";
    return <span className={`font-mono text-xs ${map[s] || "text-[#555]"}`}>● {s}</span>;
  };

  // ── LOGIN SCREEN ──────────────────────────────────────────────
  if (auth.type === "none") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono">
        <div className="w-full max-w-sm px-8">
          <div className="mb-8 text-center">
            <span className="text-[11px] tracking-[0.3em] text-[#555] uppercase">Earket</span>
            <h1 className="text-white text-2xl font-semibold mt-1 tracking-tight">Admin Access</h1>
          </div>

          <div className="flex mb-6 bg-[#111] rounded-lg p-1 border border-[#1a1a1a]">
            {(["super", "staff"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setLoginMode(m); setLoginError(""); }}
                className={`flex-1 py-2 text-xs rounded-md transition-colors ${
                  loginMode === m ? "bg-white text-black font-semibold" : "text-[#555] hover:text-white"
                }`}
              >
                {m === "super" ? "Super Admin" : "Staff Login"}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            {loginMode === "staff" && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141414] border border-[#222] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#444] transition-colors"
                required
              />
            )}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#141414] border border-[#222] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#444] transition-colors"
              autoFocus
              required
            />
            {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-white text-black py-3 rounded-lg text-sm font-semibold hover:bg-[#e5e5e5] transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentRole = auth.type === "super_admin" ? "Super Admin" : ROLE_LABELS[(auth as { type: "staff"; user: AdminUser }).user.role];
  const currentName = auth.type === "super_admin" ? "Super Admin" : (auth as { type: "staff"; user: AdminUser }).user.name;

  // ── MAIN DASHBOARD ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.3em] text-[#555] uppercase font-mono">Earket</span>
          <span className="text-[#2a2a2a]">/</span>
          <span className="text-sm text-[#888]">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-mono ${
            auth.type === "super_admin" ? ROLE_COLORS.super_admin : ROLE_COLORS[(auth as { type: "staff"; user: AdminUser }).user.role]
          }`}>
            {currentRole}
          </span>
          <span className="text-xs text-[#444] font-mono">{currentName}</span>
          <button
            onClick={() => { setAuth({ type: "none" }); setPassword(""); setEmail(""); }}
            className="text-xs text-[#444] hover:text-white transition-colors font-mono"
          >
            sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-8">
              {[
                { label: "Total Merchants", value: stats?.totalMerchants ?? 0 },
                { label: "Live Stores", value: stats?.activeStores ?? 0, accent: "emerald" },
                { label: "New This Month", value: stats?.newThisMonth ?? 0 },
                ...(canDo(auth, "view_revenue") ? [
                  { label: "Total Leads", value: stats?.totalLeads ?? 0 },
                  { label: "Total Orders", value: stats?.totalOrders ?? 0 },
                ] : []),
                { label: "Suspended", value: stats?.suspended ?? 0, accent: "amber" },
                { label: "Flagged", value: stats?.flagged ?? 0, accent: "orange" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border p-4 ${
                  s.accent === "emerald" ? "border-emerald-500/30 bg-emerald-500/5" :
                  s.accent === "amber" ? "border-amber-500/30 bg-amber-500/5" :
                  s.accent === "orange" ? "border-orange-500/30 bg-orange-500/5" :
                  "border-[#1a1a1a] bg-[#111]"
                }`}>
                  <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                  <p className="text-[10px] text-[#555] mt-1 font-mono leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            {canDo(auth, "manage_admins") && (
              <div className="flex gap-1 mb-6 bg-[#111] rounded-lg p-1 border border-[#1a1a1a] w-fit">
                {(["merchants", "admins"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-5 py-2 text-xs rounded-md transition-colors capitalize ${
                      tab === t ? "bg-white text-black font-semibold" : "text-[#555] hover:text-white"
                    }`}
                  >
                    {t === "admins" ? "Admin Users" : "Merchants"}
                  </button>
                ))}
              </div>
            )}

            {/* ── MERCHANTS TAB ── */}
            {tab === "merchants" && (
              <>
                <div className="flex flex-wrap gap-3 mb-5">
                  <input
                    type="text"
                    placeholder="Search name, email, country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-[#111] border border-[#1e1e1e] text-white px-4 py-2 rounded-lg text-sm outline-none focus:border-[#333] transition-colors w-64 font-mono"
                  />
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-[#111] border border-[#1e1e1e] text-[#888] px-3 py-2 rounded-lg text-sm outline-none font-mono">
                    {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
                  </select>
                  <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}
                    className="bg-[#111] border border-[#1e1e1e] text-[#888] px-3 py-2 rounded-lg text-sm outline-none font-mono">
                    {uniqueCountries.map((c) => <option key={c} value={c}>{c === "all" ? "All Countries" : c}</option>)}
                  </select>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[#111] border border-[#1e1e1e] text-[#888] px-3 py-2 rounded-lg text-sm outline-none font-mono">
                    {["all","active","suspended","terminated","flagged"].map((s) => (
                      <option key={s} value={s}>{s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <span className="ml-auto text-xs text-[#444] self-center font-mono">{filtered.length} results</span>
                </div>

                <div className="rounded-xl border border-[#1a1a1a] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1a1a1a] bg-[#111]">
                        {["Business","Category","Country","Status","Joined","Store","Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[#444] font-mono font-normal">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={7} className="px-5 py-12 text-center text-[#444] font-mono text-xs">No merchants found.</td></tr>
                      ) : filtered.map((m, i) => (
                        <tr key={m.id} className={`border-b border-[#141414] hover:bg-[#111] transition-colors ${i % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#0a0a0a]"}`}>
                          <td className="px-4 py-3 font-medium text-white max-w-[160px] truncate">
                            {m.business_name || <span className="text-[#444]">—</span>}
                            {m.admin_notes && <span className="ml-1.5 text-[8px] text-amber-400 font-mono">NOTE</span>}
                          </td>
                          <td className="px-4 py-3 text-[#666] font-mono text-xs">{m.business_type || "—"}</td>
                          <td className="px-4 py-3 text-[#666] font-mono text-xs">{m.country || "—"}</td>
                          <td className="px-4 py-3">{statusBadge(m.status)}</td>
                          <td className="px-4 py-3 text-[#555] font-mono text-xs">
                            {m.created_at ? new Date(m.created_at).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {m.slug ? (
                              <a href={`https://earket.com/store/${m.slug}`} target="_blank" rel="noopener noreferrer"
                                className="text-[#555] hover:text-white font-mono text-xs underline underline-offset-4 transition-colors">
                                /{m.slug}
                              </a>
                            ) : <span className="text-[#333] font-mono text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => { setSelectedMerchant(m); setModalType("actions"); setActionMessage(""); }}
                              className="text-xs bg-[#1a1a1a] hover:bg-[#222] text-[#888] hover:text-white px-3 py-1.5 rounded-lg transition-colors font-mono"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── ADMIN USERS TAB ── */}
            {tab === "admins" && canDo(auth, "manage_admins") && (
              <>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-sm text-[#888] font-mono">{adminUsers.length} admin users</h2>
                  <button
                    onClick={() => setModalType("new_admin")}
                    className="text-xs bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#e5e5e5] transition-colors"
                  >
                    + Add Admin
                  </button>
                </div>
                <div className="rounded-xl border border-[#1a1a1a] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1a1a1a] bg-[#111]">
                        {["Name","Email","Role","Last Login","Status","Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[#444] font-mono font-normal">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((a, i) => (
                        <tr key={a.id} className={`border-b border-[#141414] ${i % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#0a0a0a]"}`}>
                          <td className="px-4 py-3 font-medium text-white">{a.name}</td>
                          <td className="px-4 py-3 text-[#666] font-mono text-xs">{a.email}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${ROLE_COLORS[a.role]}`}>
                              {ROLE_LABELS[a.role]}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#555] font-mono text-xs">
                            {a.last_login ? new Date(a.last_login).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "Never"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-mono text-xs ${a.active ? "text-emerald-400" : "text-[#444]"}`}>
                              ● {a.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleAdminActive(a.id, a.active)}
                              className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-mono ${
                                a.active
                                  ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              }`}
                            >
                              {a.active ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── MERCHANT ACTIONS MODAL ── */}
      {selectedMerchant && modalType === "actions" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-white font-semibold">{selectedMerchant.business_name}</h2>
                <p className="text-xs text-[#555] font-mono mt-0.5">{selectedMerchant.slug}</p>
              </div>
              <button onClick={() => { setSelectedMerchant(null); setModalType(null); setActionMessage(""); }}
                className="text-[#444] hover:text-white text-lg leading-none">✕</button>
            </div>

            <div className="mb-4">{statusBadge(selectedMerchant.status)}</div>

            {actionMessage && (
              <div className="mb-4 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg font-mono">
                {actionMessage}
              </div>
            )}

            {/* Temp password display */}
            {selectedMerchant.temp_password && (
              <div className="mb-4 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-lg font-mono">
                Temp password: <strong>{selectedMerchant.temp_password}</strong>
              </div>
            )}

            {/* Admin notes */}
            {selectedMerchant.admin_notes && (
              <div className="mb-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3">
                <p className="text-[10px] text-[#444] font-mono uppercase tracking-widest mb-2">Internal Notes</p>
                <p className="text-xs text-[#888] font-mono whitespace-pre-wrap">{selectedMerchant.admin_notes}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {canDo(auth, "reset_password") && (
                <button onClick={() => handleMerchantAction(selectedMerchant.id, "reset_password")}
                  disabled={actionLoading}
                  className="text-xs bg-[#1a1a1a] hover:bg-[#222] text-white px-4 py-2.5 rounded-lg transition-colors font-mono">
                  🔑 Reset Password
                </button>
              )}
              {canDo(auth, "flag") && (
                <button onClick={() => handleMerchantAction(selectedMerchant.id, selectedMerchant.status === "flagged" ? "unflag" : "flag")}
                  disabled={actionLoading}
                  className="text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-4 py-2.5 rounded-lg transition-colors font-mono">
                  {selectedMerchant.status === "flagged" ? "✓ Remove Flag" : "🚩 Flag Account"}
                </button>
              )}
              {canDo(auth, "note") && (
                <button onClick={() => setModalType("note")}
                  className="text-xs bg-[#1a1a1a] hover:bg-[#222] text-white px-4 py-2.5 rounded-lg transition-colors font-mono">
                  📝 Add Note
                </button>
              )}
              {canDo(auth, "suspend") && (
                <button onClick={() => handleMerchantAction(selectedMerchant.id, selectedMerchant.status === "suspended" ? "unsuspend" : "suspend")}
                  disabled={actionLoading}
                  className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2.5 rounded-lg transition-colors font-mono">
                  {selectedMerchant.status === "suspended" ? "✓ Unsuspend" : "⏸ Suspend"}
                </button>
              )}
              {canDo(auth, "terminate") && (
                <button onClick={() => { if (confirm("Terminate this account? This cannot be undone.")) handleMerchantAction(selectedMerchant.id, "terminate"); }}
                  disabled={actionLoading || selectedMerchant.status === "terminated"}
                  className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2.5 rounded-lg transition-colors font-mono col-span-2 disabled:opacity-40">
                  ✕ Terminate Account
                </button>
              )}
              <a href={`https://earket.com/store/${selectedMerchant.slug}`} target="_blank" rel="noopener noreferrer"
                className="text-xs bg-[#1a1a1a] hover:bg-[#222] text-[#888] px-4 py-2.5 rounded-lg transition-colors font-mono text-center col-span-2">
                ↗ View Live Store
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD NOTE MODAL ── */}
      {selectedMerchant && modalType === "note" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-sm">Add Internal Note</h2>
              <button onClick={() => setModalType("actions")} className="text-[#444] hover:text-white text-lg">✕</button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your note here..."
              rows={4}
              className="w-full bg-[#0d0d0d] border border-[#1a1a1a] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#333] transition-colors font-mono resize-none mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setModalType("actions")}
                className="flex-1 text-xs bg-[#1a1a1a] text-[#666] py-2.5 rounded-lg font-mono hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={() => handleMerchantAction(selectedMerchant.id, "note", noteText)}
                disabled={!noteText.trim() || actionLoading}
                className="flex-1 text-xs bg-white text-black py-2.5 rounded-lg font-semibold hover:bg-[#e5e5e5] transition-colors disabled:opacity-40">
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW ADMIN MODAL ── */}
      {modalType === "new_admin" && canDo(auth, "manage_admins") && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-sm">Add Admin User</h2>
              <button onClick={() => setModalType(null)} className="text-[#444] hover:text-white text-lg">✕</button>
            </div>
            <form onSubmit={handleCreateAdmin} className="space-y-3">
              <input type="text" placeholder="Full name" value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-[#1a1a1a] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#333] font-mono" required />
              <input type="email" placeholder="Email" value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-[#1a1a1a] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#333] font-mono" required />
              <input type="password" placeholder="Password" value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-[#1a1a1a] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#333] font-mono" required />
              <select value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as Role })}
                className="w-full bg-[#0d0d0d] border border-[#1a1a1a] text-[#888] px-4 py-3 rounded-lg text-sm outline-none focus:border-[#333] font-mono">
                <option value="viewer">Viewer — read only</option>
                <option value="support">Support — view, flag, notes, reset passwords</option>
                <option value="manager">Manager — support + suspend + revenue</option>
                <option value="super_admin">Super Admin — full access</option>
              </select>
              {actionMessage && <p className="text-xs text-emerald-400 font-mono">{actionMessage}</p>}
              <button type="submit" disabled={actionLoading}
                className="w-full bg-white text-black py-3 rounded-lg text-sm font-semibold hover:bg-[#e5e5e5] transition-colors disabled:opacity-40">
                Create Admin
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
