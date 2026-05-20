import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function SoftGuidance({ data }) {
  const { setActiveTab } = useApp()
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="flex gap-2.5 py-1.5">
      <div className="w-8 h-8 rounded-full bg-crush-pink/15 flex items-center justify-center flex-shrink-0 text-base">🛡️</div>
      <div className="flex flex-col max-w-[55%]">
        <span className="text-[10px] mb-0.5 px-1 text-crush-gray/50">小盾 · 提醒</span>
        <div className="bg-white border border-crush-warn/25 rounded-2xl rounded-tl-md shadow-sm px-4 py-3 space-y-3">
          <p className="text-crush-dark text-[13px] leading-[1.7] whitespace-pre-line">
            话术给你了。{'\n'}
            但我刚才注意到你问了 <span className="text-crush-warn font-medium">{data.count} 次</span> "{data.keyword}"。{'\n'}
            我说一句你可能不爱听的 —— 他想什么,不是我能给你的全部答案。{'\n'}
            「我」那边今天还没打卡。要不要顺路看一眼?
          </p>
          <div className="flex gap-2.5">
            <button onClick={() => setActiveTab('me')} className="flex-1 py-2 rounded-lg bg-crush-pink text-white text-[12px] font-medium hover:opacity-90 transition-opacity">现在去看看</button>
            <button onClick={() => setDismissed(true)} className="flex-1 py-2 rounded-lg border border-crush-gray/15 text-crush-gray text-[12px] hover:bg-crush-card/50 transition-colors">等会儿吧</button>
          </div>
        </div>
      </div>
    </div>
  )
}
