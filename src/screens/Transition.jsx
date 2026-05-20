import { useApp } from '../context/AppContext'

export default function Transition() {
  const { navigate } = useApp()
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center max-w-lg px-12">
        <p className="text-crush-dark text-[20px] leading-[1.8] mb-3">好了,现在我比很多人都更认识你。</p>
        <p className="text-crush-gray text-[14px] leading-[1.8] mb-10">接下来再告诉我他的事,但只是顺便。</p>
        <button onClick={() => navigate('crushForm')}
          className="w-full py-3.5 bg-crush-pink text-white rounded-[14px] text-[15px] font-medium hover:opacity-90 active:opacity-80 transition-opacity">
          继续</button>
      </div>
    </div>
  )
}
