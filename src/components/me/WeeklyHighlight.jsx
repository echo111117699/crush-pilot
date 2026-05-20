import { useApp } from '../../context/AppContext'

export default function WeeklyHighlight({ embedded }) {
  const { messages, personalityInsights } = useApp()

  const highlights = [
    { text: '你独自看完了一场电影', note: '不需要任何人陪' },
    { text: '你完成了那份拖了三周的报告', note: '对自己的承诺' },
    { text: '你拒绝了一次让你不舒服的聚餐', note: '边界感' },
  ]

  const chatCount = messages.filter(m => m.role === 'user').length
  const analysisCount = personalityInsights.totalAnalyses

  const today = new Date()
  const weekAgo = new Date(today.getTime() - 6 * 86400000)
  const fmt = (d) => `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
  const dateRange = `${fmt(weekAgo)} — ${fmt(today)}`

  const content = (
    <div className="space-y-5">
      {/* Date header */}
      <div className="text-center">
        <div className="text-2xl mb-1.5">🛡️</div>
        <p className="text-crush-dark text-[14px] font-medium">这周的你</p>
        <p className="text-crush-gray text-[11px]">{dateRange}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-crush-bg rounded-xl p-4 text-center">
          <p className="text-crush-pink text-[18px] font-medium">{chatCount}</p>
          <p className="text-crush-gray text-[11px] mt-0.5">次和小盾聊天</p>
        </div>
        <div className="bg-crush-bg rounded-xl p-4 text-center">
          <p className="text-crush-pink text-[18px] font-medium">{analysisCount}</p>
          <p className="text-crush-gray text-[11px] mt-0.5">次截图分析</p>
        </div>
      </div>

      {/* Highlights */}
      <div>
        <p className="text-crush-gray text-[12px] mb-2.5">但你也告诉了我这些瞬间：</p>
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="bg-crush-bg rounded-xl px-4 py-3.5 flex items-center justify-between">
              <span className="text-crush-dark text-[13px]">✦ {h.text}</span>
              <span className="text-crush-gray/50 text-[11px] flex-shrink-0 ml-3">{h.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Relationship insight */}
      {analysisCount > 0 && (
        <div className="bg-crush-warn/5 border border-crush-warn/10 rounded-xl p-4">
          <p className="text-crush-gray text-[12px] leading-[2]">
            这周你和他聊了 <span className="text-crush-pink font-medium">{chatCount} 次</span>，但也完成了 <span className="text-crush-pink font-medium">{highlights.length} 件</span>跟他无关的事。这两行数字同样重要。
          </p>
        </div>
      )}

      {/* Bottom quote */}
      <p className="text-crush-gray/40 text-[11px] text-center italic">
        这张卡片里没有他。这才是我想让你看见的你。
      </p>

      <div className="flex gap-3">
        <button className="flex-1 py-2.5 rounded-xl bg-crush-pink text-white text-[13px] font-medium hover:opacity-90 transition-opacity">
          保存到相册
        </button>
        <button className="flex-1 py-2.5 rounded-xl border border-crush-pink/30 text-crush-pink text-[13px] hover:bg-crush-pink/5 transition-colors">
          分享
        </button>
      </div>
    </div>
  )

  if (embedded) return content
  return (
    <div className="bg-crush-card rounded-[14px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {content}
    </div>
  )
}
