"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"

interface ResultsScreenProps {
  scores: Record<string, number>
  onSaveCallback?: () => void
  onRetakeQuiz?: () => void
}

export default function ResultsScreen({ scores, onSaveCallback, onRetakeQuiz }: ResultsScreenProps) {
  // 気血水のデータ
  const qiBloodFluidData = [
    {
      category: "気虚",
      score: scores["気虚"] || 0,
      maxScore: 5,
    },
    {
      category: "血虚",
      score: scores["血虚"] || 0,
      maxScore: 5,
    },
    {
      category: "水滞",
      score: scores["水滞"] || 0,
      maxScore: 5,
    },
  ]

  // 五臓のデータ
  const fiveOrgansData = [
    {
      category: "肝",
      score: scores["肝の不調"] || 0,
      maxScore: 5,
    },
    {
      category: "心",
      score: scores["心の不調"] || 0,
      maxScore: 5,
    },
    {
      category: "脾",
      score: scores["脾の不調"] || 0,
      maxScore: 5,
    },
    {
      category: "肺",
      score: scores["肺の不調"] || 0,
      maxScore: 5,
    },
    {
      category: "腎",
      score: scores["腎の不調"] || 0,
      maxScore: 5,
    },
  ]

  // その他の体質データ
  const otherConstitutionData = [
    {
      category: "気滞",
      score: scores["気滞"] || 0,
      maxScore: 5,
    },
    {
      category: "瘀血",
      score: scores["瘀血"] || 0,
      maxScore: 5,
    },
  ]

  const chartConfig = {
    score: {
      label: "スコア",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">🌿 初回問診 結果表示</h1>
        <p className="text-slate-600 leading-relaxed">あなたの体質傾向をグラフで確認してみましょう</p>
      </div>

      {/* 気血水のバランス */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-slate-800 text-center">気血水のバランス</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
            <RadarChart data={qiBloodFluidData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarGrid className="stroke-slate-300" />
              <PolarAngleAxis
                dataKey="category"
                className="text-sm fill-slate-600"
                tick={{ fontSize: 14, fill: "#64748b" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                className="text-xs fill-slate-400"
                tick={{ fontSize: 10, fill: "#cbd5e1" }}
              />
              <Radar
                dataKey="score"
                stroke="#93c5fd"
                fill="#93c5fd"
                fillOpacity={0.4}
                strokeWidth={2}
                dot={{ fill: "#93c5fd", strokeWidth: 2, r: 4 }}
              />
            </RadarChart>
          </ChartContainer>

          {/* スコア詳細 */}
          <div className="mt-6 space-y-3">
            {qiBloodFluidData.map((item) => (
              <div key={item.category} className="flex justify-between items-center">
                <span className="text-slate-700 font-medium">{item.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 w-12 text-right">
                    {item.score}/{item.maxScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 五臓のバランス */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-slate-800 text-center">五臓のバランス</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
            <RadarChart data={fiveOrgansData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarGrid className="stroke-slate-300" />
              <PolarAngleAxis
                dataKey="category"
                className="text-sm fill-slate-600"
                tick={{ fontSize: 14, fill: "#64748b" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                className="text-xs fill-slate-400"
                tick={{ fontSize: 10, fill: "#cbd5e1" }}
              />
              <Radar
                dataKey="score"
                stroke="#86efac"
                fill="#86efac"
                fillOpacity={0.4}
                strokeWidth={2}
                dot={{ fill: "#86efac", strokeWidth: 2, r: 4 }}
              />
            </RadarChart>
          </ChartContainer>

          {/* スコア詳細 */}
          <div className="mt-6 space-y-3">
            {fiveOrgansData.map((item) => (
              <div key={item.category} className="flex justify-between items-center">
                <span className="text-slate-700 font-medium">{item.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 w-12 text-right">
                    {item.score}/{item.maxScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* その他の体質傾向 */}
      {(() => {
        const hasPositiveScore = [...qiBloodFluidData, ...fiveOrgansData, ...otherConstitutionData].some(
          (item) => item.score > 0,
        )
        return hasPositiveScore
      })() && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-800 text-center">あなたの体質傾向</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(() => {
                // 全ての体質データを統合してスコア順にソート
                const allConstitutionData = [
                  ...qiBloodFluidData.map((item) => ({ ...item, category: item.category })),
                  ...fiveOrgansData.map((item) => ({ ...item, category: item.category })),
                  ...otherConstitutionData.map((item) => ({ ...item, category: item.category })),
                ]

                // スコアが0より大きいものをフィルタリングしてソート
                const sortedData = allConstitutionData
                  .filter((item) => item.score > 0)
                  .sort((a, b) => b.score - a.score)

                // 上位3つのスコア値を取得（同スコアも含む）
                const topScores = [...new Set(sortedData.map((item) => item.score))].slice(0, 3)
                const topItems = sortedData.filter((item) => topScores.includes(item.score))

                return topItems.map((item, index) => (
                  <div key={item.category} className="flex justify-between items-center">
                    <span className="text-slate-700 font-medium">{item.category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${index === 0 ? "bg-red-500" : index === 1 ? "bg-orange-500" : "bg-purple-500"} rounded-full transition-all duration-500`}
                          style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600 w-12 text-right">
                        {item.score}/{item.maxScore}
                      </span>
                    </div>
                  </div>
                ))
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 解説 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-slate-800 mb-3">結果の見方</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              このグラフはあなたの体質傾向を示しています。スコアが高いほどその傾向が強いことを表します。
              <br />
              <br />
              東洋医学では、これらのバランスを整えることで健康維持を目指します。
              気になる項目がある場合は、専門家にご相談することをおすすめします。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* アクションボタン */}
      <div className="space-y-3">
        <button
          onClick={onRetakeQuiz}
          className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
        >
          もう一度体質チェックをする
        </button>
        <button
          onClick={onSaveCallback}
          className="w-full h-14 text-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200"
        >
          アカウント作成して保存
        </button>
      </div>
    </div>
  )
}
