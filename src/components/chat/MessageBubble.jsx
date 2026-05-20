import { useState, useEffect } from 'react'

function formatTime(ts) {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  const [displayText, setDisplayText] = useState('')
  const [typing, setTyping] = useState(false)
  const time = msg.ts ? formatTime(msg.ts) : ''

  useEffect(() => {
    if (isUser || msg.type === 'quota' || msg.type === 'analysis-bundle' || msg.type === 'soft-guidance' || msg.type === 'image') {
      setDisplayText(msg.content || '')
      return
    }
    setTyping(true)
    setDisplayText('')
    const text = msg.content || ''
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayText(text.slice(0, i))
      if (i >= text.length) { clearInterval(timer); setTyping(false) }
    }, 30)
    return () => clearInterval(timer)
  }, [msg.content, isUser, msg.type])

  if (msg.type === 'quota') {
    return (
      <div className="flex justify-center py-3">
        <div className="bg-crush-card/80 border border-crush-card rounded-2xl px-6 py-4 max-w-md">
          <p className="text-crush-dark text-[13px] leading-[2] text-center whitespace-pre-line">{displayText}</p>
        </div>
      </div>
    )
  }

  if (msg.type === 'image') {
    return (
      <div className="flex gap-2.5 flex-row-reverse py-1.5">
        <div className="w-8 h-8 rounded-full bg-crush-pink text-white font-medium flex items-center justify-center text-xs flex-shrink-0">你</div>
        <div className="flex flex-col items-end max-w-[55%]">
          <span className="text-[10px] mb-0.5 px-1 text-crush-pink/50">你</span>
          <div className="rounded-2xl rounded-tr-md shadow-sm overflow-hidden">
            <img src={msg.imageUrl} alt="聊天截图" className="max-w-[240px] max-h-[320px] object-cover" />
          </div>
          {msg.content && <p className="text-[11px] text-crush-gray/60 mt-1 px-1">{msg.content}</p>}
          <span className="text-[9px] text-crush-gray/40 mt-0.5 px-1">{time}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} py-1.5`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
        isUser ? 'bg-crush-pink text-white font-medium' : 'bg-crush-pink/15'
      }`}>
        {isUser ? '你' : '🛡️'}
      </div>
      <div className={`flex flex-col max-w-[55%] ${isUser ? 'items-end' : 'items-start'}`}>
        <span className={`text-[10px] mb-0.5 px-1 ${isUser ? 'text-crush-pink/50' : 'text-crush-gray/50'}`}>
          {isUser ? '你' : '小盾'}
        </span>
        <div className={`px-5 py-3 text-[13px] leading-[2] ${
          isUser
            ? 'bg-crush-pink text-white rounded-2xl rounded-tr-md shadow-sm'
            : 'bg-white border border-crush-card/60 text-crush-dark rounded-2xl rounded-tl-md shadow-sm'
        }`}>
          {typing ? (
            <span>{displayText}<span className="animate-pulse text-crush-pink">|</span></span>
          ) : (
            <span className="whitespace-pre-line">{displayText}</span>
          )}
        </div>
        {!typing && <span className="text-[9px] text-crush-gray/40 mt-0.5 px-1">{time}</span>}
      </div>
    </div>
  )
}
