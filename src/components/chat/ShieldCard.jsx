import { useApp } from '../../context/AppContext'

export default function ShieldCard({ silentPeriod }) {
  const { shieldText } = useApp()
  return (
    <div className="px-6 py-3">
      <div className="bg-crush-card border border-crush-pink/20 rounded-[14px] px-6 py-3">
        <p className="text-crush-dark text-[13px] leading-[2]">
          🛡️ {silentPeriod?.active
            ? '你启动了静默期,但我看到你又来了。我可以陪你聊,但要不要先告诉我:为什么这一刻你又想他了?'
            : shieldText}
        </p>
      </div>
    </div>
  )
}
