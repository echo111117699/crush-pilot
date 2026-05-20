import { useState } from 'react'
import { useApp } from '../context/AppContext'

const QUESTIONS = [
  { id: 1, text: '选择过去让你为自己骄傲的瞬间', type: 'multi', options: [
    '完成了一个很难的工作/学习任务', '在朋友需要的时候陪在她身边', '坚持做了一件事,即使没有人知道',
    '勇敢地拒绝了自己不想做的事', '一个人完成了一次旅行/探索', '学会了一项新技能',
  ]},
  { id: 2, text: '你身边的朋友最常用什么词形容你?', type: 'short', options: ['靠谱', '幽默', '温柔', '独立', '有趣', '细腻'] },
  { id: 3, text: '不和任何人有关,你最近迷上的一件事是什么?', type: 'short', options: ['运动健身', '看书/观影', '做饭', '学乐器/语言', '整理收纳', '户外散步'] },
  { id: 4, text: '你状态最好的时候,你在做什么?', type: 'multi', options: [
    '沉浸在工作/创作里', '和好朋友在一起', '独自散步或运动',
    '在学习新东西', '什么都不做,只是放松', '在帮助别人',
  ]},
  { id: 5, text: '你最舍不得的一件物品是什么?为什么?', type: 'short', options: ['一本书', '一件礼物', '照片/信件', '从小用到大的东西', '自己赚钱买的第一件东西'] },
  { id: 6, text: '在一个完全没人认识你的城市,你想做的第一件事是什么?', type: 'short', options: ['找一家咖啡馆坐下', '随便上一辆公交车', '逛菜市场/老街', '去看一场演出', '什么都不计划,瞎逛'] },
  { id: 7, text: '你最近一次拒绝了什么、并且不后悔?', type: 'short', options: ['无效社交', '加班/额外工作', '别人的请求', '消费主义的诱惑', '一段不舒服的关系'] },
  { id: 8, text: '你的工作 / 学习领域里,让你觉得自己很专业的瞬间?', type: 'short', options: ['解决了一个难题', '被同事/同学认可', '独立完成项目', '教别人的时候', '发现自己的进步'] },
  { id: 9, text: '你审美里最坚持的一件事是什么?', type: 'short', options: ['穿衣风格', '家里的布置', '听的音乐', '拍照构图', '文字表达', '生活仪式感'] },
  { id: 10, text: '此刻你想对一个月后的自己说什么?', type: 'short', options: ['你做到了', '别回头', '你比想象中更酷', '记得休息', '继续往前走'] },
]

export default function Questionnaire() {
  const { navigate, setSelfProfile } = useApp()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [multiSelect, setMultiSelect] = useState([])
  const [shortInput, setShortInput] = useState('')

  const q = QUESTIONS[step]
  const progress = ((step) / QUESTIONS.length) * 100

  const goNext = () => {
    const key = `q${q.id}`
    const val = q.type === 'multi' ? multiSelect : shortInput
    const updated = { ...answers, [key]: val }
    setAnswers(updated)
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
      const next = QUESTIONS[step + 1]
      setMultiSelect([])
      setShortInput(next.type === 'short' ? '' : (answers[`q${next.id}`] || ''))
    } else {
      setSelfProfile(updated)
      navigate('transition')
    }
  }

  const goPrev = () => {
    if (step > 0) {
      setStep(step - 1)
      const prev = QUESTIONS[step - 1]
      const prevVal = answers[`q${prev.id}`]
      if (prev.type === 'multi') { setMultiSelect(prevVal || []); setShortInput('') }
      else { setShortInput(prevVal || ''); setMultiSelect([]) }
    }
  }

  const toggleOption = (opt) => {
    setMultiSelect(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt])
  }

  const canNext = q.type === 'multi' ? multiSelect.length > 0 : shortInput.trim().length > 0
  const skipAll = () => { setSelfProfile({}); navigate('transition') }

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-xl px-12">
        <div className="mb-8">
          <div className="h-1.5 bg-crush-card rounded-full overflow-hidden">
            <div className="h-full bg-crush-pink rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(progress, (step) / QUESTIONS.length * 100)}%` }} />
          </div>
          <p className="text-crush-gray text-[11px] mt-2 text-right">{step + 1}/{QUESTIONS.length}</p>
        </div>

        <div className="bg-crush-card rounded-[16px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)] mb-6">
          <h2 className="text-crush-dark text-[17px] leading-[1.7] mb-6">{q.text}</h2>

          {q.type === 'multi' ? (
            <div className="grid grid-cols-2 gap-2.5">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => toggleOption(opt)}
                  className={`text-left p-3.5 rounded-[12px] text-[13px] leading-[1.5] transition-all ${
                    multiSelect.includes(opt)
                      ? 'bg-crush-pink text-white shadow-sm' : 'bg-white text-crush-gray border border-crush-card hover:border-crush-pink'
                  }`}>{opt}</button>
              ))}
              <div className="col-span-2 pt-1">
                <input type="text" placeholder="或者自己写一个..."
                  className="w-full p-3.5 rounded-[12px] text-[13px] bg-white border border-crush-card text-crush-gray placeholder:text-crush-gray/40 outline-none focus:border-crush-pink transition-colors"
                  onKeyDown={(e) => { if (e.key === 'Enter' && canNext) goNext() }} />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => setShortInput(opt)}
                    className={`px-3.5 py-2 rounded-[12px] text-[13px] transition-all ${
                      shortInput === opt
                        ? 'bg-crush-pink text-white shadow-sm' : 'bg-white text-crush-gray border border-crush-card hover:border-crush-pink'
                    }`}>{opt}</button>
                ))}
              </div>
              <textarea value={shortInput} onChange={(e) => setShortInput(e.target.value)}
                placeholder="或者自己写..."
                rows={4} autoFocus
                className="w-full p-4 rounded-[14px] text-[14px] leading-[1.8] bg-white border border-crush-card text-crush-dark placeholder:text-crush-gray/40 outline-none focus:border-crush-pink transition-colors resize-none"
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && canNext) { e.preventDefault(); goNext() } }} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={goPrev} disabled={step === 0}
            className={`text-[13px] py-2.5 px-5 rounded-[14px] transition-all ${step === 0 ? 'text-crush-gray/30' : 'text-crush-gray hover:bg-crush-card'}`}>
            上一题</button>
          <button onClick={skipAll} className="text-crush-gray/30 text-[11px] hover:text-crush-gray transition-colors">跳过全部</button>
          <button onClick={goNext} disabled={!canNext}
            className={`text-[14px] py-2.5 px-7 rounded-[14px] font-medium transition-all ${
              canNext ? 'bg-crush-pink text-white hover:opacity-90 active:opacity-80' : 'bg-crush-card text-crush-gray/40'}`}>
            {step === QUESTIONS.length - 1 ? '完成' : '下一题'}</button>
        </div>
      </div>
    </div>
  )
}
