"use server"

// ダミーの型定義（本番と揃えておくと後で切り替えやすい）
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

// ダミーの舌診生成（画像処理なし）
export async function generateTongueDiagnosis(imageBase64: string) {
  const dummyDiagnosis: TongueDiagnosisResult = {
    observations: {
      color: "淡紅",
      shape: ["正常"],
      coating: "薄白",
      moisture: "正常",
    },
    constitution: ["気虚", "湿証"],
    advice: "水分をとりすぎず、温かい食事を心がけましょう。",
    confidence: 0.9,
    timestamp: new Date().toISOString(),
  }

  return {
    success: true,
    diagnosis: dummyDiagnosis,
  }
}

// 養生アドバイス（モックデータでUI確認用）
export async function getConstitutionAdvice(constitutions: string[]) {
  return {
    foods: ["山芋", "なつめ", "ほうれん草"],
    avoid: ["冷たい飲み物", "生もの"],
    lifestyle: ["早寝早起き", "適度な運動"],
  }
}
