import { useState, useCallback } from 'react'

const FALLBACK_STRATEGIES = [
  { label: '抛出诱饵', text: '这支乐队确实绝,不过如果是听前两张专辑,还是黑胶对味 🎵' },
  { label: '大方邀约', text: '品味不错!下周六刚好有场后朋克演出,要不要一起去?' },
  { label: '幽默推拉', text: '去 Livehouse 居然不叫我,看来我们的音乐友谊需要重新评估了 😤' },
]

export default function StrategySlider({ strategies }) {
  const items = (strategies && strategies.length === 3) ? strategies : FALLBACK_STRATEGIES
  const [index, setIndex] = useState(1)
  const [fading, setFading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = useCallback((e) => {
    const val = Number(e.target.value)
    setFading(true)
    setTimeout(() => { setIndex(val); setFading(false) }, 150)
  }, [])
  const handleCopy = () => {
    navigator.clipboard.writeText(items[index].text)
    if (navigator.vibrate) navigator.vibrate(50)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3 p-1">
      <div className={`text-crush-dark text-[13px] leading-[2] p-3 bg-crush-bg rounded-lg min-h-[60px] transition-opacity duration-150 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        {items[index].text}
      </div>
      <div>
        <p className="text-crush-gray text-[10px] mb-1.5 text-center">回应策略 — 试探 ↔ 直接</p>
        <input type="range" min="0" max="2" step="1" value={index} onChange={handleChange} className="w-full" />
        <div className="flex justify-between text-[11px] text-crush-gray mt-1.5">
          <span className={index === 0 ? 'text-crush-pink font-medium' : ''}>{items[0].label}</span>
          <span className={index === 1 ? 'text-crush-pink font-medium' : ''}>{items[1].label}</span>
          <span className={index === 2 ? 'text-crush-pink font-medium' : ''}>{items[2].label}</span>
        </div>
      </div>
      <button onClick={handleCopy}
        className={`w-full py-2.5 rounded-lg text-[13px] font-medium transition-all ${copied ? 'bg-crush-green text-white' : 'bg-crush-pink text-white hover:opacity-90'}`}>
        {copied ? '已复制 ✓' : '复制当前话术'}</button>
    </div>
  )
}
