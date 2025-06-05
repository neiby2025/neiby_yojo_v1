"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

interface SignupScreenProps {
  onSignUp: (email: string, password: string) => void
  onBack?: () => void
}

export default function SignupScreen({ onSignUp, onBack }: SignupScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

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
      // 実際の登録処理をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSignUp(email, password)
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">🌿 養生アプリ 新規登録</h1>
        <p className="text-slate-600 leading-relaxed">
          メールアドレスとパスワードで
          <br />
          アカウントを作成してください
        </p>
      </div>

      {/* 登録フォーム */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-slate-800 text-center">アカウント作成</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                メールアドレス
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className={`h-12 text-lg border-2 rounded-xl transition-colors ${
                  errors.email ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                }`}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* パスワード */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                パスワード
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6文字以上で入力してください"
                  className={`h-12 text-lg border-2 rounded-xl pr-12 transition-colors ${
                    errors.password ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* 登録ボタン */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
            >
              {isLoading ? "登録中..." : "登録する"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 注意事項 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-medium text-slate-800 mb-3">プライバシーについて</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              ご入力いただいた情報は、問診結果の保存と
              <br />
              アカウント管理のためにのみ使用いたします。
              <br />
              <br />
              第三者への提供は一切行いません。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 戻るボタン */}
      {onBack && (
        <Button
          onClick={onBack}
          variant="ghost"
          className="w-full h-12 text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← 結果画面に戻る
        </Button>
      )}
    </div>
  )
}
