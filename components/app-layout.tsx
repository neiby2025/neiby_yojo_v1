"use client"

import type React from "react"

import { useState } from "react"
import HamburgerMenu from "./hamburger-menu"
import ResultsScreen from "./results-screen"
import DailyHealthCheck from "./daily-health-check"
import WellnessAdvice from "./wellness-advice"
import Dashboard from "./dashboard"

interface AppLayoutProps {
  children?: React.ReactNode
  currentUser?: {
    email: string
    name?: string
  }
  initialPage?: string
  isLoggedIn?: boolean
  onLogout?: () => void
  onLogin?: (user: { email: string; name?: string }) => void
  onStartQuestionnaire?: () => void
}

export default function AppLayout({
  children,
  currentUser,
  initialPage = "dashboard",
  isLoggedIn = false,
  onLogout,
  onLogin,
  onStartQuestionnaire,
}: AppLayoutProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  // サンプルデータ（実際のアプリでは API から取得）
  const sampleScores = {
    気虚: 2,
    血虚: 1,
    水滞: 0,
    肝の不調: 1,
    心の不調: 2,
    脾の不調: 1,
    肺の不調: 0,
    腎の不調: 1,
    気滞: 1,
    瘀血: 0,
  }

  const handleNavigation = (page: string) => {
    if (page === "logout") {
      // ログアウト時は初回問診ページに遷移し、ログイン状態をfalseにする
      setCurrentPage("initial-questionnaire")
      if (onLogout) {
        onLogout() // 親コンポーネントにログアウトを通知
      }
      return
    }

    if (page === "initial-questionnaire" && onStartQuestionnaire) {
      // 問診開始の場合は親コンポーネントに通知
      onStartQuestionnaire()
      return
    }

    setCurrentPage(page)
  }

  const handleLogin = (user: { email: string; name?: string }) => {
    if (onLogin) {
      onLogin(user)
    }
    setCurrentPage("dashboard")
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "initial-results":
        return <ResultsScreen scores={sampleScores} />
      case "daily-check":
        return <DailyHealthCheck />
      case "wellness-advice":
        return <WellnessAdvice />
      case "settings":
        return <SettingsPage />
      case "history":
        return <HistoryPage />
      case "initial-questionnaire":
        return <InitialQuestionnaire handleNavigation={handleNavigation} />
      case "user-registration":
        return <UserRegistrationPage handleNavigation={handleNavigation} onRegister={handleLogin} />
      case "login":
        return <LoginPage handleNavigation={handleNavigation} onLogin={handleLogin} />
      case "dashboard":
      default:
        return (
          <Dashboard
            onNavigate={handleNavigation}
            currentUser={currentUser}
            onStartQuestionnaire={onStartQuestionnaire}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <HamburgerMenu onNavigate={handleNavigation} currentUser={currentUser} isLoggedIn={isLoggedIn} />
      <div className="pt-4">{renderCurrentPage()}</div>
    </div>
  )
}

// 履歴ページ
function HistoryPage() {
  const historyData = [
    { date: "2024-01-15", bodyScore: 4, mindScore: 3, mainSymptom: "特になし", advice: "バランスの良い状態です" },
    { date: "2024-01-14", bodyScore: 3, mindScore: 4, mainSymptom: "少し疲れ気味", advice: "十分な休息を取りましょう" },
    {
      date: "2024-01-13",
      bodyScore: 5,
      mindScore: 5,
      mainSymptom: "とても調子が良い",
      advice: "この調子を維持しましょう",
    },
    { date: "2024-01-12", bodyScore: 2, mindScore: 3, mainSymptom: "頭痛", advice: "水分補給と休息を心がけて" },
    {
      date: "2024-01-11",
      bodyScore: 4,
      mindScore: 2,
      mainSymptom: "ストレス",
      advice: "リラックスする時間を作りましょう",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">📊 記録履歴</h1>
        <p className="text-slate-600 leading-relaxed">
          これまでの体調チェック
          <br />
          記録を確認できます
        </p>
      </div>

      <div className="space-y-4">
        {historyData.map((record, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-slate-800">
                {new Date(record.date).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                  からだ {record.bodyScore}/5
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  こころ {record.mindScore}/5
                </span>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-2">主な症状: {record.mainSymptom}</p>
            <p className="text-slate-700 text-sm bg-slate-50 p-2 rounded-lg">{record.advice}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// 設定ページ
function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">⚙️ 設定</h1>
        <p className="text-slate-600 leading-relaxed">
          アカウント設定と
          <br />
          アプリの設定
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-slate-800 mb-2">アカウント設定</h2>
          <p className="text-slate-600 text-sm leading-relaxed">プロフィール情報の編集やパスワードの変更ができます。</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-slate-800 mb-2">通知設定</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            体調チェックのリマインダーや養生アドバイスの通知設定。
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-slate-800 mb-2">データ管理</h2>
          <p className="text-slate-600 text-sm leading-relaxed">記録データのエクスポートやバックアップ設定。</p>
        </div>
      </div>
    </div>
  )
}

interface InitialQuestionnaireProps {
  handleNavigation: (page: string) => void
}

// 初回問診ページ
function InitialQuestionnaire({ handleNavigation }: InitialQuestionnaireProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">🌿 養生アプリへようこそ</h1>
        <p className="text-slate-600 leading-relaxed">
          まずは初回問診で
          <br />
          あなたの体質をチェックしましょう
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-lg font-medium text-slate-800 mb-3">初回問診について</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            東洋医学に基づいた問診で、あなたの体質傾向を分析します。
            <br />
            所要時間は約5-10分です。
          </p>
          <button
            onClick={() => handleNavigation("initial-questionnaire")}
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
          >
            問診を開始する
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-slate-800 mb-3 text-center">問診の流れ</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                1
              </div>
              <span className="text-slate-700 text-sm">気血水のバランスチェック</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                2
              </div>
              <span className="text-slate-700 text-sm">五臓の状態チェック</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                3
              </div>
              <span className="text-slate-700 text-sm">主な症状の確認</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium text-sm">
                4
              </div>
              <span className="text-slate-700 text-sm">結果表示と養生法提案</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface UserRegistrationPageProps {
  handleNavigation: (page: string) => void
  onRegister: (user: { email: string; name?: string }) => void
}

// ユーザー登録ページ
function UserRegistrationPage({ handleNavigation, onRegister }: UserRegistrationPageProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>(
    {},
  )
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {}

    // 名前の検証
    if (!name.trim()) {
      newErrors.name = "お名前を入力してください"
    }

    // メールアドレスの検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      newErrors.email = "メールアドレスを入力してください"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "正しいメールアドレスを入力してください"
    }

    // パスワードの検証
    if (!password) {
      newErrors.password = "パスワードを入力してください"
    } else if (password.length < 6) {
      newErrors.password = "パスワードは6文字以上で入力してください"
    }

    // パスワード確認の検証
    if (!confirmPassword) {
      newErrors.confirmPassword = "パスワード（確認）を入力してください"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // 実際のアプリでは、ここでAPIリクエストを送信してユーザー登録を行う
      // 今回はモックの処理を行う
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // ローカルストレージにユーザー情報を保存（実際のアプリではセキュアな方法を使用）
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify({ email, name }))
        localStorage.setItem("authToken", "dummy-token-" + Math.random().toString(36).substring(2, 15))
      }

      // 登録成功
      alert("アカウントが作成されました！")

      // ログイン状態に移行
      onRegister({ email, name })
    } catch (error) {
      console.error("Registration error:", error)
      alert("登録に失敗しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">👤 ユーザー登録</h1>
        <p className="text-slate-600 leading-relaxed">
          アカウントを作成して
          <br />
          健康記録を保存しましょう
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-slate-800 mb-4">新規アカウント作成</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">お名前</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full h-12 px-4 border-2 ${
                  errors.name ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                } rounded-xl transition-colors`}
                placeholder="山田太郎"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-12 px-4 border-2 ${
                  errors.email ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                } rounded-xl transition-colors`}
                placeholder="example@email.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-12 px-4 border-2 ${
                  errors.password ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                } rounded-xl transition-colors`}
                placeholder="6文字以上で入力"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">パスワード（確認）</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full h-12 px-4 border-2 ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-500"
                } rounded-xl transition-colors`}
                placeholder="同じパスワードを入力"
              />
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
            >
              {isLoading ? "登録中..." : "アカウントを作成"}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-slate-600 text-sm">
            すでにアカウントをお持ちの方は
            <br />
            <button onClick={() => handleNavigation("login")} className="text-blue-600 hover:text-blue-700 font-medium">
              こちらからログイン
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

interface LoginPageProps {
  handleNavigation: (page: string) => void
  onLogin: (user: { email: string; name?: string }) => void
}

// ログインページ
function LoginPage({ handleNavigation, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    // メールアドレスの検証
    if (!email) {
      newErrors.email = "メールアドレスを入力してください"
    }

    // パスワードの検証
    if (!password) {
      newErrors.password = "パスワードを入力してください"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // 実際のアプリでは、ここでAPIリクエストを送信してログイン認証を行う
      // 今回はモックの処理を行う
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // デモ用のログイン処理（実際のアプリでは適切な認証を行う）
      if (email === "demo@example.com" && password === "password") {
        // ログイン成功
        const user = { email, name: "デモユーザー" }

        // ローカルストレージにユーザー情報を保存（実際のアプリではセキュアな方法を使用）
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user))
          localStorage.setItem("authToken", "dummy-token-" + Math.random().toString(36).substring(2, 15))
        }

        onLogin(user)
      } else {
        // ログイン失敗
        setErrors({ general: "メールアドレスまたはパスワードが正しくありません" })
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "ログインに失敗しました。もう一度お試しください。" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">🔐 ログイン</h1>
        <p className="text-slate-600 leading-relaxed">
          アカウントにログインして
          <br />
          健康記録を確認しましょう
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-slate-800 mb-4">ログイン</h2>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {errors.general}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-12 px-4 border-2 ${
                  errors.email ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                } rounded-xl transition-colors`}
                placeholder="example@email.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-12 px-4 border-2 ${
                  errors.password ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                } rounded-xl transition-colors`}
                placeholder="パスワードを入力"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              <div className="text-right mt-1">
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
                  パスワードをお忘れですか？
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          {/* デモ用のヒント */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>デモ用アカウント:</strong>
              <br />
              メールアドレス: demo@example.com
              <br />
              パスワード: password
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-600 text-sm">
            アカウントをお持ちでない方は
            <br />
            <button
              onClick={() => handleNavigation("user-registration")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              こちらから新規登録
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
