"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Dashboard from "@/components/dashboard"; // 小文字に注意
import GuestDashboard from "@/components/GuestDashboard";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>読み込み中...</div>;

  return user ? <Dashboard user={user} /> : <GuestDashboard />;
}