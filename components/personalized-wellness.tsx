"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Utensils, Activity, Moon, Heart, Thermometer, Droplets } from "lucide-react"

interface PersonalizedWellnessProps {
  scores: Record<string, number>
  onBack?: () => void
}

export default function PersonalizedWellness({ scores, onBack }: PersonalizedWellnessProps) {
  // スコアに基づいて個別化されたアドバイスを生成
  const generatePersonalizedAdvice = () => {
    const advice = {
      diet: [] as string[],
      exercise: [] as string[],
      lifestyle: [] as string[],
      mindfulness: [] as string[],
    }

    // 気虚の場合
    if (scores["気虚"] >= 2) {
      advice.diet.push("消化に良い温かい食べ物を中心に摂りましょう")
      advice.diet.push("山芋、なつめ、鶏肉などの気を補う食材がおすすめです")
      advice.exercise.push("激しい運動は避け、軽いウォーキングやストレッチを")
      advice.lifestyle.push("十分な睡眠時間を確保し、規則正しい生活を心がけましょう")
    }

    // 血虚の場合
    if (scores["血虚"] >= 2) {
      advice.diet.push("鉄分豊富な食材（ほうれん草、レバー、ひじきなど）を積極的に")
      advice.diet.push("黒ごま、クコの実、赤身の肉で血を補いましょう")
      advice.lifestyle.push("目を酷使しすぎないよう、適度な休憩を取りましょう")
      advice.mindfulness.push("瞑想や深呼吸で心を落ち着かせる時間を作りましょう")
    }

    // 水滞の場合
    if (scores["水滞"] >= 2) {
      advice.diet.push("塩分を控えめにし、利尿作用のある食材（小豆、とうもろこし）を")
      advice.diet.push("冷たい飲み物は避け、温かい飲み物を選びましょう")
      advice.exercise.push("軽い有酸素運動で代謝を促進させましょう")
      advice.lifestyle.push("湿度の高い環境を避け、除湿を心がけましょう")
    }

    // 気滞の場合
    if (scores["気滞"] >= 2) {
      advice.diet.push("香りの良い食材（柑橘類、ハーブ、生姜）で気の巡りを良くしましょう")
      advice.exercise.push("ヨガや太極拳など、ゆったりとした運動がおすすめです")
      advice.mindfulness.push("ストレス発散の時間を意識的に作りましょう")
      advice.mindfulness.push("深呼吸や軽いマッサージでリラックスしましょう")
    }

    // 瘀血の場合
    if (scores["瘀血"] >= 2) {
      advice.diet.push("血行を良くする食材（玉ねぎ、にんにく、青魚）を取り入れましょう")
      advice.exercise.push("適度な運動で血流を改善させましょう")
      advice.lifestyle.push("体を冷やさないよう、温かい服装を心がけましょう")
    }

    // 五臓の不調に対するアドバイス
    if (scores["肝の不調"] >= 2) {
      advice.diet.push("酸味のある食材（梅干し、酢の物）で肝を養いましょう")
      advice.mindfulness.push("怒りやイライラを溜めないよう、感情のコントロールを意識しましょう")
    }

    if (scores["心の不調"] >= 2) {
      advice.diet.push("苦味のある食材（ゴーヤ、緑茶）で心を落ち着かせましょう")
      advice.lifestyle.push("質の良い睡眠を心がけ、就寝前のリラックスタイムを作りましょう")
    }

    if (scores["脾の不調"] >= 2) {
      advice.diet.push("甘味のある食材（かぼちゃ、さつまいも）で脾を補いましょう")
      advice.diet.push("冷たいものや生ものは控えめにしましょう")
    }

    if (scores["肺の不調"] >= 2) {
      advice.diet.push("辛味のある食材（大根、白菜）で肺を潤しましょう")
      advice.lifestyle.push("乾燥を避け、適度な湿度を保ちましょう")
    }

    if (scores["腎の不調"] >= 2) {
      advice.diet.push("塩味のある食材（海藻、黒豆）で腎を補いましょう")
      advice.lifestyle.push("下半身を冷やさないよう注意しましょう")
    }

    // デフォルトのアドバイス
    if (advice.diet.length === 0) {
      advice.diet.push("バランスの良い食事を心がけ、旬の食材を取り入れましょう")
      advice.diet.push("規則正しい食事時間を保ちましょう")
    }

    if (advice.exercise.length === 0) {
      advice.exercise.push("毎日30分程度の軽い運動を心がけましょう")
      advice.exercise.push("階段を使う、一駅歩くなど、日常に運動を取り入れましょう")
    }

    if (advice.lifestyle.length === 0) {
      advice.lifestyle.push("規則正しい生活リズムを保ちましょう")
      advice.lifestyle.push("十分な睡眠時間を確保しましょう")
    }

    if (advice.mindfulness.length === 0) {
      advice.mindfulness.push("ストレスを溜めすぎないよう、適度にリフレッシュしましょう")
      advice.mindfulness.push("好きなことをする時間を大切にしましょう")
    }

    return advice
  }

  const advice = generatePersonalizedAdvice()

  const adviceCategories = [
    {
      title: "食事の養生",
      icon: <Utensils className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-600",
      items: advice.diet,
    },
    {
      title: "運動の養生",
      icon: <Activity className="w-6 h-6" />,
      color: "bg-green-100 text-green-600",
      items: advice.exercise,
    },
    {
      title: "生活習慣の養生",
      icon: <Moon className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600",
      items: advice.lifestyle,
    },
    {
      title: "心の養生",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-pink-100 text-pink-600",
      items: advice.mindfulness,
    },
  ]

  // 主要な体質傾向を取得
  const getTopConstitutions = () => {
    const allScores = Object.entries(scores)
      .filter(([_, score]) => score > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    return allScores.map(([constitution, score]) => ({ constitution, score }))
  }

  const topConstitutions = getTopConstitutions()

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">🌿 あなた専用の養生法</h1>
        <p className="text-slate-600 leading-relaxed">
          体質診断の結果に基づいた
          <br />
          個別化されたアドバイス
        </p>
      </div>

      {/* 体質傾向サマリー */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
            <Thermometer className="w-5 h-5 mr-2 text-blue-600" />
            あなたの主な体質傾向
          </h2>
          <div className="space-y-2">
            {topConstitutions.map((item, index) => (
              <div key={item.constitution} className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">{item.constitution}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        index === 0 ? "bg-red-500" : index === 1 ? "bg-orange-500" : "bg-purple-500"
                      } rounded-full`}
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 w-8 text-right">{item.score}/5</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 養生法カテゴリー */}
      <div className="space-y-6">
        {adviceCategories.map((category, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${category.color}`}>{category.icon}</div>
                <span>{category.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1 text-sm">●</span>
                    <span className="text-slate-700 leading-relaxed text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* よもぎ先生からの特別アドバイス */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50 backdrop-blur-sm mt-6">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">🧑‍🦳</div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-slate-800 mb-3">よもぎ先生からの特別アドバイス</h3>
              <div className="bg-white/80 rounded-xl p-4 shadow-sm">
                <p className="text-slate-700 leading-relaxed text-sm">
                  {topConstitutions.length > 0 ? (
                    <>
                      あなたは特に「{topConstitutions[0].constitution}」の傾向が見られますね。
                      {topConstitutions[0].constitution.includes("虚") &&
                        "体力や気力を補うことを重視し、無理をせずゆっくりと体調を整えていきましょう。"}
                      {topConstitutions[0].constitution.includes("滞") &&
                        "気や血の巡りを良くすることが大切です。適度な運動とリラックスを心がけてください。"}
                      {topConstitutions[0].constitution.includes("不調") &&
                        "該当する臓器を労わる生活を心がけ、バランスの取れた養生を実践しましょう。"}
                      <br />
                      <br />
                      毎日少しずつでも続けることが、健康への近道です。体の声に耳を傾けながら、
                      無理のない範囲で実践してくださいね。
                    </>
                  ) : (
                    "現在の体調は比較的バランスが取れているようです。この良い状態を維持するために、" +
                    "規則正しい生活と適度な運動、バランスの良い食事を心がけてください。" +
                    "予防が最良の治療です。"
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 注意事項 */}
      <Card className="border-0 shadow-lg bg-yellow-50 backdrop-blur-sm mt-6">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">ご注意ください</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                これらのアドバイスは一般的な養生法です。症状が続く場合や気になることがある場合は、
                必ず医療機関や漢方の専門家にご相談ください。
                <br />
                <br />
                また、体質や体調は日々変化するものです。定期的にチェックを行い、
                その時の状態に合わせて養生法を調整することをおすすめします。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アクションボタン */}
      <div className="space-y-3 mt-8">
        <Button
          onClick={() => {
            // 養生法をお気に入りに保存する処理
            alert("養生法をお気に入りに保存しました！")
          }}
          className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
        >
          <Heart className="w-5 h-5 mr-2" />
          この養生法をお気に入りに保存
        </Button>

        <Button
          onClick={() => {
            // 養生法をPDFでダウンロードする処理
            alert("養生法をPDFでダウンロードします")
          }}
          variant="outline"
          className="w-full h-14 text-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200"
        >
          <Droplets className="w-5 h-5 mr-2" />
          PDFでダウンロード
        </Button>

        {onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full h-12 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            結果画面に戻る
          </Button>
        )}
      </div>
    </div>
  )
}
