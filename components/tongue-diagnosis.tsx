"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, Loader2, Eye, RefreshCw } from "lucide-react"
import { generateTongueDiagnosis } from "@/lib/tongue-ai"

interface TongueDiagnosisProps {
  onDiagnosisComplete?: (diagnosis: TongueDiagnosisResult) => void
  onSkip?: () => void
}

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

export default function TongueDiagnosis({ onDiagnosisComplete, onSkip }: TongueDiagnosisProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosis, setDiagnosis] = useState<TongueDiagnosisResult | null>(null)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("ファイルが選択されました:", file.name)

      if (file.size > 10 * 1024 * 1024) {
        setError("ファイルサイズは10MB以下にしてください")
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("画像ファイルを選択してください")
        return
      }

      setSelectedImage(file)
      setError("")

      // プレビュー画像を作成
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError("画像を選択してください")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      // 画像をBase64に変換
      const base64Image = await convertToBase64(selectedImage)

      // AI分析を実行
      const result = await generateTongueDiagnosis(base64Image)

      if (result.success) {
        setDiagnosis(result.diagnosis)
        if (onDiagnosisComplete) {
          onDiagnosisComplete(result.diagnosis)
        }
      } else {
        setError(result.error || "分析に失敗しました")
      }
    } catch (err) {
      console.error("Tongue diagnosis error:", err)
      setError("分析中にエラーが発生しました")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleRetake = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setDiagnosis(null)
    setError("")
  }

  const renderImageCapture = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">👅</div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">舌の写真を撮影してください</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          明るい場所で、舌を自然に出した状態で撮影してください。
          <br />
          舌全体がはっきりと写るようにお願いします。
        </p>
      </div>

      {/* 撮影のコツ */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-800 mb-2">📸 撮影のコツ</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 自然光の下で撮影する</li>
            <li>• 舌を自然に出し、力を入れすぎない</li>
            <li>• カメラを舌の正面に向ける</li>
            <li>• 舌全体がフレームに収まるようにする</li>
          </ul>
        </CardContent>
      </Card>

      {/* 撮影・アップロードボタン */}
      <div className="space-y-3">
        <Button
          onClick={handleCameraCapture}
          className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
        >
          <Camera className="w-5 h-5 mr-2" />
          カメラで撮影
        </Button>

        <Button
          onClick={handleFileUpload}
          variant="outline"
          className="w-full h-14 text-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200"
        >
          <Upload className="w-5 h-5 mr-2" />
          ファイルから選択
        </Button>

        <Button
          onClick={onSkip}
          variant="ghost"
          className="w-full h-12 text-slate-500 hover:text-slate-700 transition-colors"
        >
          舌診をスキップ
        </Button>
      </div>

      {/* 隠しファイル入力 - ボタンの直後に配置 */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />

      {/* 隠しファイル入力 */}
    </div>
  )

  const renderImagePreview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-slate-800 mb-4">撮影した画像を確認してください</h3>
      </div>

      {/* 画像プレビュー */}
      <div className="relative">
        <img
          src={imagePreview || ""}
          alt="舌の画像"
          className="w-full max-h-80 object-contain rounded-xl border-2 border-slate-200"
        />
        <Button
          onClick={handleRetake}
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          撮り直し
        </Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      {/* 分析ボタン */}
      <div className="space-y-3">
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              AI分析中...
            </>
          ) : (
            <>
              <Eye className="w-5 h-5 mr-2" />
              舌診を開始
            </>
          )}
        </Button>

        <Button
          onClick={onSkip}
          variant="ghost"
          className="w-full h-12 text-slate-500 hover:text-slate-700 transition-colors"
        >
          舌診をスキップ
        </Button>
      </div>
    </div>
  )

  const renderDiagnosisResult = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">🧑‍🦳</div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">よもぎ先生の舌診結果</h3>
      </div>

      {/* 診断結果 */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* 観察所見 */}
            <div>
              <h4 className="font-medium text-slate-800 mb-2">📋 観察所見</h4>
              <div className="bg-white/80 rounded-lg p-3 text-sm">
                <p>
                  <strong>舌の色:</strong> {diagnosis?.observations.color}
                </p>
                <p>
                  <strong>舌の形状:</strong> {diagnosis?.observations.shape.join(", ")}
                </p>
                <p>
                  <strong>舌苔:</strong> {diagnosis?.observations.coating}
                </p>
                <p>
                  <strong>潤い:</strong> {diagnosis?.observations.moisture}
                </p>
              </div>
            </div>

            {/* 体質傾向 */}
            <div>
              <h4 className="font-medium text-slate-800 mb-2">🏷️ 体質傾向</h4>
              <div className="flex flex-wrap gap-2">
                {diagnosis?.constitution.map((const_, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {const_}
                  </span>
                ))}
              </div>
            </div>

            {/* アドバイス */}
            <div>
              <h4 className="font-medium text-slate-800 mb-2">💡 養生アドバイス</h4>
              <div className="bg-white/80 rounded-lg p-3">
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{diagnosis?.advice}</p>
              </div>
            </div>

            {/* 信頼度 */}
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                分析信頼度: {Math.round((diagnosis?.confidence || 0) * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 注意事項 */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <div className="text-yellow-600 mt-0.5">⚠️</div>
            <div>
              <p className="text-yellow-800 text-sm leading-relaxed">
                <strong>ご注意:</strong> これは東洋医学に基づく参考アドバイスです。
                体調に不安がある場合は、必ず専門の医師や鍼灸師にご相談ください。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 完了ボタン */}
      <Button
        onClick={() => onDiagnosisComplete && onDiagnosisComplete(diagnosis!)}
        className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
      >
        舌診を完了
      </Button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">👅 舌診チェック</h1>
        <p className="text-slate-600 leading-relaxed">
          舌の状態から体質を
          <br />
          AI が分析します
        </p>
      </div>

      {!selectedImage && renderImageCapture()}
      {selectedImage && !diagnosis && renderImagePreview()}
      {diagnosis && renderDiagnosisResult()}
    </div>
  )
}
