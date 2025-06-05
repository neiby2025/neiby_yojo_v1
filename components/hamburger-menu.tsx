"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut, Settings, Home } from "lucide-react"

interface HamburgerMenuProps {
  onNavigate?: (page: string) => void
  currentUser?: {
    email: string
    name?: string
  }
  isLoggedIn?: boolean
}

export default function HamburgerMenu({ onNavigate, currentUser, isLoggedIn = false }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigation = (page: string) => {
    setIsOpen(false)
    if (onNavigate) {
      onNavigate(page)
    }
  }

  const handleLogout = () => {
    setIsOpen(false)
    // ログアウト処理
    console.log("Logging out...")

    // ローカルストレージやセッションストレージをクリア
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("authToken")
      sessionStorage.clear()
    }

    // 確認ダイアログを表示
    const confirmLogout = confirm("ログアウトしますか？")
    if (confirmLogout) {
      // ログアウト成功メッセージ
      alert("ログアウトしました")

      // 初回問診ページに遷移（ログイン状態をfalseにして）
      if (onNavigate) {
        onNavigate("logout") // 特別なログアウトアクションを送信
      } else {
        // フォールバック：ページをリロード
        window.location.reload()
      }
    }
  }

  const menuItems = isLoggedIn
    ? [
        {
          id: "dashboard",
          label: "ダッシュボード",
          icon: <Home size={20} />,
          description: "ホーム画面に戻る",
        },
        {
          id: "settings",
          label: "設定",
          icon: <Settings size={20} />,
          description: "アカウント設定",
        },
      ]
    : [
        {
          id: "user-registration",
          label: "ユーザー登録",
          icon: <User size={20} />,
          description: "新しいアカウントを作成",
        },
        {
          id: "login",
          label: "ログイン",
          icon: <LogOut size={20} />,
          description: "既存アカウントでログイン",
        },
      ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white/90 rounded-full w-12 h-12"
        >
          <Menu className="h-6 w-6 text-slate-700" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-gradient-to-b from-blue-50 to-indigo-50 overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-left text-xl font-bold text-slate-800">🌿 養生アプリ</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* ユーザー情報 */}
          {isLoggedIn && currentUser && (
            <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{currentUser.name || "ユーザー"}</p>
                  <p className="text-sm text-slate-600">{currentUser.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* メニューアイテム */}
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className="w-full text-left p-4 bg-white/60 hover:bg-white/80 rounded-xl transition-all duration-200 backdrop-blur-sm group"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600 group-hover:text-blue-700 transition-colors">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 group-hover:text-slate-900">{item.label}</h3>
                    <p className="text-sm text-slate-600 group-hover:text-slate-700">{item.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ログアウトボタン */}
          {isLoggedIn && (
            <div className="pt-4 border-t border-slate-200 mt-4">
              <button
                onClick={handleLogout}
                className="w-full text-left p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 group"
                type="button"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-red-600 group-hover:text-red-700 transition-colors">
                    <LogOut size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-800 group-hover:text-red-900">ログアウト</h3>
                    <p className="text-sm text-red-600 group-hover:text-red-700">アカウントからログアウト</p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="mt-8 mb-2">
          <div className="text-center text-xs text-slate-500">
            <p>養生アプリ v1.0</p>
            <p>© 2024 Health & Wellness</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
