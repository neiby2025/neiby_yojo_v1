"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// ダミーのAPIキー（実際の使用時は環境変数から取得）
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "sk-dummy-key-for-development-only"

export async function generatePersonalizedWellnessAdvice(scores: Record<string, number>, userSymptoms?: string) {
  try {
    // スコアを分析して主要な体質傾向を特定
    const topConstitutions = Object.entries(scores)
      .filter(([_, score]) => score > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([constitution, score]) => `${constitution}(スコア: ${score})`)

    const prompt = `
あなたは東洋医学の専門家です。以下の体質診断結果に基づいて、個別化された養生アドバイスを提供してください。

【体質診断結果】
主要な体質傾向: ${topConstitutions.join(", ")}
${userSymptoms ? `主な症状: ${userSymptoms}` : ""}

【アドバイス項目】
1. 食事の養生（具体的な食材と調理法）
2. 運動の養生（適切な運動の種類と強度）
3. 生活習慣の養生（睡眠、入浴、環境など）
4. 心の養生（ストレス管理、リラックス法）

各項目について、東洋医学の理論に基づいた具体的で実践しやすいアドバイスを3-4つずつ提供してください。
専門用語は分かりやすく説明し、日常生活に取り入れやすい内容にしてください。
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1000,
    })

    return {
      success: true,
      advice: text,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("AI養生アドバイス生成エラー:", error)

    // APIキーがダミーの場合やエラーの場合のフォールバック
    return {
      success: false,
      advice: generateFallbackAdvice(scores),
      timestamp: new Date().toISOString(),
      error: "AI APIが利用できません。デフォルトのアドバイスを表示しています。",
    }
  }
}

function generateFallbackAdvice(scores: Record<string, number>): string {
  const topConstitutions = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  let advice = `【あなたの体質に合わせた養生アドバイス】\n\n`

  if (topConstitutions.length === 0) {
    advice += `現在の体調は比較的バランスが取れているようです。\n\n`
  } else {
    advice += `主な体質傾向: ${topConstitutions.map(([c, s]) => `${c}(${s})`).join(", ")}\n\n`
  }

  advice += `【食事の養生】\n`
  if (scores["気虚"] >= 2) {
    advice += `• 消化に良い温かい食べ物を中心に摂りましょう\n`
    advice += `• 山芋、なつめ、鶏肉などの気を補う食材がおすすめです\n`
  }
  if (scores["血虚"] >= 2) {
    advice += `• 鉄分豊富な食材（ほうれん草、レバー、ひじきなど）を積極的に\n`
    advice += `• 黒ごま、クコの実、赤身の肉で血を補いましょう\n`
  }
  if (scores["水滞"] >= 2) {
    advice += `• 塩分を控えめにし、利尿作用のある食材（小豆、とうもろこし）を\n`
    advice += `• 冷たい飲み物は避け、温かい飲み物を選びましょう\n`
  }
  advice += `• バランスの良い食事を心がけ、旬の食材を取り入れましょう\n\n`

  advice += `【運動の養生】\n`
  if (scores["気虚"] >= 2) {
    advice += `• 激しい運動は避け、軽いウォーキングやストレッチを\n`
  }
  if (scores["気滞"] >= 2) {
    advice += `• ヨガや太極拳など、ゆったりとした運動がおすすめです\n`
  }
  advice += `• 毎日30分程度の軽い運動を心がけましょう\n`
  advice += `• 階段を使う、一駅歩くなど、日常に運動を取り入れましょう\n\n`

  advice += `【生活習慣の養生】\n`
  advice += `• 規則正しい生活リズムを保ちましょう\n`
  advice += `• 十分な睡眠時間を確保しましょう\n`
  if (scores["血虚"] >= 2) {
    advice += `• 目を酷使しすぎないよう、適度な休憩を取りましょう\n`
  }
  if (scores["水滞"] >= 2) {
    advice += `• 湿度の高い環境を避け、除湿を心がけましょう\n`
  }
  advice += `• 体を冷やさないよう、温かい服装を心がけましょう\n\n`

  advice += `【心の養生】\n`
  advice += `• ストレスを溜めすぎないよう、適度にリフレッシュしましょう\n`
  advice += `• 好きなことをする時間を大切にしましょう\n`
  if (scores["気滞"] >= 2) {
    advice += `• 深呼吸や軽いマッサージでリラックスしましょう\n`
  }
  if (scores["血虚"] >= 2) {
    advice += `• 瞑想や深呼吸で心を落ち着かせる時間を作りましょう\n`
  }

  return advice
}

export async function generateDailyAdvice(
  dailyScores: Record<string, number>,
  bodyCondition: number,
  mindCondition: number,
  symptoms?: string,
) {
  try {
    const prompt = `
あなたは東洋医学の専門家です。今日の体調チェック結果に基づいて、今日一日の養生アドバイスを提供してください。

【今日の体調】
八綱弁証スコア: ${Object.entries(dailyScores)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ")}
からだの調子: ${bodyCondition}/5
こころの調子: ${mindCondition}/5
${symptoms ? `気になる症状: ${symptoms}` : ""}

今日の体調に合わせた具体的で実践しやすいアドバイスを、簡潔に3-4つ提供してください。
特に今日気をつけるべきことを中心にお願いします。
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 500,
    })

    return {
      success: true,
      advice: text,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("日次アドバイス生成エラー:", error)

    return {
      success: false,
      advice: generateDailyFallbackAdvice(dailyScores, bodyCondition, mindCondition),
      timestamp: new Date().toISOString(),
      error: "AI APIが利用できません。デフォルトのアドバイスを表示しています。",
    }
  }
}

function generateDailyFallbackAdvice(
  dailyScores: Record<string, number>,
  bodyCondition: number,
  mindCondition: number,
): string {
  const advice = []

  if (bodyCondition <= 2) {
    advice.push("今日は体調が優れないようです。無理をせず、十分な休息を取りましょう。")
  } else if (bodyCondition >= 4) {
    advice.push("体調が良好ですね！この調子を維持するため、バランスの良い食事と適度な運動を心がけましょう。")
  }

  if (mindCondition <= 2) {
    advice.push("心の調子が少し下がっているようです。深呼吸やリラックスできる時間を作りましょう。")
  } else if (mindCondition >= 4) {
    advice.push("心の状態が良好です。この前向きな気持ちを大切に、今日も充実した一日をお過ごしください。")
  }

  if (dailyScores["虚"] >= 2) {
    advice.push("体力や気力が不足気味です。温かい食べ物を摂り、早めの就寝を心がけましょう。")
  }

  if (dailyScores["実"] >= 2) {
    advice.push("体にエネルギーが溜まっているようです。軽い運動やストレッチで発散させましょう。")
  }

  if (dailyScores["寒"] >= 2) {
    advice.push("体が冷えているようです。温かい飲み物を摂り、体を温めることを意識してください。")
  }

  if (dailyScores["熱"] >= 2) {
    advice.push("体に熱がこもっているようです。涼しい環境で過ごし、水分補給を心がけましょう。")
  }

  if (advice.length === 0) {
    advice.push("今日の体調は安定しているようです。規則正しい生活を続けて、この良い状態を維持しましょう。")
  }

  return advice.join("\n\n")
}
