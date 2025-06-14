"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DailyHealthCheck from "@/components/daily-health-check";
import Dashboard from "@/components/Dashboard";
import GuestDashboard from "@/components/GuestDashboard";

export default function DailyCheckPage() {
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
