import { useState, useEffect } from 'react'
import { hasApiKey, setApiKey } from '../../services/api'

export default function SettingsModal({ onClose }) {
  const [key, setKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('crush-pilot-api-key') || ''
    setKey(stored)
  }, [])

  const handleSave = () => {
    setApiKey(key.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        <h3 className="text-crush-dark text-[15px] font-medium mb-2">API 设置</h3>
        <p className="text-crush-gray text-[12px] leading-[1.6] mb-5">
          输入你的 Anthropic API Key，即可使用真实 AI 进行聊天回复和截图分析。
          你的 Key 仅保存在浏览器本地。
        </p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full p-4 rounded-xl text-[13px] bg-crush-bg border border-crush-card text-crush-dark placeholder:text-crush-gray/40 outline-none focus:border-crush-pink transition-colors mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-crush-card text-crush-gray text-[13px] hover:bg-crush-card transition-colors"
          >
            关闭
          </button>
          <button
            onClick={handleSave}
            disabled={!key.trim()}
            className={`flex-1 py-3 rounded-xl text-[13px] font-medium transition-all ${
              saved
                ? 'bg-crush-green text-white'
                : key.trim()
                  ? 'bg-crush-pink text-white hover:opacity-90'
                  : 'bg-crush-card text-crush-gray/40'
            }`}
          >
            {saved ? '已保存 ✓' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
