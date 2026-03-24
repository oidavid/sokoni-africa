"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://watdsaazzjcsyvnpdthe.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPER_ADMIN_PASSWORD = "11881188";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type Role = "super_admin" | "manager" | "support" | "viewer";
type AuthState = { type: "none" } | { type: "super_admin" } | { type: "staff"; user: AdminUser };

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
  category?: string;
  country: string;
  is_published: boolean;
  created_at: string;
  slug: string;
  email?: string;
  phone?: string;
  owner_name?: string;
  status?: string;
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

const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  manager: "Manager",
  support: "Support",
  viewer: "Viewer",
};

const ROLE_COLORS: Record<Role, string> = {
  super_admin: "text-amber-500 bg-amber-400/10 border-amber-400/20",
  manager: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  support: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  viewer: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

function canDo(auth: AuthState, action: string): boolean {
  if (auth.type === "super_admin") return true;
  if (auth.type === "none") return false;
  const role = (auth as { type: "staff"; user: AdminUser }).user.role;
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
  const [dark, setDark] = useState(true);
  const [auth, setAuth] = useState<AuthState>({ type: "none" });
  const [loginMode, setLoginMode] = useState<"super" | "staff">("super");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<"merchants" | "admins" | "announcements" | "intelligence" | "pro">("merchants");
  const [stats, setStats] = useState<Stats | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filtered, setFiltered] = useState<Merchant[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [modalType, setModalType] = useState<"actions" | "note" | "new_admin" | null>(null);
  const [noteText, setNoteText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "support" as Role, password: "" });

  // Announcements
  const [announcements, setAnnouncements] = useState<{id:string;message:string;type:string;active:boolean;created_at:string}[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [announcementType, setAnnouncementType] = useState<"info"|"warning"|"success"|"promo">("info");
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [proWaitlist, setProWaitlist] = useState<{id:string;business_name:string;email:string;created_at:string}[]>([]);

  // Broadcast state
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastChannel, setBroadcastChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState<"all" | "filtered" | "custom">("filtered");
  const [broadcastDone, setBroadcastDone] = useState(false);

  const businessTypes = ["all", ...Array.from(new Set(merchants.map(m => m.business_type).filter(Boolean))).sort()];
  const categories = ["all", ...Array.from(new Set(merchants.map(m => m.category).filter(Boolean))).sort()];

  // ── THEME ──────────────────────────────────────────────────────
  const d = dark;
  const th = {
    page:        d ? "bg-[#0a0a0a] text-white"        : "bg-[#f4f4f4] text-[#111]",
    header:      d ? "border-[#1a1a1a]"               : "border-[#e0e0e0] bg-white",
    surface:     d ? "bg-[#111] border-[#1a1a1a]"     : "bg-white border-[#e5e5e5]",
    surface2:    d ? "bg-[#0d0d0d]"                   : "bg-[#fafafa]",
    input:       d ? "bg-[#141414] border-[#252525] text-white placeholder-[#444] focus:border-[#444]"
                   : "bg-white border-[#ddd] text-[#111] placeholder-[#aaa] focus:border-[#aaa]",
    select:      d ? "bg-[#111] border-[#1e1e1e] text-[#999]" : "bg-white border-[#ddd] text-[#666]",
    btn:         d ? "bg-[#1a1a1a] hover:bg-[#252525] text-white" : "bg-[#efefef] hover:bg-[#e5e5e5] text-[#111]",
    row0:        d ? "bg-[#0d0d0d]"                   : "bg-white",
    row1:        d ? "bg-[#0a0a0a]"                   : "bg-[#fafafa]",
    rowHover:    d ? "hover:bg-[#131313]"             : "hover:bg-[#f0f0f0]",
    rowBorder:   d ? "border-[#141414]"               : "border-[#efefef]",
    thead:       d ? "bg-[#111] border-[#1a1a1a]"     : "bg-[#f5f5f5] border-[#e5e5e5]",
    theadText:   d ? "text-[#555]"                    : "text-[#999]",
    muted:       d ? "text-[#666]"                    : "text-[#999]",
    faint:       d ? "text-[#444]"                    : "text-[#ccc]",
    bodyText:    d ? "text-white"                     : "text-[#111]",
    modal:       d ? "bg-[#111] border-[#222]"        : "bg-white border-[#e0e0e0]",
    modalInput:  d ? "bg-[#0d0d0d] border-[#1a1a1a] text-white focus:border-[#333]"
                   : "bg-[#f5f5f5] border-[#ddd] text-[#111] focus:border-[#aaa]",
    tab:         d ? "bg-[#111] border-[#1a1a1a]"     : "bg-[#e8e8e8] border-[#ddd]",
    tabActive:   d ? "bg-white text-black"             : "bg-[#111] text-white",
    tabInactive: d ? "text-[#555] hover:text-white"   : "text-[#888] hover:text-[#111]",
    noteBox:     d ? "bg-[#0d0d0d] border-[#1a1a1a]" : "bg-[#f5f5f5] border-[#ddd]",
    noteText:    d ? "text-[#888]"                    : "text-[#555]",
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [merchantsRes, leadsRes, ordersRes, adminsRes, announcementsRes, waitlistRes] = await Promise.all([
        supabase.from("merchants").select("*").order("created_at", { ascending: false }),
        supabase.from("leads").select("id", { count: "exact" }),
        supabase.from("orders").select("id", { count: "exact" }),
        supabase.from("admin_users").select("*").order("created_at", { ascending: false }),
        supabase.from("announcements").select("*").order("created_at", { ascending: false }),
        supabase.from("pro_waitlist").select("*").order("created_at", { ascending: false }),
      ]);
      const all: Merchant[] = merchantsRes.data || [];
      const now = new Date();
      const som = new Date(now.getFullYear(), now.getMonth(), 1);
      setMerchants(all);
      setFiltered(all);
      setAdminUsers(adminsRes.data || []);
      setAnnouncements(announcementsRes.data || []);
      setProWaitlist(waitlistRes.data || []);
      setStats({
        totalMerchants: all.length,
        activeStores: all.filter(m => m.is_published && m.status !== "suspended" && m.status !== "terminated").length,
        newThisMonth: all.filter(m => new Date(m.created_at) >= som).length,
        totalLeads: leadsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        suspended: all.filter(m => m.status === "suspended").length,
        flagged: all.filter(m => m.status === "flagged").length,
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (loginMode === "super") {
      if (password === SUPER_ADMIN_PASSWORD) { setAuth({ type: "super_admin" }); loadData(); }
      else setLoginError("Incorrect password.");
      return;
    }
    const { data, error } = await supabase.from("admin_users").select("*")
      .eq("email", email.toLowerCase().trim()).eq("password_hash", password).eq("active", true).single();
    if (error || !data) { setLoginError("Invalid email or password."); return; }
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", data.id);
    setAuth({ type: "staff", user: data });
    loadData();
  }

  useEffect(() => {
    let r = merchants;
    if (search) r = r.filter(m =>
      m.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.country?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search) ||
      m.owner_name?.toLowerCase().includes(search.toLowerCase())
    );
    if (filterType !== "all") r = r.filter(m => m.business_type === filterType);
    if (filterCategory !== "all") r = r.filter(m => m.category === filterCategory);
    if (filterCountry !== "all") r = r.filter(m => m.country === filterCountry);
    if (filterStatus !== "all") r = r.filter(m => (m.status || "active") === filterStatus);
    setFiltered(r);
  }, [search, filterType, filterCategory, filterCountry, filterStatus, merchants]);

  const uniqueCountries = ["all", ...Array.from(new Set(merchants.map(m => m.country).filter(Boolean)))];

  async function handleAction(merchantId: string, action: string, value?: string) {
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
        const existing = merchants.find(m => m.id === merchantId);
        const prev = existing?.admin_notes || "";
        const ts = new Date().toLocaleString("en-GB");
        const who = auth.type === "super_admin" ? "Super Admin" : (auth as { type: "staff"; user: AdminUser }).user.name;
        const updated = prev ? `${prev}\n[${ts} — ${who}]: ${value}` : `[${ts} — ${who}]: ${value}`;
        await supabase.from("merchants").update({ admin_notes: updated }).eq("id", merchantId);
        setActionMessage("Note saved.");
        setNoteText("");
        setModalType("actions");
      } else if (action === "reset_password") {
        const temp = Math.random().toString(36).slice(2, 10).toUpperCase();
        await supabase.from("merchants").update({ temp_password: temp }).eq("id", merchantId);
        setActionMessage(`Temporary password: ${temp}`);
      }
      await loadData();
    } catch { setActionMessage("Something went wrong."); }
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
      await loadData();
    } catch { setActionMessage("Failed to create admin."); }
    setActionLoading(false);
  }

  async function toggleAdminActive(id: string, current: boolean) {
    await supabase.from("admin_users").update({ active: !current }).eq("id", id);
    await loadData();
  }

  const statusBadge = (status?: string) => {
    const map: Record<string, string> = {
      active: "text-emerald-500",
      suspended: "text-amber-400",
      terminated: "text-red-400",
      flagged: "text-orange-400",
    };
    const s = status || "active";
    return <span className={`font-mono text-sm ${map[s] || "text-gray-400"}`}>● {s}</span>;
  };

  const currentRole = auth.type === "super_admin" ? "Super Admin" : ROLE_LABELS[(auth as { type: "staff"; user: AdminUser }).user?.role];
  const currentName = auth.type === "super_admin" ? "Super Admin" : (auth as { type: "staff"; user: AdminUser }).user?.name;

  // ── LOGIN ─────────────────────────────────────────────────────
  if (auth.type === "none") {
    return (
      <div className={`min-h-screen ${th.page} flex items-center justify-center font-mono transition-colors duration-200`}>
        <div className="w-full max-w-sm px-8">
          <div className="flex justify-end mb-6">
            <button onClick={() => setDark(!dark)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${th.surface} ${th.muted}`}>
              {dark ? "☀ Light" : "☾ Dark"}
            </button>
          </div>
          <div className="mb-8 text-center">
            <span className={`text-xs tracking-[0.3em] ${th.muted} uppercase`}>Earket</span>
            <h1 className={`text-2xl font-semibold mt-1 tracking-tight ${th.bodyText}`}>Admin Access</h1>
          </div>
          <div className={`flex mb-5 rounded-lg p-1 border ${th.tab}`}>
            {(["super","staff"] as const).map(m => (
              <button key={m} onClick={() => { setLoginMode(m); setLoginError(""); }}
                className={`flex-1 py-2 text-sm rounded-md transition-colors ${loginMode === m ? th.tabActive : th.tabInactive}`}>
                {m === "super" ? "Super Admin" : "Staff Login"}
              </button>
            ))}
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            {loginMode === "staff" && (
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg text-sm outline-none border transition-colors ${th.input}`} required />
            )}
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg text-sm outline-none border transition-colors ${th.input}`} autoFocus required />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit"
              className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ background: dark ? "white" : "#111", color: dark ? "black" : "white" }}>
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${th.page} transition-colors duration-200`}>
      <header className={`border-b ${th.header} px-8 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className={`text-xs tracking-[0.3em] ${th.muted} uppercase font-mono`}>Earket</span>
          <span className={th.faint}>/</span>
          <span className={`text-base ${th.muted}`}>Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDark(!dark)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors font-mono ${th.surface} ${th.muted}`}>
            {dark ? "☀ Light" : "☾ Dark"}
          </button>
          {(auth.type === "super_admin" || auth.type === "staff") && (
            <span className={`text-sm px-3 py-1 rounded-full border font-mono ${ROLE_COLORS[auth.type === "super_admin" ? "super_admin" : (auth as { type: "staff"; user: AdminUser }).user.role]}`}>
              {currentRole}
            </span>
          )}
          <span className={`text-sm ${th.muted} font-mono`}>{currentName}</span>
          <button onClick={() => { setAuth({ type: "none" }); setPassword(""); setEmail(""); }}
            className={`text-sm ${th.muted} hover:${th.bodyText} transition-colors font-mono`}>
            sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-current opacity-20 border-t-current rounded-full animate-spin" />
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
              ].map(s => (
                <div key={s.label} className={`rounded-xl border p-4 ${
                  s.accent === "emerald" ? "border-emerald-500/30 bg-emerald-500/5" :
                  s.accent === "amber"   ? "border-amber-500/30 bg-amber-500/5" :
                  s.accent === "orange"  ? "border-orange-500/30 bg-orange-500/5" :
                  `${th.surface}`
                }`}>
                  <p className={`text-3xl font-bold tracking-tight ${th.bodyText}`}>{s.value}</p>
                  <p className={`text-xs ${th.muted} mt-1 font-mono leading-tight`}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            {canDo(auth, "manage_admins") && (
              <div className={`flex gap-1 mb-6 rounded-lg p-1 border w-fit flex-wrap ${th.tab}`}>
                {([
                  { key: "merchants", label: "Merchants" },
                  { key: "admins", label: "Admin Users" },
                  { key: "announcements", label: "📣 Announcements" },
                  { key: "intelligence", label: "📊 Intelligence" },
                  { key: "pro", label: "⭐ Pro Waitlist" },
                ] as {key:string;label:string}[]).map(t => (
                  <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${tab === t.key ? th.tabActive : th.tabInactive}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            {/* ── MERCHANTS ── */}
            {tab === "merchants" && (
              <>
                <div className="flex flex-wrap gap-3 mb-5">
                  <input type="text" placeholder="Search name, email, phone, country..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={`px-4 py-2 rounded-lg text-sm outline-none border transition-colors w-72 font-mono ${th.input}`} />
                  <select value={filterType} onChange={e => setFilterType(e.target.value)}
                    className={`px-3 py-2 rounded-lg text-sm outline-none border font-mono ${th.select}`}>
                    {businessTypes.map(t => <option key={t} value={t}>{t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                  <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                    className={`px-3 py-2 rounded-lg text-sm outline-none border font-mono ${th.select}`}>
                    {categories.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
                  </select>
                  <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)}
                    className={`px-3 py-2 rounded-lg text-sm outline-none border font-mono ${th.select}`}>
                    {uniqueCountries.map(c => <option key={c} value={c}>{c === "all" ? "All Countries" : c}</option>)}
                  </select>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className={`px-3 py-2 rounded-lg text-sm outline-none border font-mono ${th.select}`}>
                    {["all","active","suspended","terminated","flagged"].map(s => (
                      <option key={s} value={s}>{s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <div className="ml-auto flex items-center gap-3">
                    <span className={`text-sm ${th.muted} self-center font-mono`}>{filtered.length} results</span>
                    <label className={`flex items-center gap-2 text-sm font-mono cursor-pointer ${th.muted}`}>
                      <input type="checkbox"
                        className="w-4 h-4 rounded accent-emerald-500"
                        checked={selectedIds.size === filtered.length && filtered.length > 0}
                        onChange={e => {
                          if (e.target.checked) { setSelectedIds(new Set(filtered.map(m => m.id))); setSelectMode("filtered"); }
                          else { setSelectedIds(new Set()); }
                        }}
                      /> Select all
                    </label>
                    <button
                      onClick={() => {
                        const rows = [["Business","Type","Category","Email","Phone","Country","Status","Joined"]];
                        filtered.forEach(m => rows.push([
                          m.business_name||"", m.business_type||"", m.category||"",
                          m.email||"", m.phone||"", m.country||"",
                          m.status||"active",
                          m.created_at ? new Date(m.created_at).toLocaleDateString("en-GB") : ""
                        ]));
                        const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
                        const a = document.createElement("a");
                        a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
                        a.download = "earket-merchants.csv";
                        a.click();
                      }}
                      className={`text-sm px-4 py-2 rounded-lg font-mono transition-colors ${th.btn}`}>
                      ↓ Export CSV
                    </button>
                    <button
                      onClick={() => { setShowBroadcast(true); setBroadcastDone(false); setBroadcastMsg(""); }}
                      className="text-sm px-4 py-2 rounded-lg font-mono transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                      📣 Broadcast
                    </button>
                  </div>
                </div>

                <div className={`rounded-xl border overflow-x-auto ${th.surface}`}>
                  <table className="w-full min-w-[1300px]">
                    <thead>
                      <tr className={`border-b ${th.thead}`}>
                        {["","Business","Type","Category","Email","Phone","Country","Status","Joined","Store","Actions"].map(h => (
                          <th key={h} className={`text-left px-3 py-3 text-[10px] tracking-[0.1em] uppercase font-mono font-normal ${th.theadText} whitespace-nowrap ${h === "Actions" ? "sticky right-0 bg-[#111] shadow-[-8px_0_8px_rgba(0,0,0,0.3)]" : ""}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={7} className={`px-5 py-12 text-center text-sm font-mono ${th.muted}`}>No merchants found.</td></tr>
                      ) : filtered.map((m, i) => (
                        <tr key={m.id} className={`border-b ${th.rowBorder} ${th.rowHover} transition-colors ${i % 2 === 0 ? th.row0 : th.row1}`}>
                          <td className="px-2 py-3 w-8">
                            <input type="checkbox"
                              checked={selectedIds.has(m.id)}
                              onChange={e => {
                                const next = new Set(selectedIds);
                                e.target.checked ? next.add(m.id) : next.delete(m.id);
                                setSelectedIds(next);
                                if (next.size > 0) setSelectMode("custom");
                              }}
                              className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                            />
                          </td>
                          <td className={`px-3 py-3 font-medium text-sm ${th.bodyText} whitespace-nowrap max-w-[140px] truncate`}>
                            {m.business_name || <span className={th.faint}>—</span>}
                            {m.admin_notes && <span className="ml-2 text-[9px] text-amber-400 font-mono align-middle">NOTE</span>}
                          </td>
                          <td className={`px-3 py-3 font-mono text-xs ${th.muted} whitespace-nowrap`}>{m.business_type || "—"}</td>
                          <td className={`px-3 py-3 font-mono text-xs ${th.muted} whitespace-nowrap`}>{m.category || "—"}</td>
                          <td className={`px-3 py-3 font-mono text-xs ${th.muted} whitespace-nowrap`}>{m.email || "—"}</td>
                          <td className={`px-3 py-3 font-mono text-xs ${th.muted} whitespace-nowrap`}>{m.phone || "—"}</td>
                          <td className={`px-3 py-3 font-mono text-xs ${th.muted} whitespace-nowrap`}>{m.country || "—"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{statusBadge(m.status)}</td>
                          <td className={`px-3 py-3 font-mono text-xs ${th.muted} whitespace-nowrap`}>
                            {m.created_at ? new Date(m.created_at).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—"}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {m.slug ? (
                              <a href={`https://earket.com/store/${m.slug}`} target="_blank" rel="noopener noreferrer"
                                className={`font-mono text-xs underline underline-offset-4 transition-colors ${th.muted} hover:${th.bodyText}`}>
                                /{m.slug}
                              </a>
                            ) : <span className={`font-mono text-xs ${th.faint}`}>—</span>}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap sticky right-0 bg-inherit shadow-[-8px_0_8px_rgba(0,0,0,0.2)]">
                            <button onClick={() => { setSelectedMerchant(m); setModalType("actions"); setActionMessage(""); }}
                              className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-mono ${th.btn}`}>
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

            {/* ── ADMIN USERS ── */}
            {tab === "admins" && canDo(auth, "manage_admins") && (
              <>
                <div className="flex justify-between items-center mb-5">
                  <h2 className={`text-sm ${th.muted} font-mono`}>{adminUsers.length} admin users</h2>
                  <button onClick={() => setModalType("new_admin")}
                    className="text-sm bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-80 transition-opacity"
                    style={{ background: dark ? "white" : "#111", color: dark ? "black" : "white" }}>
                    + Add Admin
                  </button>
                </div>
                <div className={`rounded-xl border overflow-x-auto ${th.surface}`}>
                  <table className="w-full min-w-[1300px]">
                    <thead>
                      <tr className={`border-b ${th.thead}`}>
                        {["Name","Email","Role","Last Login","Status","Actions"].map(h => (
                          <th key={h} className={`text-left px-5 py-3.5 text-xs tracking-[0.12em] uppercase font-mono font-normal ${th.theadText}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((a, i) => (
                        <tr key={a.id} className={`border-b ${th.rowBorder} ${i % 2 === 0 ? th.row0 : th.row1}`}>
                          <td className={`px-3 py-3 font-medium text-sm ${th.bodyText} whitespace-nowrap max-w-[140px] truncate`}>{a.name}</td>
                          <td className={`px-5 py-4 font-mono text-sm ${th.muted}`}>{a.email}</td>
                          <td className="px-5 py-4">
                            <span className={`text-sm px-2.5 py-1 rounded-full border font-mono ${ROLE_COLORS[a.role]}`}>
                              {ROLE_LABELS[a.role]}
                            </span>
                          </td>
                          <td className={`px-5 py-4 font-mono text-sm ${th.muted}`}>
                            {a.last_login ? new Date(a.last_login).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "Never"}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`font-mono text-sm ${a.active ? "text-emerald-500" : th.muted}`}>
                              ● {a.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button onClick={() => toggleAdminActive(a.id, a.active)}
                              className={`text-sm px-4 py-2 rounded-lg transition-colors font-mono ${
                                a.active ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              }`}>
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

            {/* ── ANNOUNCEMENTS TAB ── */}
            {tab === "announcements" && canDo(auth, "manage_admins") && (
              <>
                <div className={`rounded-xl border p-6 mb-6 ${th.surface}`}>
                  <h2 className={`text-base font-semibold mb-4 ${th.bodyText}`}>Create Announcement</h2>
                  <div className="space-y-3">
                    <textarea value={newAnnouncement} onChange={e => setNewAnnouncement(e.target.value)}
                      placeholder="e.g. 🎉 Earket now supports Ghana Cedis and Kenya Shillings!"
                      rows={3}
                      className={`w-full px-4 py-3 rounded-lg text-sm outline-none border font-mono resize-none ${th.modalInput}`} />
                    <div className="flex gap-3">
                      <select value={announcementType} onChange={e => setAnnouncementType(e.target.value as "info"|"warning"|"success"|"promo")}
                        className={`px-3 py-2 rounded-lg text-sm outline-none border font-mono flex-1 ${th.select}`}>
                        <option value="info">ℹ️ Info</option>
                        <option value="success">✅ Success</option>
                        <option value="warning">⚠️ Warning</option>
                        <option value="promo">⭐ Promo</option>
                      </select>
                      <button
                        disabled={!newAnnouncement.trim() || savingAnnouncement}
                        onClick={async () => {
                          setSavingAnnouncement(true);
                          await supabase.from("announcements").insert({ message: newAnnouncement, type: announcementType, active: true });
                          setNewAnnouncement("");
                          await loadData();
                          setSavingAnnouncement(false);
                        }}
                        className="px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 transition-opacity"
                        style={{ background: dark ? "white" : "#111", color: dark ? "black" : "white" }}>
                        {savingAnnouncement ? "Saving..." : "Post"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl border overflow-hidden ${th.surface}`}>
                  <div className={`px-5 py-3.5 border-b ${th.thead}`}>
                    <span className={`text-xs font-mono uppercase tracking-widest ${th.theadText}`}>Active Announcements</span>
                  </div>
                  {announcements.length === 0 ? (
                    <div className={`px-5 py-12 text-center text-sm font-mono ${th.muted}`}>No announcements yet.</div>
                  ) : announcements.map((a, i) => (
                    <div key={a.id} className={`px-5 py-4 border-b flex items-start justify-between gap-4 ${th.rowBorder} ${i % 2 === 0 ? th.row0 : th.row1}`}>
                      <div className="flex-1">
                        <p className={`text-sm ${th.bodyText}`}>{a.message}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs font-mono ${th.muted}`}>{new Date(a.created_at).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                            a.type === "success" ? "bg-emerald-500/10 text-emerald-400" :
                            a.type === "warning" ? "bg-amber-500/10 text-amber-400" :
                            a.type === "promo"   ? "bg-purple-500/10 text-purple-400" :
                            "bg-blue-500/10 text-blue-400"
                          }`}>{a.type}</span>
                          <span className={`text-xs font-mono ${a.active ? "text-emerald-400" : th.muted}`}>● {a.active ? "Live" : "Off"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={async () => { await supabase.from("announcements").update({ active: !a.active }).eq("id", a.id); loadData(); }}
                          className={`text-xs px-3 py-1.5 rounded-lg font-mono transition-colors ${a.active ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"}`}>
                          {a.active ? "Pause" : "Resume"}
                        </button>
                        <button onClick={async () => { await supabase.from("announcements").delete().eq("id", a.id); loadData(); }}
                          className="text-xs px-3 py-1.5 rounded-lg font-mono bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── INTELLIGENCE TAB ── */}
            {tab === "intelligence" && canDo(auth, "manage_admins") && (() => {
              const now = new Date();
              const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

              const inactive30 = merchants.filter(m => {
                const last = (m as any).last_login_at;
                return !last || new Date(last) < thirtyDaysAgo;
              });
              const inactive7 = merchants.filter(m => {
                const last = (m as any).last_login_at;
                return last && new Date(last) < sevenDaysAgo && new Date(last) >= thirtyDaysAgo;
              });
              const noProducts = merchants.filter(m => !(m as any).has_products);
              const byCategory = merchants.reduce((acc, m) => {
                const cat = m.category || "unknown";
                acc[cat] = (acc[cat] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);
              const byCountry = merchants.reduce((acc, m) => {
                const c = m.country || "unknown";
                acc[c] = (acc[c] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Inactive 30+ days", value: inactive30.length, color: "red", desc: "Haven't logged in recently" },
                      { label: "Quiet (7–30 days)", value: inactive7.length, color: "amber", desc: "Starting to go quiet" },
                      { label: "Pro Waitlist", value: proWaitlist.length, color: "purple", desc: "Interested in upgrading" },
                    ].map(s => (
                      <div key={s.label} className={`rounded-xl border p-5 ${
                        s.color === "red" ? "border-red-500/20 bg-red-500/5" :
                        s.color === "amber" ? "border-amber-500/20 bg-amber-500/5" :
                        "border-purple-500/20 bg-purple-500/5"
                      }`}>
                        <p className={`text-3xl font-bold ${th.bodyText}`}>{s.value}</p>
                        <p className={`text-sm font-semibold mt-1 ${th.bodyText}`}>{s.label}</p>
                        <p className={`text-xs font-mono mt-0.5 ${th.muted}`}>{s.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`rounded-xl border overflow-hidden ${th.surface}`}>
                      <div className={`px-5 py-3.5 border-b ${th.thead}`}>
                        <span className={`text-xs font-mono uppercase tracking-widest ${th.theadText}`}>Merchants by Category</span>
                      </div>
                      {Object.entries(byCategory).sort((a,b) => b[1]-a[1]).map(([cat, count], i) => (
                        <div key={cat} className={`px-5 py-3 border-b flex items-center justify-between ${th.rowBorder} ${i % 2 === 0 ? th.row0 : th.row1}`}>
                          <span className={`text-sm font-mono ${th.bodyText}`}>{cat}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(count / merchants.length) * 100}%` }} />
                            </div>
                            <span className={`text-sm font-mono w-6 text-right ${th.muted}`}>{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={`rounded-xl border overflow-hidden ${th.surface}`}>
                      <div className={`px-5 py-3.5 border-b ${th.thead}`}>
                        <span className={`text-xs font-mono uppercase tracking-widest ${th.theadText}`}>Merchants by Country</span>
                      </div>
                      {Object.entries(byCountry).sort((a,b) => b[1]-a[1]).map(([country, count], i) => (
                        <div key={country} className={`px-5 py-3 border-b flex items-center justify-between ${th.rowBorder} ${i % 2 === 0 ? th.row0 : th.row1}`}>
                          <span className={`text-sm font-mono ${th.bodyText}`}>{country}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count / merchants.length) * 100}%` }} />
                            </div>
                            <span className={`text-sm font-mono w-6 text-right ${th.muted}`}>{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {inactive30.length > 0 && (
                    <div className={`rounded-xl border overflow-hidden mt-6 ${th.surface}`}>
                      <div className={`px-5 py-3.5 border-b ${th.thead} flex items-center justify-between`}>
                        <span className={`text-xs font-mono uppercase tracking-widest ${th.theadText}`}>Inactive 30+ Days — Re-engage These</span>
                        <span className="text-xs text-red-400 font-mono">{inactive30.length} merchants</span>
                      </div>
                      {inactive30.slice(0, 10).map((m, i) => (
                        <div key={m.id} className={`px-5 py-3.5 border-b flex items-center justify-between ${th.rowBorder} ${i % 2 === 0 ? th.row0 : th.row1}`}>
                          <div>
                            <p className={`text-sm font-medium ${th.bodyText}`}>{m.business_name}</p>
                            <p className={`text-xs font-mono ${th.muted}`}>{m.email} · {m.phone}</p>
                          </div>
                          <a href={`https://wa.me/${m.phone}?text=${encodeURIComponent(`Hi ${m.business_name}! 👋 Just checking in from Earket — your store is still live at earket.com/store/${m.slug}. Let us know if you need any help!`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg font-mono transition-colors">
                            💬 WhatsApp
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}

            {/* ── PRO WAITLIST TAB ── */}
            {tab === "pro" && canDo(auth, "manage_admins") && (
              <>
                <div className={`rounded-xl border p-5 mb-6 ${th.surface}`}>
                  <p className={`text-sm ${th.bodyText} mb-1`}>⭐ <strong>{proWaitlist.length} merchants</strong> have expressed interest in Pro.</p>
                  <p className={`text-xs font-mono ${th.muted}`}>When you're ready to launch, broadcast to this list first — they're your warmest leads.</p>
                </div>
                <div className={`rounded-xl border overflow-x-auto ${th.surface}`}>
                  <table className="w-full min-w-[1300px]">
                    <thead>
                      <tr className={`border-b ${th.thead}`}>
                        {["Business","Email","Joined Waitlist","Action"].map(h => (
                          <th key={h} className={`text-left px-5 py-3.5 text-xs tracking-[0.12em] uppercase font-mono font-normal ${th.theadText}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {proWaitlist.length === 0 ? (
                        <tr><td colSpan={4} className={`px-5 py-12 text-center text-sm font-mono ${th.muted}`}>No waitlist signups yet.</td></tr>
                      ) : proWaitlist.map((w, i) => (
                        <tr key={w.id} className={`border-b ${th.rowBorder} ${i % 2 === 0 ? th.row0 : th.row1}`}>
                          <td className={`px-3 py-3 font-medium text-sm ${th.bodyText} whitespace-nowrap max-w-[140px] truncate`}>{w.business_name}</td>
                          <td className={`px-5 py-4 font-mono text-sm ${th.muted}`}>{w.email}</td>
                          <td className={`px-5 py-4 font-mono text-sm ${th.muted}`}>{new Date(w.created_at).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}</td>
                          <td className="px-5 py-4">
                            <a href={`mailto:${w.email}?subject=Earket Pro is here!&body=Hi ${w.business_name}, great news — Earket Pro is now available!`}
                              className="text-xs bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 px-3 py-1.5 rounded-lg font-mono transition-colors">
                              ✉️ Email
                            </a>
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl border w-full max-w-md p-6 ${th.modal}`}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className={`font-semibold text-lg ${th.bodyText}`}>{selectedMerchant.business_name}</h2>
                <p className={`text-sm font-mono mt-0.5 ${th.muted}`}>{selectedMerchant.slug}</p>
              </div>
              <button onClick={() => { setSelectedMerchant(null); setModalType(null); setActionMessage(""); }}
                className={`text-xl leading-none ${th.muted} hover:${th.bodyText}`}>✕</button>
            </div>

            <div className="mb-4">{statusBadge(selectedMerchant.status)}</div>

            {/* Identity Verification */}
            <div className="mb-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-xs font-mono uppercase tracking-widest mb-3 text-blue-400">🔒 Identity Verification</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-[#888] shrink-0">Owner Name</span>
                  <span className="text-sm font-semibold text-right" style={{color: dark ? 'white' : '#111'}}>
                    {selectedMerchant.owner_name ? selectedMerchant.owner_name : <span className="text-[#888] font-normal italic text-xs">Not provided</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-[#888] shrink-0">Email</span>
                  <span className="text-sm font-mono text-right" style={{color: dark ? 'white' : '#111'}}>
                    {selectedMerchant.email || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-[#888] shrink-0">Phone</span>
                  <span className="text-sm font-mono text-right" style={{color: dark ? 'white' : '#111'}}>
                    {selectedMerchant.phone || "—"}
                  </span>
                </div>
              </div>
            </div>

            {actionMessage && (
              <div className="mb-4 text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-lg font-mono">
                {actionMessage}
              </div>
            )}

            {selectedMerchant.temp_password && (
              <div className="mb-4 text-sm bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-lg font-mono">
                Temp password: <strong>{selectedMerchant.temp_password}</strong>
              </div>
            )}

            {selectedMerchant.admin_notes && (
              <div className={`mb-4 rounded-lg p-4 border ${th.noteBox}`}>
                <p className={`text-xs font-mono uppercase tracking-widest mb-2 ${th.muted}`}>Internal Notes</p>
                <p className={`text-sm font-mono whitespace-pre-wrap ${th.noteText}`}>{selectedMerchant.admin_notes}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {canDo(auth, "reset_password") && (
                <button onClick={() => handleAction(selectedMerchant.id, "reset_password")} disabled={actionLoading}
                  className={`text-sm px-4 py-3 rounded-lg transition-colors font-mono ${th.btn}`}>
                  🔑 Reset Password
                </button>
              )}
              {canDo(auth, "flag") && (
                <button onClick={() => handleAction(selectedMerchant.id, selectedMerchant.status === "flagged" ? "unflag" : "flag")} disabled={actionLoading}
                  className="text-sm bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-4 py-3 rounded-lg transition-colors font-mono">
                  {selectedMerchant.status === "flagged" ? "✓ Remove Flag" : "🚩 Flag Account"}
                </button>
              )}
              {canDo(auth, "note") && (
                <button onClick={() => setModalType("note")}
                  className={`text-sm px-4 py-3 rounded-lg transition-colors font-mono ${th.btn}`}>
                  📝 Add Note
                </button>
              )}
              {canDo(auth, "suspend") && (
                <button onClick={() => handleAction(selectedMerchant.id, selectedMerchant.status === "suspended" ? "unsuspend" : "suspend")} disabled={actionLoading}
                  className="text-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-3 rounded-lg transition-colors font-mono">
                  {selectedMerchant.status === "suspended" ? "✓ Unsuspend" : "⏸ Suspend"}
                </button>
              )}
              {canDo(auth, "terminate") && (
                <button onClick={() => { if (confirm("Terminate this account? This cannot be undone.")) handleAction(selectedMerchant.id, "terminate"); }}
                  disabled={actionLoading || selectedMerchant.status === "terminated"}
                  className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-3 rounded-lg transition-colors font-mono col-span-2 disabled:opacity-40">
                  ✕ Terminate Account
                </button>
              )}
              <a href={`https://earket.com/store/${selectedMerchant.slug}`} target="_blank" rel="noopener noreferrer"
                className={`text-sm px-4 py-3 rounded-lg transition-colors font-mono text-center col-span-2 ${th.btn}`}>
                ↗ View Live Store
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── BROADCAST MODAL ── */}
      {showBroadcast && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl border w-full max-w-lg p-6 ${th.modal}`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className={`font-semibold text-lg ${th.bodyText}`}>📣 Broadcast Message</h2>
                <p className={`text-xs font-mono mt-0.5 ${th.muted}`}>Send to merchants via WhatsApp or Email</p>
              </div>
              <button onClick={() => setShowBroadcast(false)} className={`text-xl ${th.muted}`}>✕</button>
            </div>

            {/* Channel selector */}
            <div className={`flex gap-1 mb-5 rounded-lg p-1 border ${th.tab}`}>
              {(["whatsapp","email"] as const).map(c => (
                <button key={c} onClick={() => setBroadcastChannel(c)}
                  className={`flex-1 py-2 text-sm rounded-md transition-colors capitalize font-mono ${broadcastChannel === c ? th.tabActive : th.tabInactive}`}>
                  {c === "whatsapp" ? "💬 WhatsApp" : "✉️ Email"}
                </button>
              ))}
            </div>

            {/* Recipients */}
            <div className="mb-4">
              <p className={`text-xs font-mono uppercase tracking-widest mb-2 ${th.muted}`}>Recipients</p>
              <div className="flex gap-2 flex-wrap">
                {([
                  { key: "all", label: `All merchants (${merchants.length})` },
                  { key: "filtered", label: `Filtered results (${filtered.length})` },
                  ...(selectedIds.size > 0 ? [{ key: "custom", label: `Selected (${selectedIds.size})` }] : []),
                ] as { key: string; label: string }[]).map(opt => (
                  <button key={opt.key}
                    onClick={() => setSelectMode(opt.key as "all" | "filtered" | "custom")}
                    className={`text-sm px-3 py-1.5 rounded-lg font-mono border transition-colors ${
                      selectMode === opt.key
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : `${th.btn} border border-transparent`
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="mb-5">
              <p className={`text-xs font-mono uppercase tracking-widest mb-2 ${th.muted}`}>Message</p>
              <textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)}
                placeholder="Hi! We have an important update for all Earket merchants..."
                rows={5}
                className={`w-full px-4 py-3 rounded-lg text-sm outline-none border transition-colors font-mono resize-none ${th.modalInput}`} />
              <p className={`text-xs font-mono mt-1 ${th.muted}`}>{broadcastMsg.length} characters</p>
            </div>

            {broadcastDone && (
              <div className="mb-4 text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg font-mono">
                {broadcastChannel === "email"
                  ? "✓ Email client opened with all recipients in BCC."
                  : "✓ WhatsApp links opened. Work through each tab to send."}
              </div>
            )}

            {/* Note about scaling */}
            <div className={`mb-5 text-xs font-mono px-3 py-2 rounded-lg border ${th.noteBox} ${th.muted}`}>
              💡 Currently using direct links (free). Upgrade to WhatsApp Business API at 50+ merchants for one-click blasts.
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowBroadcast(false)}
                className={`flex-1 text-sm py-3 rounded-lg font-mono transition-colors ${th.btn}`}>Cancel</button>
              <button
                disabled={!broadcastMsg.trim()}
                onClick={() => {
                  const recipientList = selectMode === "all" ? merchants
                    : selectMode === "filtered" ? filtered
                    : merchants.filter(m => selectedIds.has(m.id));

                  if (broadcastChannel === "email") {
                    const emails = recipientList.map(m => m.email).filter(Boolean).join(",");
                    window.open(`mailto:?bcc=${encodeURIComponent(emails)}&subject=${encodeURIComponent("Message from Earket")}&body=${encodeURIComponent(broadcastMsg)}`);
                  } else {
                    const phones = recipientList.map(m => m.phone).filter(Boolean);
                    phones.forEach((phone, i) => {
                      setTimeout(() => {
                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(broadcastMsg)}`, "_blank");
                      }, i * 300);
                    });
                  }
                  setBroadcastDone(true);
                }}
                className="flex-1 text-sm py-3 rounded-lg font-semibold transition-opacity disabled:opacity-40"
                style={{ background: dark ? "white" : "#111", color: dark ? "black" : "white" }}>
                {broadcastChannel === "whatsapp" ? "💬 Open WhatsApp Links" : "✉️ Open Email Client"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTE MODAL ── */}
      {selectedMerchant && modalType === "note" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl border w-full max-w-md p-6 ${th.modal}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`font-semibold text-lg ${th.bodyText}`}>Add Internal Note</h2>
              <button onClick={() => setModalType("actions")} className={`text-xl ${th.muted}`}>✕</button>
            </div>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="Write your note here..." rows={4}
              className={`w-full px-4 py-3 rounded-lg text-sm outline-none border transition-colors font-mono resize-none mb-4 ${th.modalInput}`} />
            <div className="flex gap-2">
              <button onClick={() => setModalType("actions")}
                className={`flex-1 text-sm py-3 rounded-lg font-mono transition-colors ${th.btn}`}>Cancel</button>
              <button onClick={() => handleAction(selectedMerchant.id, "note", noteText)}
                disabled={!noteText.trim() || actionLoading}
                className="flex-1 text-sm py-3 rounded-lg font-semibold transition-opacity disabled:opacity-40"
                style={{ background: dark ? "white" : "#111", color: dark ? "black" : "white" }}>
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW ADMIN MODAL ── */}
      {modalType === "new_admin" && canDo(auth, "manage_admins") && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl border w-full max-w-md p-6 ${th.modal}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`font-semibold text-lg ${th.bodyText}`}>Add Admin User</h2>
              <button onClick={() => setModalType(null)} className={`text-xl ${th.muted}`}>✕</button>
            </div>
            <form onSubmit={handleCreateAdmin} className="space-y-3">
              <input type="text" placeholder="Full name" value={newAdmin.name}
                onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg text-sm outline-none border font-mono ${th.modalInput}`} required />
              <input type="email" placeholder="Email" value={newAdmin.email}
                onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg text-sm outline-none border font-mono ${th.modalInput}`} required />
              <input type="password" placeholder="Password" value={newAdmin.password}
                onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg text-sm outline-none border font-mono ${th.modalInput}`} required />
              <select value={newAdmin.role} onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value as Role })}
                className={`w-full px-4 py-3 rounded-lg text-sm outline-none border font-mono ${th.modalInput}`}>
                <option value="viewer">Viewer — read only</option>
                <option value="support">Support — view, flag, notes, reset passwords</option>
                <option value="manager">Manager — support + suspend + revenue</option>
                <option value="super_admin">Super Admin — full access</option>
              </select>
              <button type="submit" disabled={actionLoading}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-40"
                style={{ background: dark ? "white" : "#111", color: dark ? "black" : "white" }}>
                Create Admin
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
