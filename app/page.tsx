"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import questionsData from "../data/questions.json"
import ResultsScreen from "@/components/results-screen"
import SignupScreen from "@/components/signup-screen"
import AppLayout from "@/components/app-layout"

interface Option {
  text: string
  score: Record<string, number>
}

interface Question {
  id: string
  label: string
  type: "binary" | "multi"
  score?: Record<string, number>
  options?: Option[]
}

interface MainQuestion {
  id: string
  label: string
  type: "binary"
  score: Record<string, number>
  follow_up?: {
    condition: string
    questions: Question[]
  }
}

interface Section {
  id: string
  title: string
  children: MainQuestion[]
}

interface QuestionsData {
  sections: Section[]
}

type StepType = "main" | "followup" | "complaint" | "complete" | "results" | "signup" | "dashboard"

interface CurrentStep {
  type: StepType
  sectionIndex: number
  questionIndex: number
  followUpIndex?: number
}

interface User {
  email: string
  name?: string
}

export default function HealthCheckApp() {
  const [currentStep, setCurrentStep] = useState<CurrentStep>({
    type: "dashboard", // ダッシュボードから開始
    sectionIndex: 0,
    questionIndex: 0,
  })
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [complaint, setComplaint] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // ログイン状態を管理
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined)

  // ページ読み込み時にローカルストレージからユーザー情報を取得
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      const authToken = localStorage.getItem("authToken")

      if (storedUser && authToken) {
        try {
          const user = JSON.parse(storedUser) as User
          setCurrentUser(user)
          setIsLoggedIn(true)
        } catch (error) {
          console.error("Failed to parse stored user:", error)
          // エラー時はログアウト状態にする
          localStorage.removeItem("user")
          localStorage.removeItem("authToken")
        }
      }
    }
  }, [])

  const data = questionsData as QuestionsData

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(undefined)

    // ローカルストレージからユーザー情報を削除
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("authToken")
    }

    setCurrentStep({
      type: "main",
      sectionIndex: 0,
      questionIndex: 0,
    })
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setIsLoggedIn(true)
    setCurrentStep({
      type: "dashboard",
      sectionIndex: 0,
      questionIndex: 0,
    })
  }

  const startQuestionnaire = () => {
    console.log("問診を開始します...")
    // 問診データをクリア
    setAnswers({})
    setComplaint("")
    // 問診の最初の質問に遷移
    setCurrentStep({
      type: "main",
      sectionIndex: 0,
      questionIndex: 0,
    })
    console.log("問診画面に遷移しました")
  }

  const backToDashboard = () => {
    setCurrentStep({
      type: "dashboard",
      sectionIndex: 0,
      questionIndex: 0,
    })
  }

  // 全ての質問数を計算
  const getTotalQuestions = () => {
    let total = 0
    data.sections.forEach((section) => {
      section.children.forEach((question) => {
        total++ // メイン質問
        if (question.follow_up) {
          total += question.follow_up.questions.length // フォローアップ質問
        }
      })
    })
    return total + 1 // 主訴の質問も含める
  }

  // 現在の進捗を計算
  const getCurrentProgress = () => {
    let completed = 0

    // 完了したセクションの質問数をカウント
    for (let i = 0; i < currentStep.sectionIndex; i++) {
      data.sections[i].children.forEach((question) => {
        completed++
        if (question.follow_up) {
          completed += question.follow_up.questions.length
        }
      })
    }

    // 現在のセクション内の完了した質問数をカウント
    if (currentStep.sectionIndex < data.sections.length) {
      for (let i = 0; i < currentStep.questionIndex; i++) {
        const question = data.sections[currentStep.sectionIndex].children[i]
        completed++
        if (question.follow_up) {
          completed += question.follow_up.questions.length
        }
      }

      // 現在の質問の進捗
      if (currentStep.type === "followup" && currentStep.followUpIndex !== undefined) {
        completed += 1 + currentStep.followUpIndex
      } else if (
        currentStep.type === "main" &&
        currentStep.questionIndex < data.sections[currentStep.sectionIndex].children.length
      ) {
        // メイン質問が回答済みの場合
        if (answers[getCurrentQuestion()?.id || ""] !== undefined) {
          completed++
        }
      }
    }

    if (currentStep.type === "complaint") {
      completed = getTotalQuestions() - 1
    } else if (currentStep.type === "complete") {
      completed = getTotalQuestions()
    }

    return Math.min((completed / getTotalQuestions()) * 100, 100)
  }

  const getCurrentQuestion = () => {
    if (currentStep.type === "complaint") return null
    if (currentStep.type === "complete") return null
    if (currentStep.type === "results") return null

    const section = data.sections[currentStep.sectionIndex]
    if (!section) return null

    const mainQuestion = section.children[currentStep.questionIndex]
    if (!mainQuestion) return null

    if (currentStep.type === "main") {
      return mainQuestion
    } else if (currentStep.type === "followup" && currentStep.followUpIndex !== undefined) {
      return mainQuestion.follow_up?.questions[currentStep.followUpIndex] || null
    }

    return null
  }

  const handleGoBack = () => {
    // 現在のステップに応じて戻る処理を分岐
    if (currentStep.type === "followup" && currentStep.followUpIndex !== undefined) {
      if (currentStep.followUpIndex > 0) {
        // フォローアップ質問の場合、前のフォローアップ質問に戻る
        setCurrentStep({
          ...currentStep,
          followUpIndex: currentStep.followUpIndex - 1,
        })
      } else {
        // 最初のフォローアップ質問の場合、親のメイン質問に戻る
        setCurrentStep({
          ...currentStep,
          type: "main",
        })
      }
    } else if (currentStep.type === "main") {
      // メイン質問の場合
      if (currentStep.questionIndex > 0) {
        // 同じセクション内の前の質問に戻る
        setCurrentStep({
          type: "main",
          sectionIndex: currentStep.sectionIndex,
          questionIndex: currentStep.questionIndex - 1,
        })
      } else if (currentStep.sectionIndex > 0) {
        // 前のセクションの最後の質問に戻る
        const prevSectionIndex = currentStep.sectionIndex - 1
        const prevSection = data.sections[prevSectionIndex]
        setCurrentStep({
          type: "main",
          sectionIndex: prevSectionIndex,
          questionIndex: prevSection.children.length - 1,
        })
      } else {
        // 最初の質問の場合、ダッシュボードに戻る
        backToDashboard()
      }
    } else if (currentStep.type === "complaint") {
      // 主訴入力画面の場合、最後の質問に戻る
      const lastSectionIndex = data.sections.length - 1
      const lastSection = data.sections[lastSectionIndex]
      setCurrentStep({
        type: "main",
        sectionIndex: lastSectionIndex,
        questionIndex: lastSection.children.length - 1,
      })
    } else if (currentStep.type === "complete") {
      // 完了画面の場合、主訴入力に戻る
      setCurrentStep({
        type: "complaint",
        sectionIndex: 0,
        questionIndex: 0,
      })
    }
  }

  const handleAnswer = async (answer: any) => {
    const question = getCurrentQuestion()
    if (!question) return

    setIsAnimating(true)

    // 回答を保存
    const newAnswers = { ...answers, [question.id]: answer }
    setAnswers(newAnswers)

    // アニメーション待機
    await new Promise((resolve) => setTimeout(resolve, 300))

    // 次のステップを決定
    if (currentStep.type === "main") {
      const mainQuestion = data.sections[currentStep.sectionIndex].children[currentStep.questionIndex]

      // フォローアップ質問があるかチェック
      if (mainQuestion.follow_up && answer === "yes") {
        setCurrentStep({
          ...currentStep,
          type: "followup",
          followUpIndex: 0,
        })
      } else {
        // 次のメイン質問へ
        moveToNextMainQuestion()
      }
    } else if (currentStep.type === "followup") {
      const mainQuestion = data.sections[currentStep.sectionIndex].children[currentStep.questionIndex]
      const followUpQuestions = mainQuestion.follow_up?.questions || []

      if (currentStep.followUpIndex !== undefined && currentStep.followUpIndex < followUpQuestions.length - 1) {
        // 次のフォローアップ質問へ
        setCurrentStep({
          ...currentStep,
          followUpIndex: currentStep.followUpIndex + 1,
        })
      } else {
        // フォローアップ質問終了、次のメイン質問へ
        moveToNextMainQuestion()
      }
    }

    setIsAnimating(false)
  }

  const moveToNextMainQuestion = () => {
    const currentSection = data.sections[currentStep.sectionIndex]

    if (currentStep.questionIndex < currentSection.children.length - 1) {
      // 同じセクション内の次の質問
      setCurrentStep({
        type: "main",
        sectionIndex: currentStep.sectionIndex,
        questionIndex: currentStep.questionIndex + 1,
      })
    } else if (currentStep.sectionIndex < data.sections.length - 1) {
      // 次のセクション
      setCurrentStep({
        type: "main",
        sectionIndex: currentStep.sectionIndex + 1,
        questionIndex: 0,
      })
    } else {
      // 全ての質問終了、主訴入力へ
      setCurrentStep({
        type: "complaint",
        sectionIndex: 0,
        questionIndex: 0,
      })
    }
  }

  const handleComplaintSubmit = async () => {
    setIsAnimating(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    setCurrentStep({
      type: "complete",
      sectionIndex: 0,
      questionIndex: 0,
    })

    setIsAnimating(false)
  }

  const calculateResults = () => {
    const scores: Record<string, number> = {}

    // 全ての回答からスコアを集計
    Object.entries(answers).forEach(([questionId, answer]) => {
      // 該当する質問を検索
      data.sections.forEach((section) => {
        section.children.forEach((mainQuestion) => {
          // メイン質問のスコア
          if (mainQuestion.id === questionId && answer === "yes" && mainQuestion.score) {
            Object.entries(mainQuestion.score).forEach(([key, value]) => {
              scores[key] = (scores[key] || 0) + value
            })
          }

          // フォローアップ質問のスコア
          if (mainQuestion.follow_up) {
            mainQuestion.follow_up.questions.forEach((followUpQ) => {
              if (followUpQ.id === questionId && Array.isArray(answer)) {
                answer.forEach((selectedOption) => {
                  const option = followUpQ.options?.find((opt) => opt.text === selectedOption)
                  if (option?.score) {
                    Object.entries(option.score).forEach(([key, value]) => {
                      scores[key] = (scores[key] || 0) + value
                    })
                  }
                })
              }
            })
          }
        })
      })
    })

    return scores
  }

  const handleMultiSelect = (questionId: string, optionText: string, checked: boolean) => {
    const currentAnswers = answers[questionId] || []
    let newAnswers

    if (checked) {
      newAnswers = [...currentAnswers, optionText]
    } else {
      newAnswers = currentAnswers.filter((answer: string) => answer !== optionText)
    }

    setAnswers({ ...answers, [questionId]: newAnswers })
  }

  const renderQuestion = () => {
    const question = getCurrentQuestion()
    if (!question) return null

    return (
      <div
        className={`transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
      >
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-xl font-medium text-slate-800 mb-8 leading-relaxed">{question.label}</h3>

            {question.type === "binary" ? (
              <div className="space-y-4">
                <Button
                  onClick={() => handleAnswer("yes")}
                  className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  はい
                </Button>
                <Button
                  onClick={() => handleAnswer("no")}
                  variant="outline"
                  className="w-full h-14 text-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200"
                >
                  いいえ
                </Button>
                {/* 戻るボタン */}
                <Button
                  onClick={handleGoBack}
                  variant="ghost"
                  className="w-full h-10 text-sm text-slate-500 hover:text-slate-700 mt-4"
                >
                  ← 前に戻る
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  {question.options?.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Checkbox
                        id={`${question.id}-${index}`}
                        checked={(answers[question.id] || []).includes(option.text)}
                        onCheckedChange={(checked) => handleMultiSelect(question.id, option.text, checked as boolean)}
                        className="w-5 h-5"
                      />
                      <label
                        htmlFor={`${question.id}-${index}`}
                        className="text-slate-700 cursor-pointer flex-1 leading-relaxed"
                      >
                        {option.text}
                      </label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => handleAnswer(answers[question.id] || [])}
                  className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                  disabled={!answers[question.id] || answers[question.id].length === 0}
                >
                  次へ進む
                </Button>
                {/* 戻るボタン */}
                <Button
                  onClick={handleGoBack}
                  variant="ghost"
                  className="w-full h-10 text-sm text-slate-500 hover:text-slate-700 mt-2"
                >
                  ← 前に戻る
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderComplaint = () => (
    <div
      className={`transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <h3 className="text-xl font-medium text-slate-800 mb-6 leading-relaxed">
            今、一番気になる不調はありますか？
          </h3>
          <Textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="眠りが浅い、食欲がない、疲れが取れない など"
            className="min-h-32 text-lg border-2 border-slate-200 rounded-xl resize-none focus:border-blue-500 transition-colors"
          />
          <Button
            onClick={handleComplaintSubmit}
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg mt-6"
          >
            次へ進む
          </Button>
          {/* 戻るボタン */}
          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="w-full h-10 text-sm text-slate-500 hover:text-slate-700 mt-2"
          >
            ← 前に戻る
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderComplete = () => (
    <div className="text-center">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-6xl mb-6">🎉</div>
          <h3 className="text-2xl font-medium text-slate-800 mb-4">問診完了</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            お疲れさまでした。
            <br />
            回答内容を分析して、あなたに最適な養生法をご提案いたします。
          </p>
          <Button
            onClick={() => setCurrentStep({ type: "results", sectionIndex: 0, questionIndex: 0 })}
            className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
          >
            結果を見る
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const handleSignUp = (email: string, password: string) => {
    // ここで実際のユーザー登録処理を行う
    console.log("User registration:", { email, password })

    // 登録成功後の処理（例：結果の保存、ダッシュボードへの遷移など）
    alert("アカウントが作成されました！結果が保存されました。")
  }

  const renderResults = () => {
    return (
      <ResultsScreen
        scores={calculateResults()}
        onRetakeQuiz={startQuestionnaire}
        /*onSaveCallback={() => setCurrentStep({ type: "signup", sectionIndex: 0, questionIndex: 0 })}*/
      />
    )
  }

  // ダッシュボード表示の条件
  if (currentStep.type === "dashboard") {
    return (
      <AppLayout
        currentUser={currentUser}
        initialPage="dashboard"
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onStartQuestionnaire={startQuestionnaire}
      />
    )
  }

  // 問診画面の表示
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">🌿 養生アプリ 初回問診フォーム</h1>
          <p className="text-slate-600 leading-relaxed">
            現在の体の状態をチェックして、
            <br />
            結果を保存しましょう
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>進捗状況</span>
            <span>{Math.round(getCurrentProgress())}%</span>
          </div>
          <Progress value={getCurrentProgress()} className="h-3 bg-slate-200" />
        </div>

        {/* 質問エリア */}
        <div className="mb-8">
          {currentStep.type === "main" || currentStep.type === "followup" ? (
            renderQuestion()
          ) : currentStep.type === "complaint" ? (
            renderComplaint()
          ) : currentStep.type === "results" ? (
            renderResults()
          ) : currentStep.type === "signup" ? (
            <SignupScreen
              onSignUp={handleSignUp}
              onBack={() => setCurrentStep({ type: "results", sectionIndex: 0, questionIndex: 0 })}
            />
          ) : (
            renderComplete()
          )}
        </div>

        {/* セクション表示 */}
        {(currentStep.type === "main" || currentStep.type === "followup") && (
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {data.sections[currentStep.sectionIndex]?.title}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
