import { useApp } from '../context/AppContext'

export default function Welcome() {
  const { navigate } = useApp()

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center max-w-sm px-8">
        <div className="w-20 h-20 mx-auto rounded-[24px] bg-crush-pink/20 flex items-center justify-center mb-10">
          <span className="text-4xl">🛡️</span>
        </div>

        <div className="space-y-4 mb-12">
          <p className="text-crush-dark text-[22px] leading-[1.8] font-light">
            嗨，我是小盾。
          </p>
          <p className="text-crush-dark text-[18px] leading-[1.8]">
            我不会看星盘，也不算塔罗牌。
          </p>
          <p className="text-crush-gray text-[14px] leading-[2]">
            我会帮你分析他的聊天记录、看清行为模式、给出具体的策略。先花 1 分钟回答几个问题——不是心理测试，是为了在分析时更懂你们的状况。
          </p>
        </div>

        <button
          onClick={() => navigate('quickContext')}
          className="w-full py-3.5 bg-crush-pink text-white rounded-[14px] text-[15px] font-medium hover:opacity-90 active:opacity-80 transition-opacity"
        >
          开始
        </button>
      </div>
    </div>
  )
}
