import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const DURATION_OPTIONS = ['< 1 月', '1-3 月', '3-6 月', '6-12 月', '> 1 年']
const MEET_OPTIONS = ['同学', '同事', '网友', '朋友介绍', '偶然相遇', '其他']
const MBTI_OPTIONS = ['', 'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']

const inputClass = "w-full p-4 rounded-xl text-[13px] bg-white border border-crush-card text-crush-dark outline-none focus:border-crush-pink transition-colors"

export default function ArchiveView() {
  const { crushProfile, setCrushProfile } = useApp()
  const [showArchive, setShowArchive] = useState(false)
  const [archived, setArchived] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ ...crushProfile })

  const hasProfile = crushProfile && crushProfile.nickname
  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  if (archived) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md px-12">
          <div className="text-5xl mb-8">📦</div>
          <p className="text-crush-dark text-[18px] leading-[1.8] mb-4">已归档</p>
          <p className="text-crush-gray text-[14px] leading-[1.7] mb-10">
            他还在你的回忆里,但小盾不会再围绕他展开了。你可以随时回来把他取出来。
          </p>
          <button
            onClick={() => { setArchived(false); setCrushProfile({ ...form, archived: false }) }}
            className="py-3 px-8 rounded-xl border border-crush-pink/30 text-crush-pink text-[13px] hover:bg-crush-pink/5 transition-colors"
          >
            取消归档
          </button>
        </div>
      </div>
    )
  }

  if (!hasProfile) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md px-12">
          <div className="text-5xl mb-8">📋</div>
          <p className="text-crush-dark text-[18px] leading-[1.8] mb-4">还没有 Crush 档案</p>
          <p className="text-crush-gray text-[14px] leading-[1.7]">先去聊天 Tab 和小盾聊聊吧</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-18 h-18 mx-auto rounded-full bg-crush-card flex items-center justify-center text-3xl mb-4">
            👤
          </div>
          <h2 className="text-crush-dark text-[19px] font-medium">{form.nickname}</h2>
          <p className="text-crush-gray text-[12px] mt-2">{form.status || '关系状态未设置'}</p>
        </div>

        {/* Fields */}
        <div className="space-y-5">
          {[
            { label: '称呼 / 昵称', key: 'nickname' },
            { label: '认识时长', key: 'duration', type: 'select', options: DURATION_OPTIONS },
            { label: '怎么认识的', key: 'meet', type: 'select', options: MEET_OPTIONS },
            { label: 'MBTI', key: 'mbti', type: 'select', options: MBTI_OPTIONS },
            { label: '最吸引你的特质', key: 'trait' },
            { label: '关系状态', key: 'status' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-crush-gray text-[12px] ml-1 mb-1.5 block">{f.label}</label>
              {editMode ? (
                f.type === 'select' ? (
                  <select value={form[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} className={inputClass + ' appearance-none'}>
                    {f.options.map(o => <option key={o} value={o}>{o || '不选'}</option>)}
                  </select>
                ) : (
                  <input type="text" value={form[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} className={inputClass} />
                )
              ) : (
                <div className="w-full p-4 rounded-xl text-[13px] bg-white/50 text-crush-dark">
                  {form[f.key] || '未设置'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-8 space-y-3">
          {editMode ? (
            <button
              onClick={() => { setCrushProfile(form); setEditMode(false) }}
              className="w-full py-4 rounded-xl bg-crush-pink text-white text-[14px] font-medium hover:opacity-90 transition-opacity"
            >
              保存修改
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="w-full py-4 rounded-xl bg-crush-pink text-white text-[14px] font-medium hover:opacity-90 transition-opacity"
            >
              更新档案
            </button>
          )}
          <p className="text-crush-gray text-[11px] text-center">上次更新是 3 天前,最快还要 4 天可以再改</p>

          <button
            onClick={() => setShowArchive(true)}
            className="w-full py-3 text-crush-gray/40 text-[12px] hover:text-crush-gray transition-colors"
          >
            归档这位 Crush
          </button>
        </div>
      </div>

      {/* Archive modal */}
      {showArchive && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
            <p className="text-crush-dark text-[15px] leading-[1.7] mb-4">确定要把他归档吗?</p>
            <p className="text-crush-gray text-[13px] leading-[1.7] mb-8">
              归档之后他还在你的回忆里,但小盾不会再围绕他展开了。你随时可以回来把他取出来。
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowArchive(false)}
                className="flex-1 py-3.5 rounded-xl border border-crush-card text-crush-gray text-[13px] hover:bg-crush-card transition-colors"
              >
                再想想
              </button>
              <button
                onClick={() => { setArchived(true); setShowArchive(false) }}
                className="flex-1 py-3.5 rounded-xl bg-crush-pink text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
              >
                归档
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
