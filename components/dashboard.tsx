"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Heart, Lightbulb } from "lucide-react"

interface DashboardProps {
  onNavigate?: (page: string) => void
  currentUser?: {
    email: string
    name?: string
  }
}

export default function Dashboard({ onNavigate, currentUser }: DashboardProps) {
  // サンプルデータ（実際のアプリでは API から取得）
  const [recentChecks] = useState([
    { date: "2024-01-15", bodyScore: 4, mindScore: 3, mainSymptom: "特になし" },
    { date: "2024-01-14", bodyScore: 3, mindScore: 4, mainSymptom: "少し疲れ気味" },
    { date: "2024-01-13", bodyScore: 5, mindScore: 5, mainSymptom: "とても調子が良い" },
  ])

  const [weeklyStats] = useState({
    checkCount: 5,
    averageBodyScore: 3.8,
    averageMindScore: 4.2,
    streak: 7,
  })

  const [todayAdvice] = useState({
    category: "食事の養生",
    message: "今日は体が少し冷えているようです。温かい食べ物を中心に摂り、生姜湯などで体を温めましょう。",
    icon: "🍵",
  })

  const handleQuickAction = (action: string) => {
    if (onNavigate) {
      onNavigate(action)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600"
    if (score >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 4) return "bg-green-100"
    if (score >= 3) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          🌿 おかえりなさい、{currentUser?.name || "ユーザー"}さん
        </h1>
        <p className="text-slate-600 leading-relaxed">今日も健康的な一日を過ごしましょう</p>
      </div>

      {/* 今日のクイックアクション */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium mb-1">今日の体調チェック</h2>
              <p className="text-blue-100 text-sm">まだ記録していません</p>
            </div>
            <Button
              onClick={() => handleQuickAction("daily-check")}
              className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl"
            >
              チェックする
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 今週の統計 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-slate-800 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>今週の記録</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{weeklyStats.checkCount}</div>
              <div className="text-sm text-slate-600">チェック回数</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{weeklyStats.streak}</div>
              <div className="text-sm text-slate-600">連続記録日数</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{weeklyStats.averageBodyScore.toFixed(1)}</div>
              <div className="text-sm text-slate-600">からだ平均</div>
            </div>
            <div className="text-center p-3 bg-pink-50 rounded-xl">
              <div className="text-2xl font-bold text-pink-600">{weeklyStats.averageMindScore.toFixed(1)}</div>
              <div className="text-sm text-slate-600">こころ平均</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 今日のアドバイス */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50 backdrop-blur-sm mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-slate-800 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span>今日のおすすめ</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <div className="text-3xl">{todayAdvice.icon}</div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-800 mb-2">{todayAdvice.category}</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{todayAdvice.message}</p>
              <Button
                onClick={() => handleQuickAction("wellness-advice")}
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
              >
                詳しく見る
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 最近の記録 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-slate-800 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-slate-600" />
            <span>最近の記録</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-slate-700">
                      {new Date(check.date).toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span className={getScoreColor(check.bodyScore)}>からだ {check.bodyScore}/5</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      <span className={getScoreColor(check.mindScore)}>こころ {check.mindScore}/5</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs ${getScoreBg(Math.max(check.bodyScore, check.mindScore))}`}
                >
                  {check.mainSymptom}
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={() => handleQuickAction("history")}
            variant="ghost"
            className="w-full mt-4 text-sm text-slate-600"
          >
            すべての記録を見る →
          </Button>
        </CardContent>
      </Card>

      {/* クイックアクション */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          onClick={() => handleQuickAction("initial-results")}
          variant="outline"
          className="h-20 flex-col space-y-2 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
        >
          <FileText className="w-6 h-6 text-blue-600" />
          <span className="text-sm">初回問診結果</span>
        </Button>
        <Button
          onClick={() => handleQuickAction("wellness-advice")}
          variant="outline"
          className="h-20 flex-col space-y-2 border-2 border-slate-200 hover:border-green-300 hover:bg-green-50"
        >
          <Lightbulb className="w-6 h-6 text-green-600" />
          <span className="text-sm">養生アドバイス</span>
        </Button>
      </div>

      {/* 継続のモチベーション */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">素晴らしい継続力です！</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            {weeklyStats.streak}日連続で記録を続けています。
            <br />
            この調子で健康習慣を維持しましょう！
          </p>
          <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((weeklyStats.streak / 30) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500">30日連続まで あと{Math.max(30 - weeklyStats.streak, 0)}日</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Import statements for icons
import { FileText } from "lucide-react"
