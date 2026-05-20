import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'

const DURATIONS = [
  { label: '24小时', hours: 24 },
  { label: '3天', hours: 72 },
  { label: '7天', hours: 168 },
]

const FOCUS_SUGGESTIONS = [
  '看一部一直想看的电影',
  '约一个很久没见的朋友',
  '去一家没去过的餐厅',
  '整理房间，断舍离',
  '读完那本翻了几页的书',
  '一个人去散步，不戴耳机',
]

function ClockFace({ remaining }) {
  const [h, m] = remaining.split('小时').map(s => parseInt(s) || 0)
  const totalMin = h * 60 + m
  const maxMin = 7 * 24 * 60 // 168 hours
  const progress = Math.max(0, Math.min(100, (1 - totalMin / maxMin) * 100))

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative w-24 h-24 mb-4">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#FFF0F3" strokeWidth="6" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#EEACC2" strokeWidth="6"
            strokeDasharray={`${progress * 2.64} 264`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🕯️</span>
        </div>
      </div>
      <p className="text-crush-dark text-[22px] font-light tracking-wider">{remaining}</p>
      <p className="text-crush-gray/50 text-[11px] mt-1">距离结束</p>
    </div>
  )
}

export default function SilentPeriod({ embedded }) {
  const { silentPeriod, setSilentPeriod } = useApp()
  const [remaining, setRemaining] = useState('')
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('silent-history') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    if (!silentPeriod.active || !silentPeriod.endTime) return
    const tick = () => {
      const diff = silentPeriod.endTime - Date.now()
      if (diff <= 0) {
        const completed = { duration: silentPeriod.duration, endedAt: Date.now() }
        setHistory(prev => {
          const updated = [completed, ...prev].slice(0, 5)
          localStorage.setItem('silent-history', JSON.stringify(updated))
          return updated
        })
        setSilentPeriod({ active: false, duration: null, endTime: null })
        return
      }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setRemaining(`${h} 小时 ${m} 分钟`)
    }
    tick()
    const timer = setInterval(tick, 60000)
    return () => clearInterval(timer)
  }, [silentPeriod.active, silentPeriod.endTime, setSilentPeriod])

  const start = (hours) => {
    setSilentPeriod({
      active: true,
      duration: hours,
      endTime: Date.now() + hours * 3600000,
    })
  }

  const end = () => {
    setSilentPeriod({ active: false, duration: null, endTime: null })
  }

  const formatDate = (ts) => {
    const d = new Date(ts)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  const content = (
    <div>
      {silentPeriod.active ? (
        <div className="space-y-5">
          {/* Clock */}
          <ClockFace remaining={remaining} />

          {/* Focus suggestions */}
          <div>
            <p className="text-crush-gray text-[12px] mb-2.5">这段时间不如试试：</p>
            <div className="grid grid-cols-2 gap-2">
              {FOCUS_SUGGESTIONS.map((s, i) => (
                <div key={i} className="bg-crush-bg rounded-lg px-3.5 py-2.5 text-crush-dark text-[12px] leading-[1.9]">
                  ✦ {s}
                </div>
              ))}
            </div>
          </div>

          <button onClick={end}
            className="w-full py-2.5 rounded-xl border border-crush-pink/30 text-crush-pink text-[13px] hover:bg-crush-pink/5 transition-colors">
            提前结束静默期
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Intro */}
          <div className="bg-crush-bg rounded-xl p-4">
            <p className="text-crush-dark text-[13px] leading-[2]">
              暂停分析关于他的一切，把注意力放回自己身上。你可以随时开始，也可以随时结束。
            </p>
          </div>

          {/* Duration picker */}
          <div>
            <p className="text-crush-gray text-[12px] mb-2.5">选择时长</p>
            <div className="flex gap-2.5">
              {DURATIONS.map(d => (
                <button key={d.hours} onClick={() => start(d.hours)}
                  className="flex-1 py-2.5 rounded-xl border border-crush-pink/30 text-crush-pink text-[13px] hover:bg-crush-pink/5 transition-colors">
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div>
              <p className="text-crush-gray text-[12px] mb-2">静默记录</p>
              <div className="space-y-1.5">
                {history.slice(0, 3).map((h, i) => (
                  <div key={i} className="flex items-center justify-between bg-crush-bg rounded-lg px-4 py-2.5">
                    <span className="text-crush-dark text-[12px]">
                      {h.duration === 24 ? '24小时' : h.duration === 72 ? '3天' : '7天'}静默
                    </span>
                    <span className="text-crush-gray/50 text-[11px]">{formatDate(h.endedAt)} 结束</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* First time hint */}
          {history.length === 0 && (
            <div className="text-center py-4">
              <div className="text-2xl mb-2">🕯️</div>
              <p className="text-crush-gray/40 text-[12px] leading-[2]">
                还没有静默记录。<br />第一次静默后，这里会记录你的每一次"回到自己"。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )

  if (embedded) return content
  return (
    <div className="bg-crush-card rounded-[14px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {content}
    </div>
  )
}
