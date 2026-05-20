import { useState } from 'react'

export default function InputArea({ onSend, onUploadClick }) {
  const [text, setText] = useState('')
  const handleSend = () => { if (!text.trim()) return; onSend(text.trim()); setText('') }
  const canSend = text.trim().length > 0

  return (
    <div className="px-6 py-3 border-t border-crush-card/40 bg-white/40">
      <div className="flex items-center gap-2.5 max-w-3xl mx-auto">
        <button onClick={onUploadClick}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-all bg-crush-card text-crush-gray hover:bg-crush-pink/10">+</button>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && canSend) handleSend() }}
          placeholder="和小盾说说话..."
          className="flex-1 py-2.5 px-4 rounded-lg text-[13px] outline-none transition-colors bg-crush-card text-crush-dark placeholder:text-crush-gray/40 focus:ring-2 focus:ring-crush-pink/20" />
        <button onClick={handleSend} disabled={!canSend}
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all text-base ${
            canSend ? 'bg-crush-pink text-white hover:opacity-90' : 'bg-crush-card text-crush-gray/30'}`}>↑</button>
      </div>
      <p className="text-crush-gray/40 text-[10px] text-center mt-1.5">不限次数 · 随时聊聊</p>
    </div>
  )
}
