"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, RefreshCw } from "lucide-react"
import { generatePersonalizedWellnessAdvice } from "@/lib/wellness-ai"

interface AIWellnessAdviceProps {
  scores: Record<string, number>
  userSymptoms?: string
}

export default function AIWellnessAdvice({ scores, userSymptoms }: AIWellnessAdviceProps) {
  const [advice, setAdvice] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [lastGenerated, setLastGenerated] = useState<string>("")

  const generateAdvice = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await generatePersonalizedWellnessAdvice(scores, userSymptoms)

      if (result.success) {
        setAdvice(result.advice)
        setLastGenerated(result.timestamp)
      } else {
        setAdvice(result.advice)
        setError(result.error || "アドバイスの生成に失敗しました")
        setLastGenerated(result.timestamp)
      }
    } catch (err) {
      setError("アドバイスの生成中にエラーが発生しました")
      console.error("Advice generation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // コンポーネントマウント時に自動でアドバイスを生成
    generateAdvice()
  }, [])

  const formatAdvice = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("【") && line.endsWith("】")) {
        return (
          <h3 key={index} className="text-lg font-medium text-slate-800 mt-4 mb-2 first:mt-0">
            {line}
          </h3>
        )
      } else if (line.startsWith("•") || line.startsWith("・")) {
        return (
          <li key={index} className="text-slate-700 leading-relaxed ml-4 mb-1">
            {line.substring(1).trim()}
          </li>
        )
      } else if (line.trim()) {
        return (
          <p key={index} className="text-slate-700 leading-relaxed mb-2">
            {line}
          </p>
        )
      }
      return <br key={index} />
    })
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-slate-800 flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <span>AI養生アドバイス</span>
        </CardTitle>
        {lastGenerated && (
          <p className="text-sm text-slate-500">生成日時: {new Date(lastGenerated).toLocaleString("ja-JP")}</p>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-2 text-slate-600">AI がアドバイスを生成中...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="bg-white/80 rounded-xl p-4 shadow-sm">
              <div className="prose prose-sm max-w-none">{formatAdvice(advice)}</div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={generateAdvice}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span>新しいアドバイスを生成</span>
              </Button>

              <div className="text-xs text-slate-500">Powered by AI</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
