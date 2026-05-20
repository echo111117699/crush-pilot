import { useApp } from '../../context/AppContext'

const TABS = [
  { key: 'analyze', label: '分析', icon: '🛡️', desc: '上传聊天 · 获取策略' },
  { key: 'insight', label: '洞察', icon: '🔍', desc: '人格档案 · 关系模式' },
]

export default function SideNav({ onOpenSettings }) {
  const { activeTab, setActiveTab } = useApp()

  return (
    <nav className="w-56 flex-shrink-0 bg-white/50 border-r border-crush-card flex flex-col py-8">
      {/* Logo area */}
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-crush-pink/20 flex items-center justify-center text-xl">🛡️</div>
          <div>
            <p className="text-crush-dark text-[15px] font-medium">Crush Pilot</p>
            <p className="text-crush-gray text-[11px]">小盾陪你</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="px-4 space-y-1 flex-1">
        {TABS.map(tab => {
          const active = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                active
                  ? 'bg-crush-pink/10 text-crush-pink font-medium'
                  : 'text-crush-gray hover:bg-crush-card/50'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <div>
                <p className="text-[14px]">{tab.label}</p>
                <p className="text-[11px] opacity-60">{tab.desc}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Bottom area */}
      <div className="px-6 pt-4 border-t border-crush-card mx-4">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-crush-gray/60 hover:text-crush-gray hover:bg-crush-card/50 transition-colors text-[11px]"
        >
          <span>⚙</span>
          <span>API 设置</span>
        </button>
      </div>
    </nav>
  )
}
