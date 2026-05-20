import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import SilentPeriod from '../me/SilentPeriod'
import WeeklyHighlight from '../me/WeeklyHighlight'

const DURATION_OPTIONS = ['< 1 月', '1-3 月', '3-6 月', '6-12 月', '> 1 年']
const MEET_OPTIONS = ['同学', '同事', '网友', '朋友介绍', '偶然相遇', '其他']

const fieldClass = "w-full p-3 rounded-xl text-[13px] bg-crush-bg border border-crush-card text-crush-dark outline-none focus:border-crush-pink transition-colors"

export default function InsightView() {
  const { selfProfile, crushProfile, setCrushProfile, personalityInsights } = useApp()
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ ...crushProfile })
  const [youTab, setYouTab] = useState('state')

  const YOU_TABS = [
    { key: 'state', label: '你的状态', icon: '📔' },
    { key: 'silent', label: '静默期', icon: '🕯️' },
    { key: 'weekly', label: '这周的你', icon: '✨' },
  ]

  const hasProfile = crushProfile && crushProfile.nickname
  const hasAnalyses = personalityInsights.totalAnalyses > 0
  const hasSelfProfile = selfProfile && selfProfile.goal

  const updateForm = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const saveForm = () => { setCrushProfile(form); setEditMode(false) }

  return (
    <div className="h-full overflow-y-auto flex justify-center">
      <div className="w-full max-w-4xl px-8 py-10 space-y-14">

        {/* ==================== 关于他 ==================== */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-8 h-8 rounded-lg bg-crush-blue/20 flex items-center justify-center text-sm">🔍</span>
            <h2 className="text-crush-dark text-[16px] font-medium">关于他</h2>
          </div>

          {/* Profile + Behavior — one unified card */}
          <div className="bg-white rounded-2xl border border-crush-card/60 shadow-sm overflow-hidden">

            {/* Profile section */}
            {hasProfile ? (
              editMode ? (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-crush-gray text-[11px] ml-1 mb-1 block">称呼</label>
                      <input type="text" value={form.nickname || ''} onChange={e => updateForm('nickname', e.target.value)} className={fieldClass} />
                    </div>
                    <div>
                      <label className="text-crush-gray text-[11px] ml-1 mb-1 block">关系状态</label>
                      <input type="text" value={form.status || ''} onChange={e => updateForm('status', e.target.value)} className={fieldClass} placeholder="比如：暧昧中" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-crush-gray text-[11px] ml-1 mb-1 block">认识方式</label>
                      <select value={form.meet || ''} onChange={e => updateForm('meet', e.target.value)} className={fieldClass + ' appearance-none'}>
                        {MEET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-crush-gray text-[11px] ml-1 mb-1 block">认识时长</label>
                      <select value={form.duration || ''} onChange={e => updateForm('duration', e.target.value)} className={fieldClass + ' appearance-none'}>
                        {DURATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button onClick={saveForm} className="flex-1 py-2.5 rounded-xl bg-crush-pink text-white text-[13px] font-medium hover:opacity-90">保存</button>
                    <button onClick={() => setEditMode(false)} className="flex-1 py-2.5 rounded-xl border border-crush-card text-crush-gray text-[13px] hover:bg-crush-card/50">取消</button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-crush-pink/12 flex items-center justify-center text-lg flex-shrink-0">👤</div>
                    <div className="min-w-0">
                      <p className="text-crush-dark text-[14px] font-medium truncate">{crushProfile.nickname}</p>
                      <p className="text-crush-gray text-[12px]">{crushProfile.status || '关系状态未设置'}</p>
                    </div>
                    <button onClick={() => { setForm({ ...crushProfile }); setEditMode(true) }}
                      className="ml-auto text-[12px] text-crush-pink hover:underline flex-shrink-0">编辑</button>
                  </div>
                  <div className="flex gap-5 mt-4 text-[12px] text-crush-gray">
                    <span>认识方式 · {crushProfile.meet || '—'}</span>
                    <span>认识时长 · {crushProfile.duration || '—'}</span>
                  </div>
                </div>
              )
            ) : (
              <div className="p-8 text-center">
                <p className="text-crush-gray text-[13px] mb-1">还没有 Crush 档案</p>
                <p className="text-crush-gray/50 text-[12px]">去「分析」页上传截图，小盾会帮你建立对他的认知</p>
              </div>
            )}

            {/* Divider between profile and behavior */}
            {hasProfile && <div className="border-t border-crush-card/40" />}

            {/* Behavior insights */}
            <div className="p-6">
              <h3 className="text-crush-dark text-[13px] font-medium mb-4">行为模式发现</h3>

              {hasAnalyses && personalityInsights.aboutHim.length > 0 ? (
                <div className="space-y-4">
                  {personalityInsights.aboutHim.map((item, i) => (
                    <div key={i} className="bg-crush-bg rounded-xl px-5 py-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-crush-dark text-[13px] font-medium">{item.pattern}</span>
                        {item.confidence === 'high' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-crush-blue/20 text-crush-blue">高可信度</span>
                        )}
                      </div>
                      {item.sources && item.sources.length > 0 && (
                        <div className="space-y-0.5">
                          {item.sources.map((s, j) => (
                            <p key={j} className="text-crush-gray text-[11px] leading-[1.9]">{s}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <p className="text-crush-gray/40 text-[11px] text-center pt-1">
                    基于 {personalityInsights.totalAnalyses} 次分析积累
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-crush-gray/40 text-[13px] leading-[2]">
                    {hasProfile
                      ? '上传第一张聊天截图后，这里会开始积累关于他的行为发现。每次分析都会让认知更清晰。'
                      : '这里会是一个越来越丰满的洞察面板——基于真实对话数据，而不是星座和标签。'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==================== 关于你 ==================== */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-8 h-8 rounded-lg bg-crush-pink/15 flex items-center justify-center text-sm">🌸</span>
            <h2 className="text-crush-dark text-[16px] font-medium">关于你</h2>
          </div>

          <div className="bg-white rounded-2xl border border-crush-card/60 shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-crush-card/40">
              {YOU_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setYouTab(tab.key)}
                  className={`flex-1 py-3.5 text-[13px] font-medium transition-all relative ${
                    youTab === tab.key
                      ? 'text-crush-pink'
                      : 'text-crush-gray/50 hover:text-crush-gray'
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>{tab.label}
                  {youTab === tab.key && (
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-crush-pink" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6 min-h-[320px]">
              {youTab === 'state' && (
                hasSelfProfile ? (
                  <div className="space-y-6 text-[13px] leading-[1.9]">
                    {/* Core info */}
                    <div className="bg-crush-bg rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-crush-gray text-[12px]">你想知道</span>
                        <span className="text-crush-dark font-medium">{selfProfile.goal}</span>
                      </div>
                      {selfProfile.emotions && selfProfile.emotions.length > 0 && (
                        <div className="flex items-center gap-2.5">
                          <span className="text-crush-gray text-[12px] flex-shrink-0">近期情绪</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selfProfile.emotions.map((e, i) => (
                              <span key={i} className="px-2.5 py-1.5 rounded-full bg-crush-pink/10 text-crush-pink text-[11px]">{e}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Usage stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-crush-bg rounded-xl p-4 text-center">
                        <p className="text-crush-pink text-[17px] font-medium">{personalityInsights.totalAnalyses}</p>
                        <p className="text-crush-gray text-[11px] mt-1">次分析</p>
                      </div>
                      <div className="bg-crush-bg rounded-xl p-4 text-center">
                        <p className="text-crush-pink text-[17px] font-medium">{personalityInsights.aboutYou.length}</p>
                        <p className="text-crush-gray text-[11px] mt-1">条自我发现</p>
                      </div>
                      <div className="bg-crush-bg rounded-xl p-4 text-center">
                        <p className="text-crush-pink text-[17px] font-medium">{personalityInsights.aboutHim.length}</p>
                        <p className="text-crush-gray text-[11px] mt-1">条对他的认知</p>
                      </div>
                    </div>

                    {/* About you insights */}
                    {personalityInsights.aboutYou.length > 0 && (
                      <div>
                        <p className="text-crush-gray text-[12px] mb-2.5">你的关系模式</p>
                        <div className="space-y-2.5">
                          {personalityInsights.aboutYou.map((item, i) => (
                            <div key={i} className="bg-crush-bg rounded-lg px-4 py-3.5 flex items-start gap-3">
                              <span className="text-sm mt-0.5">💡</span>
                              <div>
                                <p className="text-crush-dark text-[12px] font-medium leading-[2]">{item.pattern}</p>
                                {item.sources && <p className="text-crush-gray/60 text-[11px] mt-1 leading-[1.9]">{item.sources[0]}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selfProfile.notes && (
                      <div className="bg-crush-warn/5 border border-crush-warn/15 rounded-xl p-4">
                        <p className="text-crush-gray text-[11px] mb-1.5">你的备注</p>
                        <p className="text-crush-dark text-[12px] leading-[2]">{selfProfile.notes}</p>
                      </div>
                    )}

                    <p className="text-crush-gray/40 text-[11px] text-center leading-[2]">
                      每次分析都在帮你更了解自己在这段关系里的位置
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[272px]">
                    <div className="text-center">
                      <div className="text-3xl mb-4">🌸</div>
                      <p className="text-crush-gray/50 text-[13px] leading-[2]">
                        去「分析」页和小盾聊聊<br />她会帮你认识在关系中的自己
                      </p>
                    </div>
                  </div>
                )
              )}

              {youTab === 'silent' && <SilentPeriod embedded />}

              {youTab === 'weekly' && <WeeklyHighlight embedded />}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
