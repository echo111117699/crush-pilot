import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function DailyCheckin() {
  const { dailyCheckin, setDailyCheckin } = useApp()
  const [answer, setAnswer] = useState('')

  if (dailyCheckin.answered) {
    return (
      <div className="bg-crush-card rounded-[14px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <h3 className="text-crush-dark text-[15px] mb-4">🌱 今天的你</h3>
        <div className="bg-crush-green/10 text-crush-green rounded-xl px-5 py-4 text-[13px] font-medium">
          今日已打卡 ✓
        </div>
        {dailyCheckin.answer && (
          <p className="text-crush-gray text-[13px] mt-4 leading-[1.6] italic">"{dailyCheckin.answer}"</p>
        )}
      </div>
    )
  }

  const handleSubmit = () => {
    if (!answer.trim()) return
    setDailyCheckin(prev => ({ ...prev, answered: true, answer: answer.trim() }))
  }

  return (
    <div className="bg-crush-card rounded-[14px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <h3 className="text-crush-dark text-[15px] mb-4">🌱 今天的你</h3>
      <p className="text-crush-dark text-[14px] leading-[1.7] mb-5">{dailyCheckin.question}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="写下你的答案..."
        rows={3}
        className="w-full p-4 rounded-xl text-[13px] leading-[1.7] bg-white border border-crush-card text-crush-dark placeholder:text-crush-gray/40 outline-none focus:border-crush-pink transition-colors resize-none"
      />
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setDailyCheckin(prev => ({ ...prev, answered: true, answer: '' }))}
          className="text-crush-gray text-[12px] underline hover:text-crush-dark transition-colors"
        >
          跳过
        </button>
        <button
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className={`py-2.5 px-6 rounded-xl text-[13px] font-medium transition-all ${
            answer.trim()
              ? 'bg-crush-pink text-white hover:opacity-90'
              : 'bg-crush-card text-crush-gray/40'
          }`}
        >
          记下来
        </button>
      </div>
    </div>
  )
}
