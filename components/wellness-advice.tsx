"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WellnessAdvice() {
  const adviceCategories = [
    {
      title: "食事の養生",
      icon: "🍽️",
      items: ["温かい食べ物を中心に摂りましょう", "消化に良い食材を選びましょう", "規則正しい食事時間を心がけましょう"],
    },
    {
      title: "運動の養生",
      icon: "🏃‍♀️",
      items: ["軽いウォーキングから始めましょう", "ストレッチで体をほぐしましょう", "無理のない範囲で続けましょう"],
    },
    {
      title: "睡眠の養生",
      icon: "😴",
      items: ["規則正しい睡眠時間を保ちましょう", "就寝前のリラックスタイムを作りましょう", "寝室の環境を整えましょう"],
    },
    {
      title: "心の養生",
      icon: "🧘‍♀️",
      items: [
        "深呼吸でリラックスしましょう",
        "ストレスを溜めすぎないようにしましょう",
        "好きなことをする時間を作りましょう",
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">💡 養生アドバイス</h1>
        <p className="text-slate-600 leading-relaxed">
          あなたに合った
          <br />
          健康的な生活習慣
        </p>
      </div>

      <div className="space-y-6">
        {adviceCategories.map((category, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center space-x-2">
                <span className="text-2xl">{category.icon}</span>
                <span>{category.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        {/* よもぎ先生からの一言 */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🧑‍🦳</div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-slate-800 mb-3">よもぎ先生からの一言</h3>
                <div className="bg-white/80 rounded-xl p-4 shadow-sm">
                  <p className="text-slate-700 leading-relaxed">
                    養生は毎日の小さな積み重ねが大切です。無理をせず、できることから始めて、
                    徐々に習慣にしていきましょう。あなたの体と心の声に耳を傾けることが、 最も大切な養生法です。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
