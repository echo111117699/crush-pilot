import { useApp } from '../../context/AppContext'
import DailyCheckin from './DailyCheckin'
import SilentPeriod from './SilentPeriod'
import WeeklyHighlight from './WeeklyHighlight'

export default function MeView() {
  const { selfProfile } = useApp()

  const completion = selfProfile ? Object.keys(selfProfile).length : 0
  const pct = Math.min(Math.round((completion / 10) * 100), 100)

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Top welcome */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-crush-pink/20 flex items-center justify-center text-2xl flex-shrink-0">
            🌸
          </div>
          <div>
            <p className="text-crush-gray text-[11px] mb-1">每日状态</p>
            <p className="text-crush-dark text-[15px] leading-[1.6] italic">
              专注是你的护城河,今天也别让任何人渡过它。
            </p>
          </div>
        </div>

        {/* Main grid: 2 columns */}
        <div className="grid grid-cols-2 gap-6">
          {/* Daily checkin - spans full width */}
          <div className="col-span-2">
            <DailyCheckin />
          </div>

          {/* Silent period */}
          <SilentPeriod />

          {/* Self profile summary */}
          <div className="bg-crush-card rounded-[14px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <h3 className="text-crush-dark text-[15px] mb-4">📔 关于你</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-crush-pink rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-crush-gray text-[11px]">{pct}%</span>
            </div>
            {pct >= 70 && (
              <p className="text-crush-green text-[12px] mb-4">已经够用了 ✓</p>
            )}
            <button className="w-full py-3 rounded-xl border border-crush-pink/30 text-crush-pink text-[13px] hover:bg-crush-pink/5 transition-colors">
              编辑档案
            </button>
          </div>

          {/* Weekly highlight */}
          <div className="col-span-2">
            <WeeklyHighlight />
          </div>

          {/* High moments wall */}
          <div className="col-span-2">
            <div className="bg-crush-card rounded-[14px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <h3 className="text-crush-dark text-[15px] mb-5">✨ 酷瞬间语录</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[
                  { text: '你独自看完了一场电影', date: '这周' },
                  { text: '你完成了一份拖了三周的报告', date: '上周' },
                  { text: '你拒绝了一次让你不舒服的聚餐', date: '两周前' },
                  { text: '你一个人去了那家一直想去的餐厅', date: '三周前' },
                ].map((item, i) => (
                  <div key={i} className="flex-shrink-0 w-[180px] bg-white rounded-xl p-4">
                    <p className="text-crush-dark text-[13px] leading-[1.7] mb-3">"{item.text}"</p>
                    <p className="text-crush-gray text-[11px]">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex justify-center gap-8 pt-8 pb-4">
          <button className="text-crush-gray/40 text-[12px] hover:text-crush-gray transition-colors">设置</button>
          <button className="text-crush-gray/40 text-[12px] hover:text-crush-gray transition-colors">隐私</button>
          <button className="text-crush-gray/40 text-[12px] hover:text-crush-gray transition-colors">关于小盾</button>
        </div>
      </div>
    </div>
  )
}
