import { useState } from 'react'
import { useApp } from '../context/AppContext'
import SideNav from '../components/shared/BottomTabBar'
import ChatView from '../components/chat/ChatView'
import InsightView from '../components/insight/InsightView'
import SettingsModal from '../components/shared/SettingsModal'

export default function MainLayout() {
  const { activeTab } = useApp()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="h-full w-full flex relative">
      <SideNav onOpenSettings={() => setShowSettings(true)} />
      <main className="flex-1 overflow-hidden">
        {activeTab === 'analyze' && <ChatView />}
        {activeTab === 'insight' && <InsightView />}
      </main>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}
