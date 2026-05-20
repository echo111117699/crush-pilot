export default function PrivacyModal({ onAccept }) {
  return (
    <div className="h-full w-full bg-crush-bg flex items-center justify-center p-8">
      <div className="bg-crush-card rounded-[14px] p-8 w-full max-w-sm shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="text-4xl mb-6 text-center">🛡️</div>
        <p className="text-crush-dark text-[15px] leading-relaxed mb-5">
          所有聊天截图在云端分析完即销毁。
        </p>
        <p className="text-crush-dark text-[15px] leading-relaxed mb-5">
          你的自我档案和 Crush 档案只存在你的设备本地。
        </p>
        <p className="text-crush-dark text-[15px] leading-relaxed mb-8">
          我从不向任何人透露你跟我说过的话。
        </p>
        <button
          onClick={onAccept}
          className="w-full py-3.5 bg-crush-pink text-white rounded-[14px] text-[15px] font-medium active:opacity-80 transition-opacity"
        >
          我知道了
        </button>
      </div>
    </div>
  )
}
