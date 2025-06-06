"use client";

import React, { useState, useEffect } from "react";
import type { Metadata } from "next";
import "./globals.css";
import HamburgerMenu from "@/components/hamburger-menu";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<
    { email: string; name?: string } | undefined
  >(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken");
      if (storedUser && authToken) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          setIsLoggedIn(true);
        } catch {
          setCurrentUser(undefined);
          setIsLoggedIn(false);
        }
      } else {
        setCurrentUser(undefined);
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleNavigate = (page: string) => {
    // ページ遷移の簡易実装
    if (page === "dashboard") {
      window.location.pathname = "/";
    } else if (page === "settings") {
      // 設定ページが未実装の場合はトップへ
      window.location.pathname = "/";
    } else if (page === "daily-check") {
      window.location.pathname = "/daily-check";
    } else if (page === "user-registration") {
      // ユーザー登録ページが未実装の場合はトップへ
      window.location.pathname = "/";
    } else if (page === "login") {
      // ログインページが未実装の場合はトップへ
      window.location.pathname = "/";
    } else if (page === "logout") {
      // ログアウト処理
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      setCurrentUser(undefined);
      setIsLoggedIn(false);
      window.location.pathname = "/";
    }
  };

  return (
    <html lang="ja">
      <body>
        <HamburgerMenu
          onNavigate={handleNavigate}
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
        />
        {children}
      </body>
    </html>
  );
}
