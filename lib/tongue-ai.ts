"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import tongueData from "../data/tongue-diagnosis.json"

interface TongueDiagnosisResult {
  observations: {
    color: string
    shape: string[]
    coating: string
    moisture: string
  }
  constitution: string[]
  advice: string
  confidence: number
  timestamp: string
}

export async function generateTongueDiagnosis(imageBase64: string) {
  try {
    const prompt = `
あなたは中医学に精通した舌診の専門家です。アップロードされた舌の画像を分析して、以下の形式でJSONレスポンスを返してください。

分析項目：
1. 舌質（色・形・潤い）
2. 舌苔（色・厚さ・分布）
3. その他の特徴（歯痕、裂紋、瘀点など）

以下のJSONフォーマットで回答してください：
{
  "observations": {
    "color": "舌の色（淡白/淡紅/紅/絳/紫）",
    "shape": ["形状の特徴の配列（胖大/痩薄/歯痕/裂紋/瘀点など）"],
    "coating": "舌苔の状態（薄白/厚白/薄黄/厚黄/無苔/膩苔など）",
    "moisture": "潤い状態（乾燥/正常/湿潤）"
  },
  "constitution": ["推定される体質の配列（気虚/血虚/陰虚/陽虚/湿証/瘀血など）"],
  "advice": "具体的な養生アドバイス（食材、生活習慣、注意点を含む）",
  "confidence": 0.85
}

画像から読み取れる特徴を正確に分析し、中医学の理論に基づいて体質を判定してください。
アドバイスは実践しやすく、具体的な内容にしてください。
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1000,
    })

    const diagnosis = JSON.parse(text) as TongueDiagnosisResult
    diagnosis.timestamp = new Date().toISOString()

    return {
      success: true,
      diagnosis,
    }
  } catch (error) {
    console.error("Tongue diagnosis error:", error)

    const fallbackDiagnosis: TongueDiagnosisResult = {
      observations: {
        color: "淡紅",
        shape: ["正常"],
        coating: "薄白",
        moisture: "正常",
      },
      constitution: ["バランス良好"],
      advice: `舌の画像を分析できませんでしたが、一般的な養生アドバイスをお伝えします。

【食事の養生】
• バランスの良い食事を心がけましょう
• 旬の食材を取り入れて季節に合わせた食生活を
• 温かい食べ物を中心に摂取しましょう

【生活習慣】
• 規則正しい睡眠時間を保ちましょう
• 適度な運動を心がけましょう
• ストレスを溜めすぎないよう注意しましょう

※これは一般的なアドバイスです。詳しい診断は専門家にご相談ください。`,
      confidence: 0.5,
      timestamp: new Date().toISOString(),
    }

    return {
      success: false,
      diagnosis: fallbackDiagnosis,
      error: "AI分析が利用できません。デフォルトのアドバイスを表示しています。",
    }
  }
}

// 舌診データベースから体質に基づくアドバイスを取得（アロー関数に修正）
export const getConstitutionAdvice = (constitutions: string[]) => {
  const advice = {
    foods: [] as string[],
    avoid: [] as string[],
    lifestyle: [] as string[],
  }

  constitutions.forEach((constitution) => {
    const constitutionAdvice =
      tongueData.constitution_advice[constitution as keyof typeof tongueData.constitution_advice]
    if (constitutionAdvice) {
      advice.foods.push(...constitutionAdvice.foods)
      advice.avoid.push(...constitutionAdvice.avoid)
      advice.lifestyle.push(...constitutionAdvice.lifestyle)
    }
  })

  advice.foods = [...new Set(advice.foods)]
  advice.avoid = [...new Set(advice.avoid)]
  advice.lifestyle = [...new Set(advice.lifestyle)]

  return advice
}
