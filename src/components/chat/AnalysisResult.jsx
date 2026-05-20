import StrategySlider from './StrategySlider'

const bubbleWidth = 'w-[400px] max-w-[70%]'

export default function AnalysisResult({ data }) {
  const content = data || {}

  return (
    <div className="space-y-3 py-2">

      {/* Combined: Shield + Objective */}
      {(content.shieldText || content.objective) && (
        <div className="flex gap-2.5">
          <div className="w-8 h-8 rounded-full bg-crush-pink/15 flex items-center justify-center flex-shrink-0 text-base">🛡️</div>
          <div className={`flex flex-col ${bubbleWidth}`}>
            <span className="text-[10px] mb-1 px-1 text-crush-pink/60 font-medium">小盾</span>
            <div className="bg-white border border-crush-pink/20 rounded-2xl rounded-tl-md shadow-sm px-6 py-4">
              <div className="space-y-4">
                {content.shieldText && (
                  <p className="text-crush-dark text-[13px] leading-[2]">{content.shieldText}</p>
                )}
                {content.shieldText && content.objective && (
                  <div className="border-t border-crush-bg/60" />
                )}
                {content.objective && (
                  <div className="space-y-3.5">
                    <div>
                      <span className="inline-block text-[10px] text-crush-pink/70 bg-crush-pink/5 px-2 py-0.5 rounded-full mb-1.5 font-medium">事实还原</span>
                      <p className="text-crush-dark text-[13px] leading-[2]">{content.objective.facts}</p>
                    </div>
                    <div className="border-t border-crush-bg/60 pt-3.5">
                      <span className="inline-block text-[10px] text-crush-blue/70 bg-crush-blue/5 px-2 py-0.5 rounded-full mb-1.5 font-medium">情绪解读</span>
                      <p className="text-crush-dark text-[13px] leading-[2]">{content.objective.emotion}</p>
                    </div>
                    <div className="border-t border-crush-bg/60 pt-3.5">
                      <span className="inline-block text-[10px] text-crush-warn/70 bg-crush-warn/5 px-2 py-0.5 rounded-full mb-1.5 font-medium">清醒提醒</span>
                      <p className="text-crush-dark text-[13px] leading-[2]">{content.objective.reminder}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategy */}
      <div className="flex gap-2.5">
        <div className="w-8 h-8 rounded-full bg-crush-yellow/30 flex items-center justify-center flex-shrink-0 text-base">🎯</div>
        <div className={`flex flex-col ${bubbleWidth}`}>
          <span className="text-[10px] mb-1 px-1 text-crush-yellow/70 font-medium">小盾 · 高价值策略</span>
          <div className="bg-white border border-crush-yellow/30 rounded-2xl rounded-tl-md shadow-sm">
            <StrategySlider strategies={content.strategies} />
          </div>
        </div>
      </div>
    </div>
  )
}
