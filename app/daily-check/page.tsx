import { supabase } from "@/lib/supabaseClient";
import DailyHealthCheck from "@/components/daily-health-check";

export default async function DailyCheckPage() {
  // 仮の userId（本来は認証情報などから取得）
  const userId = 1;

  const { data, error } = await supabase
    .from("daily_checks")
    .select("*")
    .eq("user_id", userId);

  // 必要に応じて data や error を DailyHealthCheck に渡す
  return <DailyHealthCheck data={data} error={error} />;
}
