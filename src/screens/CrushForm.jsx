import { useState } from 'react'
import { useApp } from '../context/AppContext'

const DURATION_OPTIONS = ['< 1 月', '1-3 月', '3-6 月', '6-12 月', '> 1 年']
const MEET_OPTIONS = ['同学', '同事', '网友', '朋友介绍', '偶然相遇', '其他']
const MBTI_OPTIONS = ['', 'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
const inputClass = "w-full p-3.5 rounded-[12px] text-[13px] bg-white border border-crush-card text-crush-dark placeholder:text-crush-gray/40 outline-none focus:border-crush-pink transition-colors"

export default function CrushForm() {
  const { navigate, setCrushProfile } = useApp()
  const [form, setForm] = useState({ nickname: '', duration: '', meet: '', mbti: '', trait: '', status: '' })
  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const handleSubmit = () => { setCrushProfile(form); navigate('main') }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="max-w-xl mx-auto px-12 py-12">
        <div className="text-center mb-8">
          <p className="text-crush-dark text-[22px] font-medium mb-1">说说他</p>
          <p className="text-crush-gray text-[13px]">你和他完全平等。</p>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
          <div className="col-span-2">
            <label className="text-crush-gray text-[12px] ml-1 mb-1 block">他的称呼 / 昵称(不要真名)</label>
            <input type="text" value={form.nickname} onChange={(e) => update('nickname', e.target.value)} placeholder="比如:那个程序员" className={inputClass} />
          </div>
          <div>
            <label className="text-crush-gray text-[12px] ml-1 mb-1 block">你们认识多久了</label>
            <select value={form.duration} onChange={(e) => update('duration', e.target.value)} className={inputClass + ' appearance-none'}>
              <option value="" disabled>选择...</option>
              {DURATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select>
          </div>
          <div>
            <label className="text-crush-gray text-[12px] ml-1 mb-1 block">怎么认识的</label>
            <select value={form.meet} onChange={(e) => update('meet', e.target.value)} className={inputClass + ' appearance-none'}>
              <option value="" disabled>选择...</option>
              {MEET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select>
          </div>
          <div>
            <label className="text-crush-gray text-[12px] ml-1 mb-1 block">他的 MBTI(可选)</label>
            <select value={form.mbti} onChange={(e) => update('mbti', e.target.value)} className={inputClass + ' appearance-none'}>
              {MBTI_OPTIONS.map(o => <option key={o} value={o}>{o || '不选'}</option>)}</select>
          </div>
          <div>
            <label className="text-crush-gray text-[12px] ml-1 mb-1 block">他最吸引你的一个特质</label>
            <input type="text" value={form.trait} onChange={(e) => update('trait', e.target.value)} placeholder="比如:他听我说话的时候真的很认真" className={inputClass} />
          </div>
          <div className="col-span-2">
            <label className="text-crush-gray text-[12px] ml-1 mb-1 block">一句话形容你们目前的关系状态</label>
            <input type="text" value={form.status} onChange={(e) => update('status', e.target.value)} placeholder="比如:每天聊天但谁也不说破" className={inputClass} />
          </div>
        </div>
        <div className="mt-5">
          <label className="text-crush-gray text-[12px] ml-1 mb-1.5 block">上传他的社交媒体截图(可选,最多 3 张)</label>
          <div className="flex gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-20 h-20 rounded-[14px] bg-white border border-dashed border-crush-pink/40 flex items-center justify-center text-crush-gray/30 text-2xl">+</div>
            ))}
          </div>
        </div>
        <p className="text-crush-gray text-[12px] italic text-center mt-6 mb-5">
          档案完成 70% 就够用了。剩下的我会在和你的聊天里慢慢理解他。你不需要为了让我更准而去翻他的社交动态。</p>
        <button onClick={handleSubmit}
          className="w-full py-3.5 bg-crush-pink text-white rounded-[14px] text-[15px] font-medium hover:opacity-90 active:opacity-80 transition-opacity">
          保存,开始聊天</button>
        <button onClick={() => { setCrushProfile({}); navigate('main') }}
          className="w-full py-2.5 text-crush-gray/40 text-[13px] hover:text-crush-gray transition-colors mt-2">
          跳过，先开始聊天</button>
      </div>
    </div>
  )
}
