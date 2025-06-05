"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Brain } from "lucide-react"
import { generateDailyAdvice } from "@/lib/wellness-ai"

interface DailyAIAdviceProps {
  dailyScores: Record<string, number>
  bodyCondition: number
  mindCondition: number
  symptoms?: string
}

export default function DailyAIAdvice({ dailyScores, bodyCondition, mindCondition, symptoms }: DailyAIAdviceProps) {
  const [advice, setAdvice] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [hasGenerated, setHasGenerated] = useState(false)

  const generateAdvice = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await generateDailyAdvice(dailyScores, bodyCondition, mindCondition, symptoms)

      if (result.success) {
        setAdvice(result.advice)
      } else {
        setAdvice(result.advice)
        setError(result.error || "アドバイスの生成に失敗しました")
      }
      setHasGenerated(true)
    } catch (err) {
      setError("アドバイスの生成中にエラーが発生しました")
      console.error("Daily advice generation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasGenerated && !isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">AI による今日のアドバイス</h3>
          <p className="text-slate-600 mb-4 text-sm">
            今日の体調チェック結果を分析して、
            <br />
            あなたに最適な一日の過ごし方をご提案します
          </p>
          <Button onClick={generateAdvice} className="bg-green-600 hover:bg-green-700 text-white">
            <Brain className="w-4 h-4 mr-2" />
            アドバイスを生成
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-slate-800 flex items-center space-x-2">
          <Brain className="w-5 h-5 text-green-600" />
          <span>今日のAIアドバイス</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            <span className="ml-2 text-slate-600">分析中...</span>
          </div>
        ) : (
          <div className="bg-white/80 rounded-xl p-4 shadow-sm">
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm">{advice}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
