import { useRef } from 'react'
import { hasApiKey } from '../../services/api'

const MOCK_SCREENSHOTS = [
  { id: 1, label: '聊天截图 1', preview: '💬' },
  { id: 2, label: '聊天截图 2', preview: '📱' },
  { id: 3, label: '朋友圈截图', preview: '🖼️' },
]

export default function UploadSimulator({ onUpload, onClose }) {
  const fileRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) onUpload(file)
  }

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white rounded-[14px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-crush-card z-10 w-72">
      <p className="text-crush-dark text-[14px] font-medium mb-3">上传聊天截图分析</p>

      {hasApiKey() && (
        <>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-crush-pink/10 hover:bg-crush-pink/15 transition-colors mb-2"
          >
            <span className="text-2xl">📷</span>
            <span className="text-crush-pink text-[14px] font-medium">选择真实截图上传</span>
          </button>
          <p className="text-crush-gray/40 text-[10px] mb-3 px-1">或使用模拟截图演示：</p>
        </>
      )}

      <div className="space-y-2">
        {MOCK_SCREENSHOTS.map(s => (
          <button
            key={s.id}
            onClick={() => onUpload(null, s.id - 1)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-crush-bg hover:bg-crush-card transition-colors"
          >
            <span className="text-2xl">{s.preview}</span>
            <span className="text-crush-dark text-[14px]">{s.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        className="w-full mt-3 py-2.5 text-crush-gray text-[13px] hover:text-crush-dark transition-colors rounded-lg hover:bg-crush-card"
      >
        取消
      </button>
    </div>
  )
}
