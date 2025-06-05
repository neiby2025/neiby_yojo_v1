"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import dailyCheckData from "../data/daily-check.json"

interface Option {
  text: string
  score: Record<string, number>
}

interface Question {
  id: string
  label: string
  type: string
  options: Option[]
}

interface Section {
  id: string
  title: string
  questions: Question[]
}

interface DailyCheckData {
  sections: Section[]
}

type StepType = "questions" | "wellness" | "advice" | "complete"

export default function DailyHealthCheck() {
  const [currentStep, setCurrentStep] = useState<StepType>("questions")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [bodyCondition, setBodyCondition] = useState([3])
  const [mindCondition, setMindCondition] = useState([3])
  const [freeText, setFreeText] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [advice, setAdvice] = useState("")

  const data = dailyCheckData as DailyCheckData
  const questions = data.sections[0].questions

  const handleAnswer = async (questionId: string, answer: string) => {
    setIsAnimating(true)
    setAnswers({ ...answers, [questionId]: answer })

    await new Promise((resolve) => setTimeout(resolve, 300))

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setCurrentStep("wellness")
    }

    setIsAnimating(false)
  }

  const handleGoBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateScores = () => {
    const scores: Record<string, number> = {}

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find((q) => q.id === questionId)
      if (question) {
        const option = question.options.find((opt) => opt.text === answer)
        if (option?.score) {
          Object.entries(option.score).forEach(([key, value]) => {
            scores[key] = (scores[key] || 0) + value
          })
        }
      }
    })

    return scores
  }

  const generateAdvice = (scores: Record<string, number>) => {
    const adviceMessages = []

    if (scores["虚"] >= 2) {
      adviceMessages.push("体力や気力が不足気味のようですね。十分な休息と栄養のある食事を心がけましょう。")
    }

    if (scores["実"] >= 2) {
      adviceMessages.push("体に余分なエネルギーが溜まっているようです。軽い運動やストレッチで発散させましょう。")
    }

    if (scores["寒"] >= 2) {
      adviceMessages.push("体が冷えているようです。温かい飲み物や食べ物を摂り、体を温めることを意識してください。")
    }

    if (scores["熱"] >= 2) {
      adviceMessages.push("体に熱がこもっているようです。涼しい環境で過ごし、水分補給を心がけましょう。")
    }

    if (scores["陰"] >= 2) {
      adviceMessages.push("体の潤いが不足しているようです。水分をしっかり摂り、質の良い睡眠を取りましょう。")
    }

    if (scores["陽"] >= 2) {
      adviceMessages.push("活動的なエネルギーが高まっているようです。適度な運動でバランスを取りましょう。")
    }

    if (adviceMessages.length === 0) {
      adviceMessages.push("今日の体調は良好のようですね！この調子で規則正しい生活を続けていきましょう。")
    }

    return adviceMessages.join("\n\n")
  }

  const handleWellnessSubmit = async () => {
    setIsAnimating(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const scores = calculateScores()
    const generatedAdvice = generateAdvice(scores)
    setAdvice(generatedAdvice)
    setCurrentStep("advice")

    setIsAnimating(false)
  }

  const handleSaveRecord = async () => {
    setIsAnimating(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // ここで実際の保存処理を行う
    console.log("Saving daily record:", {
      answers,
      bodyCondition: bodyCondition[0],
      mindCondition: mindCondition[0],
      freeText,
      scores: calculateScores(),
    })

    setCurrentStep("complete")
    setIsAnimating(false)
  }

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex]
    if (!question) return null

    return (
      <div
        className={`transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
      >
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-xl font-medium text-slate-800 mb-8 leading-relaxed">{question.label}</h3>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(question.id, option.text)}
                  variant="outline"
                  className="w-full h-auto p-4 text-left border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all duration-200 text-slate-700"
                >
                  <span className="leading-relaxed">{option.text}</span>
                </Button>
              ))}
            </div>

            {/* 戻るボタン */}
            {currentQuestionIndex > 0 && (
              <Button
                onClick={handleGoBack}
                variant="ghost"
                className="w-full h-10 text-sm text-slate-500 hover:text-slate-700 mt-6"
              >
                ← 1つ前の質問に戻る
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderWellness = () => (
    <div
      className={`space-y-6 transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-800 text-center">今日の体感記録</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* からだの調子 */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-700">今日のからだの調子はどうでしたか？</h4>
            <div className="space-y-3">
              <Slider
                value={bodyCondition}
                onValueChange={setBodyCondition}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-600">
                <span>とても悪い</span>
                <span>悪い</span>
                <span>普通</span>
                <span>良い</span>
                <span>とても良い</span>
              </div>
              <p className="text-center text-slate-700 font-medium">現在の評価: {bodyCondition[0]} / 5</p>
            </div>
          </div>

          {/* こころの調子 */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-700">今日のこころの調子はどうでしたか？</h4>
            <div className="space-y-3">
              <Slider
                value={mindCondition}
                onValueChange={setMindCondition}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-600">
                <span>とても悪い</span>
                <span>悪い</span>
                <span>普通</span>
                <span>良い</span>
                <span>とても良い</span>
              </div>
              <p className="text-center text-slate-700 font-medium">現在の評価: {mindCondition[0]} / 5</p>
            </div>
          </div>

          {/* 自由記述 */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-700">その他、気になることがあれば教えてください</h4>
            <Textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="例：少し疲れ気味でしたが元気でした"
              className="min-h-24 text-lg border-2 border-slate-200 rounded-xl resize-none focus:border-blue-500 transition-colors"
            />
          </div>

          <Button
            onClick={handleWellnessSubmit}
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
          >
            アドバイスを見る
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderAdvice = () => (
    <div
      className={`space-y-6 transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
    >
      {/* よもぎ先生のアドバイス */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">🧑‍🦳</div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-slate-800 mb-3">よもぎ先生からのアドバイス</h3>
              <div className="bg-white/80 rounded-xl p-4 shadow-sm">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{advice}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 保存ボタン */}
      <Button
        onClick={handleSaveRecord}
        className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
      >
        今日の記録を保存する
      </Button>
    </div>
  )

  const renderComplete = () => (
    <div className="text-center">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-6xl mb-6">✨</div>
          <h3 className="text-2xl font-medium text-slate-800 mb-4">記録完了</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            今日の体調チェックが完了しました。
            <br />
            毎日続けることで、より良い養生法をご提案できます。
          </p>
          <Button
            onClick={() => {
              // ダッシュボードに戻る処理
              window.location.reload()
            }}
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
          >
            ダッシュボードに戻る
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const getProgress = () => {
    if (currentStep === "questions") {
      return ((currentQuestionIndex + 1) / questions.length) * 50
    } else if (currentStep === "wellness") {
      return 75
    } else if (currentStep === "advice") {
      return 90
    } else {
      return 100
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">🌿 今日の体調チェック</h1>
          <p className="text-slate-600 leading-relaxed">
            今の体の状態をチェックして、
            <br />
            養生アドバイスを受けましょう
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>進捗状況</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <Progress value={getProgress()} className="h-3 bg-slate-200" />
        </div>

        {/* メインコンテンツ */}
        <div className="mb-8">
          {currentStep === "questions" && renderQuestion()}
          {currentStep === "wellness" && renderWellness()}
          {currentStep === "advice" && renderAdvice()}
          {currentStep === "complete" && renderComplete()}
        </div>

        {/* ステップ表示 */}
        {currentStep === "questions" && (
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              質問 {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
