"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://watdsaazzjcsyvnpdthe.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const ADMIN_PASSWORD = "11881188";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type Merchant = {
  id: string;
  business_name: string;
  business_type: string;
  country: string;
  is_published: boolean;
  created_at: string;
  slug: string;
  email?: string;
};

type Stats = {
  totalMerchants: number;
  activeStores: number;
  newThisMonth: number;
  totalLeads: number;
  totalOrders: number;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filtered, setFiltered] = useState<Merchant[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [loading, setLoading] = useState(false);

  const categories = [
    "all", "Home", "Auto", "Beauty", "Education", "Coaching & Mentoring",
    "Health & Wellness", "Mental Wellness", "Domestic", "Childcare & Nanny",
    "Food & Catering", "Events", "Digital & Tech", "Transport", "Agriculture"
  ];

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
      loadData();
    } else {
      setError("Incorrect password.");
    }
  }

  async function loadData() {
    setLoading(true);
    try {
      const [merchantsRes, leadsRes, ordersRes] = await Promise.all([
        supabase.from("merchants").select("*").order("created_at", { ascending: false }),
        supabase.from("leads").select("id", { count: "exact" }),
        supabase.from("orders").select("id", { count: "exact" }),
      ]);

      const allMerchants: Merchant[] = merchantsRes.data || [];
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newThisMonth = allMerchants.filter(
        (m) => new Date(m.created_at) >= startOfMonth
      ).length;

      setMerchants(allMerchants);
      setFiltered(allMerchants);
      setStats({
        totalMerchants: allMerchants.length,
        activeStores: allMerchants.filter((m) => m.is_published).length,
        newThisMonth,
        totalLeads: leadsRes.count || 0,
        totalOrders: ordersRes.count || 0,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    let result = merchants;
    if (search) {
      result = result.filter(
        (m) =>
          m.business_name?.toLowerCase().includes(search.toLowerCase()) ||
          m.country?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterCategory !== "all") {
      result = result.filter((m) => m.business_type === filterCategory);
    }
    if (filterCountry !== "all") {
      result = result.filter((m) => m.country === filterCountry);
    }
    setFiltered(result);
  }, [search, filterCategory, filterCountry, merchants]);

  const uniqueCountries = ["all", ...Array.from(new Set(merchants.map((m) => m.country).filter(Boolean)))];

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono">
        <div className="w-full max-w-sm px-8">
          <div className="mb-10 text-center">
            <span className="text-[11px] tracking-[0.3em] text-[#666] uppercase">Earket</span>
            <h1 className="text-white text-2xl font-semibold mt-1 tracking-tight">Admin Access</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#141414] border border-[#222] text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#444] transition-colors"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.3em] text-[#555] uppercase font-mono">Earket</span>
          <span className="text-[#2a2a2a]">/</span>
          <span className="text-sm text-[#888]">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs text-[#555] font-mono">live</span>
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
              {[
                { label: "Total Merchants", value: stats?.totalMerchants ?? 0 },
                { label: "Live Stores", value: stats?.activeStores ?? 0, accent: true },
                { label: "New This Month", value: stats?.newThisMonth ?? 0 },
                { label: "Total Leads", value: stats?.totalLeads ?? 0 },
                { label: "Total Orders", value: stats?.totalOrders ?? 0 },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-xl border p-5 ${
                    s.accent
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-[#1a1a1a] bg-[#111]"
                  }`}
                >
                  <p className="text-3xl font-bold tracking-tight">{s.value}</p>
                  <p className="text-xs text-[#555] mt-1 font-mono">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <input
                type="text"
                placeholder="Search merchants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#111] border border-[#1e1e1e] text-white px-4 py-2 rounded-lg text-sm outline-none focus:border-[#333] transition-colors w-64 font-mono"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[#111] border border-[#1e1e1e] text-[#888] px-4 py-2 rounded-lg text-sm outline-none focus:border-[#333] transition-colors font-mono"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Categories" : c}
                  </option>
                ))}
              </select>
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="bg-[#111] border border-[#1e1e1e] text-[#888] px-4 py-2 rounded-lg text-sm outline-none focus:border-[#333] transition-colors font-mono"
              >
                {uniqueCountries.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Countries" : c}
                  </option>
                ))}
              </select>
              <span className="ml-auto text-xs text-[#444] self-center font-mono">
                {filtered.length} results
              </span>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-[#1a1a1a] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1a1a1a] bg-[#111]">
                    {["Business", "Category", "Country", "Status", "Joined", "Store"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-[10px] tracking-[0.15em] uppercase text-[#444] font-mono font-normal"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-[#444] font-mono text-xs">
                        No merchants found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((m, i) => (
                      <tr
                        key={m.id}
                        className={`border-b border-[#141414] hover:bg-[#111] transition-colors ${
                          i % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#0a0a0a]"
                        }`}
                      >
                        <td className="px-5 py-3.5 font-medium text-white">
                          {m.business_name || <span className="text-[#444]">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-[#666] font-mono text-xs">
                          {m.business_type || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-[#666] font-mono text-xs">
                          {m.country || "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          {m.is_published ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                              Live
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[#444] text-xs font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#333] inline-block" />
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-[#555] font-mono text-xs">
                          {m.created_at
                            ? new Date(m.created_at).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          {m.slug ? (
                            <a
                              href={`https://earket.com/store/${m.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#555] hover:text-white font-mono text-xs underline underline-offset-4 transition-colors"
                            >
                              /{m.slug}
                            </a>
                          ) : (
                            <span className="text-[#333] font-mono text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
