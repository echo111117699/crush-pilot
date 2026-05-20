import { useState } from 'react'
import { useApp } from '../context/AppContext'

const MEET_OPTIONS = ['同学', '同事', '网友', '朋友介绍', '偶然相遇', '其他']
const DURATION_OPTIONS = ['< 1 月', '1-3 月', '3-6 月', '6-12 月', '> 1 年']
const EMOTION_OPTIONS = ['焦虑', '期待', '失落', '困惑', '生气', '反复横跳']
const GOAL_OPTIONS = [
  '他到底对我有没有意思',
  '这段关系要不要继续',
  '怎么推进关系而不丢了自己',
  '我是不是想太多了',
  '搞清楚他到底是什么样的人',
]

const inputClass = "w-full p-3 rounded-xl text-[13px] bg-white border border-crush-card text-crush-dark placeholder:text-crush-gray/40 outline-none focus:border-crush-pink transition-colors"
const selectClass = inputClass + ' appearance-none'

export default function QuickContext() {
  const { navigate, setSelfProfile, setCrushProfile } = useApp()

  const [myName, setMyName] = useState('')
  const [hisName, setHisName] = useState('')
  const [meet, setMeet] = useState('')
  const [duration, setDuration] = useState('')
  const [goal, setGoal] = useState('')
  const [goalCustom, setGoalCustom] = useState('')
  const [emotions, setEmotions] = useState([])
  const [notes, setNotes] = useState('')

  const toggleEmotion = (e) => {
    setEmotions(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])
  }

  const canSubmit = myName.trim() && hisName.trim() && meet

  const handleSubmit = () => {
    setSelfProfile({
      name: myName.trim(),
      goal: goal === 'other' ? goalCustom : goal,
      emotions,
      notes: notes.trim(),
    })
    setCrushProfile({
      nickname: hisName.trim(),
      meet,
      duration,
    })
    navigate('main')
  }

  return (
    <div className="h-full w-full flex items-center justify-center overflow-y-auto">
      <div className="max-w-xl w-full px-8 py-10">

        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-crush-pink/20 flex items-center justify-center text-2xl mb-4">🛡️</div>
          <h2 className="text-crush-dark text-[19px] font-medium mb-1">先认识一下</h2>
          <p className="text-crush-gray text-[13px] leading-[1.9]">
            这些不是心理测试。你告诉我的每一件事，都会帮我在分析他的聊天时更懂你们的状况。
          </p>
        </div>

        <div className="space-y-5">

          {/* Q1 + Q2: Names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-crush-gray text-[11px] ml-1 mb-1.5 block font-medium">你怎么称呼？</label>
              <input type="text" value={myName} onChange={e => setMyName(e.target.value)}
                placeholder="昵称就好"
                className={inputClass} />
            </div>
            <div>
              <label className="text-crush-gray text-[11px] ml-1 mb-1.5 block font-medium">他的称呼？</label>
              <input type="text" value={hisName} onChange={e => setHisName(e.target.value)}
                placeholder="不写真名"
                className={inputClass} />
            </div>
          </div>

          {/* Q3: How you met + duration */}
          <div>
            <label className="text-crush-gray text-[11px] ml-1 mb-1.5 block font-medium">怎么认识的？认识多久了？</label>
            <div className="grid grid-cols-2 gap-3">
              <select value={meet} onChange={e => setMeet(e.target.value)} className={selectClass}>
                <option value="" disabled>怎么认识的</option>
                {MEET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <select value={duration} onChange={e => setDuration(e.target.value)} className={selectClass}>
                <option value="" disabled>认识多久</option>
                {DURATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Q4: What do you want to know */}
          <div>
            <label className="text-crush-gray text-[11px] ml-1 mb-1.5 block font-medium">你现在最想知道什么？</label>
            <div className="space-y-2">
              {GOAL_OPTIONS.map(g => (
                <button key={g} onClick={() => setGoal(prev => prev === g ? '' : g)}
                  className={`w-full text-left p-3 rounded-xl text-[13px] transition-all ${
                    goal === g
                      ? 'bg-crush-pink text-white shadow-sm'
                      : 'bg-white border border-crush-card text-crush-gray hover:border-crush-pink'
                  }`}
                >{g}</button>
              ))}
              {goal === 'other' && (
                <input type="text" value={goalCustom} onChange={e => setGoalCustom(e.target.value)}
                  placeholder="说说看..."
                  className={inputClass} />
              )}
              <button onClick={() => setGoal(prev => prev === 'other' ? '' : 'other')}
                className={`text-[12px] ${goal === 'other' ? 'text-crush-pink' : 'text-crush-gray/40 hover:text-crush-gray'} transition-colors`}>
                或者自己写一个
              </button>
            </div>
          </div>

          {/* Q5: Emotions */}
          <div>
            <label className="text-crush-gray text-[11px] ml-1 mb-1.5 block font-medium">你最近因为他有过什么情绪？（可多选）</label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_OPTIONS.map(e => (
                <button key={e} onClick={() => toggleEmotion(e)}
                  className={`px-4 py-2 rounded-xl text-[13px] transition-all ${
                    emotions.includes(e)
                      ? 'bg-crush-pink text-white shadow-sm'
                      : 'bg-white border border-crush-card text-crush-gray hover:border-crush-pink'
                  }`}
                >{e}</button>
              ))}
            </div>
          </div>

          {/* Q6: Open notes */}
          <div>
            <label className="text-crush-gray text-[11px] ml-1 mb-1.5 block font-medium">还有什么想让我知道的？<span className="text-crush-gray/40 font-normal">（选填）</span></label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="比如：他最近突然变冷淡了 / 我们马上要一起出差 / 他刚分手不久..."
              rows={3}
              className={inputClass + ' resize-none'} />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <button onClick={handleSubmit} disabled={!canSubmit}
            className={`w-full py-3.5 rounded-xl text-[15px] font-medium transition-all ${
              canSubmit
                ? 'bg-crush-pink text-white hover:opacity-90 active:opacity-80'
                : 'bg-crush-card text-crush-gray/40'
            }`}>
            开始和小盾聊天
          </button>
          <p className="text-crush-gray/40 text-[11px] text-center mt-3">
            以上信息仅用于帮小盾更懂你的处境。你可以在「洞察」页随时修改。
          </p>
        </div>

      </div>
    </div>
  )
}
