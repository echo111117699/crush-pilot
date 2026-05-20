import { useState, useRef, useEffect, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { sendChatMessage, analyzeConversation, analyzeScreenshotText, hasApiKey } from '../../services/api'
import ShieldCard from './ShieldCard'
import MessageBubble from './MessageBubble'
import AnalysisResult from './AnalysisResult'
import SoftGuidance from './SoftGuidance'
import UploadSimulator from './UploadSimulator'
import InputArea from './InputArea'

const PLEADING_KEYWORDS = ['我是不是', '他会不会', '我应该删掉', '是不是错了', '我太烦了', '我是不是想太多']
function detectPleading(text) { return PLEADING_KEYWORDS.some(kw => text.includes(kw)) }

// Insights extracted from each mock analysis
const MOCK_INSIGHTS = [
  {
    aboutHim: [
      { pattern: '闭合式回应', confidence: 'high', sources: ['多次用"嗯""好""哈哈"这类闭合词结束话题', '不主动追问关于你的任何事'] },
      { pattern: '回避型信号', confidence: 'high', sources: ['回复间隔越来越久', '对邀约给出敷衍回应（"再说吧"）'] },
    ],
    aboutYou: [
      { pattern: '主动程度远超对方', confidence: 'high', sources: ['你的消息长度是对方的 3 倍', '你发起了 3 次话题，对方 0 次'] },
    ],
  },
  {
    aboutHim: [
      { pattern: '忽冷忽热推拉模式', confidence: 'high', sources: ['凌晨和白天回复态度明显不同', '深夜主动分享音乐，白天简短回应'] },
      { pattern: '间歇性情绪投入', confidence: 'medium', sources: ['深夜主动但白天冷淡——投入程度与他的状态相关，与你无关'] },
    ],
    aboutYou: [
      { pattern: '对方的节奏主导了你的情绪', confidence: 'high', sources: ['对方的回应间隔影响你的焦虑水平', '在对方热情时加倍回应，冷淡时更焦虑'] },
    ],
  },
  {
    aboutHim: [
      { pattern: '模糊信号输出者', confidence: 'medium', sources: ['朋友圈配文极简（仅一个🌙），指向性弱', '对所有人的评论回复格式统一（😉），无特定指向'] },
    ],
    aboutYou: [
      { pattern: '过度解读倾向', confidence: 'high', sources: ['试图从一条朋友圈判断"是不是发给我看的"', '在缺乏清晰沟通的情况下自行推测动机'] },
    ],
  },
]

const MOCK_ANALYSES = [
  {
    shieldText: '我看到了你们的聊天记录。他回得越来越慢了，我知道你在数着分钟等回复——先深呼吸，我们一起来拆解。',
    objective: {
      facts: '截图里你和他的对话节奏明显不对称：你的消息偏长、偏主动，他的回复间隔越来越久，且多以"嗯""好""哈哈"这类闭合词结尾。他没有展开任何新话题，也没有追问关于你的任何事。',
      emotion: '他的态度偏敷衍和回避，不是明确的拒绝，而是"不主动不拒绝"的灰色地带。这种状态通常意味着他目前没有推进关系的动力，但同时也不愿意完全切断联系。',
      reminder: '当一个男生对你真正有兴趣的时候，他会找话题、会追问、会怕冷场。如果他连基本的对话接力都不做，问题不在你的聊天技巧，而在于他的投入意愿。不要为他的不作为找理由。'
    },
    strategies: [
      { label: '暂停主动', text: '接下来三天不主动发消息，看看他会不会主动找你。如果他完全不找，这个答案也很明确了。' },
      { label: '直接试探', text: '下次他隔很久才回的时候，直接问"你是不是最近很忙？感觉你回消息的节奏变了好多"——看他的反应，是不是愿意解释。' },
      { label: '态度的回应', text: '"感觉你最近回消息慢了好多诶，没关系的，你不用有压力，我就是好奇你最近在忙什么~"给他一个台阶，但释放了观察信号。' },
    ],
  },
  {
    shieldText: '截图我仔细看了。这一场对话里，他的态度像过山车——忽冷忽热的信号最容易让人内耗。我们来拆开看。',
    objective: {
      facts: '截图中他时而秒回带表情，时而隔几个小时才回几个字。他会在某些时刻主动撩你（深夜分享一首歌、问你在干嘛），但当你表现出更多兴趣时他又退回去了。典型的推拉模式。',
      emotion: '他不是完全不在意你——完全不在意的人根本不会花时间跟你推拉。但他的情绪投入是间歇性的，取决于他当时的状态：孤独了来找你，忙起来或者有其他选择时就冷淡。他的情绪波动主导了你们的互动节奏。',
      reminder: '真正值得你花时间的人，不会让你频繁处于"他到底什么意思"的猜测里。他的忽冷忽热不是你做错了什么，而是他本身就没准备好稳定的投入。别把他的情绪波动当成你该解决的问题。'
    },
    strategies: [
      { label: '同步节奏', text: '他冷的时候你也冷，他热的时候你回以同样的热度，但不要比他更热。让他感受到你的回应是有条件的、不是随叫随到的。' },
      { label: '打破框架', text: '下次他深夜找你的时候别秒回，第二天上午再回"昨晚睡了hh 怎么啦？"——把主动权拿回来，让他适应你的节奏而不是你追着他的。' },
      { label: '高段位推拉', text: '在他热情的时候说"你今天怎么这么可爱"，在他冷淡的时候完全不找他。让他开始琢磨"她到底怎么想的"——把内耗还给他。' },
    ],
  },
  {
    shieldText: '看到这条朋友圈了。我知道你在想"是不是发给我看的""他说的那个人是不是我"——停，我们先冷静下来拆开看。',
    objective: {
      facts: '他发了一条模糊的动态：分享了Coldplay的一首老歌，配文就一个夜空emoji🌙。这条内容指向性很弱，他评论区有好几个人留言说"有品位"，他统一回了两个😉。没有特别指向你的线索。',
      emotion: '发朋友圈的动机有很多：听到一首好歌想分享、深夜情绪上头、刷存在感、或者确实在暗示某个人。但从他的互动方式来看，他在评论区对所有人的回复都是统一格式的😉，说明这条动态更可能是面向泛社交圈的自我表达，而非定向信号。',
      reminder: '如果你需要通过解读他的朋友圈来判断他对你的态度，说明你们之间缺乏足够清晰的沟通。但如果他连续发了几条和感情有关的动态，那就值得注意了。单次不用过度解读。'
    },
    strategies: [
      { label: '低调互动', text: '不要点赞也不要评论。如果他问"你看到我分享的那首歌了吗"，说明他在意你有没有看。不主动问就是没特定指向。等三天看看。' },
      { label: '曲线索', text: '三天后不经意地问"你上次分享的那首Coldplay我也超爱，你知道他们下个月有巡演纪录片上映吗？"——用共同兴趣建立自然联系，而不是围绕他的动态本身。' },
      { label: '反向发圈', text: '你也分享一首歌，配文别写任何东西。看看他会不会来互动。如果他点赞/评论，说明他确实在关注你的动态。如果毫无反应，答案也很清楚了。' },
    ],
  },
]

function makeChatSVG_1() {
  // 聊天截图1：用户主动，对方冷淡 → 用户=右侧绿色，对方=左侧白色
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="400" viewBox="0 0 240 400">
    <rect fill="#EDEDED" width="240" height="400"/>
    <rect fill="#F7F7F7" width="240" height="36"/>
    <text x="120" y="24" text-anchor="middle" fill="#333" font-size="11" font-family="sans-serif">Jason</text>
    <rect x="8" y="44" width="84" height="20" rx="6" fill="white"/>
    <text x="14" y="58" fill="#333" font-size="9" font-family="sans-serif">忙</text>
    <rect x="76" y="72" width="156" height="28" rx="6" fill="#95EC69"/>
    <text x="84" y="90" fill="#333" font-size="9" font-family="sans-serif">今天忙不忙呀？我看了个好玩的</text>
    <rect x="8" y="108" width="60" height="20" rx="6" fill="white"/>
    <text x="14" y="122" fill="#333" font-size="9" font-family="sans-serif">再说吧</text>
    <rect x="60" y="136" width="172" height="28" rx="6" fill="#95EC69"/>
    <text x="68" y="154" fill="#333" font-size="9" font-family="sans-serif">辛苦了！下班要不要去喝杯东西🍺</text>
    <rect x="8" y="172" width="52" height="20" rx="6" fill="white"/>
    <text x="14" y="186" fill="#333" font-size="9" font-family="sans-serif">哈哈</text>
    <rect x="40" y="200" width="192" height="28" rx="6" fill="#95EC69"/>
    <text x="48" y="218" fill="#333" font-size="9" font-family="sans-serif">我们好久没见了诶，这周末空吗？</text>
    <rect x="120" y="248" width="60" height="20" rx="6" fill="white"/>
    <text x="126" y="262" fill="#888" font-size="8" font-family="sans-serif">周三 19:42</text>
    <rect x="8" y="278" width="84" height="20" rx="6" fill="white"/>
    <text x="14" y="292" fill="#333" font-size="9" font-family="sans-serif">嗯好的</text>
  </svg>`)}`
}

function makeChatSVG_2() {
  // 聊天截图2：对方忽冷忽热 → 对方=左侧白色，用户=右侧绿色
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="400" viewBox="0 0 240 400">
    <rect fill="#EDEDED" width="240" height="400"/>
    <rect fill="#F7F7F7" width="240" height="36"/>
    <text x="120" y="24" text-anchor="middle" fill="#333" font-size="11" font-family="sans-serif">李承宇</text>
    <rect x="120" y="46" width="60" height="18" rx="6" fill="white"/>
    <text x="126" y="58" fill="#888" font-size="8" font-family="sans-serif">凌晨 01:23</text>
    <rect x="8" y="72" width="84" height="28" rx="6" fill="white"/>
    <text x="14" y="88" fill="#333" font-size="9" font-family="sans-serif">在干嘛呢</text>
    <rect x="8" y="106" width="60" height="20" rx="6" fill="white"/>
    <text x="14" y="120" fill="#333" font-size="9" font-family="sans-serif">睡了没</text>
    <rect x="60" y="134" width="172" height="28" rx="6" fill="#95EC69"/>
    <text x="68" y="152" fill="#333" font-size="9" font-family="sans-serif">刚准备睡～怎么啦？</text>
    <rect x="120" y="172" width="60" height="18" rx="6" fill="white"/>
    <text x="126" y="184" fill="#888" font-size="8" font-family="sans-serif">上午 09:17</text>
    <rect x="124" y="200" width="108" height="28" rx="6" fill="#95EC69"/>
    <text x="132" y="218" fill="#333" font-size="9" font-family="sans-serif">早呀！昨晚找我什么事</text>
    <rect x="8" y="236" width="60" height="20" rx="6" fill="white"/>
    <text x="14" y="250" fill="#333" font-size="9" font-family="sans-serif">没啥事</text>
    <rect x="120" y="268" width="60" height="18" rx="6" fill="white"/>
    <text x="126" y="280" fill="#888" font-size="8" font-family="sans-serif">隔天 晚上 22:51</text>
    <rect x="8" y="296" width="112" height="42" rx="6" fill="white"/>
    <text x="14" y="312" fill="#333" font-size="9" font-family="sans-serif">🎵 分享了一首歌 </text>
    <text x="14" y="328" fill="#333" font-size="9" font-family="sans-serif">Fix You - Coldplay</text>
  </svg>`)}`
}

function makeSocialSVG_3() {
  // 朋友圈截图：分享Coldplay + 模糊配文
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="400" viewBox="0 0 240 400">
    <rect fill="#EDEDED" width="240" height="400"/>
    <rect fill="#F7F7F7" width="240" height="36"/>
    <text x="16" y="24" fill="#333" font-size="11" font-family="sans-serif" font-weight="bold">朋友圈</text>
    <rect x="8" y="44" width="224" height="170" rx="0" fill="white"/>
    <circle cx="24" cy="64" r="12" fill="#DDD"/>
    <text x="42" y="62" fill="#576B95" font-size="10" font-family="sans-serif">李承宇</text>
    <text x="42" y="78" fill="#999" font-size="8" font-family="sans-serif">1小时前</text>
    <text x="16" y="104" fill="#333" font-size="11" font-family="sans-serif">🌙</text>
    <rect x="16" y="112" width="100" height="60" rx="4" fill="#2C2C3A"/>
    <text x="26" y="132" fill="white" font-size="10" font-family="sans-serif" font-weight="bold">Fix You</text>
    <text x="26" y="148" fill="#AAA" font-size="8" font-family="sans-serif">Coldplay</text>
    <text x="130" y="120" fill="#d4a574" font-size="8" font-family="sans-serif">Lights will guide</text>
    <text x="130" y="132" fill="#d4a574" font-size="8" font-family="sans-serif">you home, and</text>
    <text x="130" y="144" fill="#d4a574" font-size="8" font-family="sans-serif">ignite your bones</text>
    <rect x="8" y="218" width="224" height="80" rx="0" fill="white"/>
    <text x="16" y="236" fill="#999" font-size="8" font-family="sans-serif">😉 共同好友·小王, 小赵 等 3人赞了</text>
    <text x="16" y="256" fill="#576B95" font-size="9" font-family="sans-serif">磊哥</text><text x="44" y="256" fill="#333" font-size="9" font-family="sans-serif">：有品位</text>
    <text x="16" y="274" fill="#576B95" font-size="9" font-family="sans-serif">Amy</text><text x="44" y="274" fill="#333" font-size="9" font-family="sans-serif">：这首是我的年度歌曲</text>
    <text x="16" y="292" fill="#576B95" font-size="9" font-family="sans-serif">李承宇</text><text x="56" y="292" fill="#333" font-size="9" font-family="sans-serif">回复</text><text x="76" y="292" fill="#576B95" font-size="9" font-family="sans-serif">磊哥</text><text x="108" y="292" fill="#333" font-size="9" font-family="sans-serif">：😉</text>
  </svg>`)}`
}

const MOCK_IMAGE_URLS = [
  makeChatSVG_1(),
  makeChatSVG_2(),
  makeSocialSVG_3(),
]

const BOT_REPLIES = [
  '嗯，你说的这个细节确实有意思。要不要把聊天截图发给我看看？我可以帮你逐条分析他的语言模式。',
  '我注意到你描述的这个行为模式——他主动的时候都在什么时间、什么情境下？这个规律很关键。',
  '这段对话里有几个信号值得注意。发截图给我，我可以帮你做更细致的分析。',
  '你说的情况我理解。但从他的角度想，如果他真的不在意，他根本不会回你。问题在于他投入的程度，而不是有没有投入。',
  '等下，先别急着给他找理由。我们来看事实：他做了什么，没做什么。把截图发给我。',
]

export default function ChatView() {
  const {
    messages, addMessage,
    todayAnalysisCount, setTodayAnalysisCount,
    softGuidanceShownToday, setSoftGuidanceShownToday,
    isAnalyzing, setIsAnalyzing, silentPeriod,
    selfProfile, crushProfile, addInsight,
  } = useApp()

  const [showUpload, setShowUpload] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isAnalyzing])

  const handleSend = useCallback(async (text) => {
    addMessage({ role: 'user', type: 'text', content: text })

    const isPleading = detectPleading(text)
    const newCount = isPleading ? todayAnalysisCount + 1 : todayAnalysisCount
    if (isPleading) setTodayAnalysisCount(newCount)

    const showGuidance = isPleading && newCount >= 3 && !softGuidanceShownToday

    if (showGuidance) {
      setIsAnalyzing(true)
      try {
        let analysisData
        if (hasApiKey()) {
          const currentMessages = messages.concat([{ role: 'user', content: text }])
          analysisData = await analyzeConversation(currentMessages, selfProfile, crushProfile)
        } else {
          await new Promise(r => setTimeout(r, 2000))
          analysisData = MOCK_ANALYSES[0]
        }
        setIsAnalyzing(false)
        addMessage({ role: 'bot', type: 'analysis-bundle', content: analysisData })
        setTimeout(() => {
          addMessage({ role: 'bot', type: 'soft-guidance', content: { keyword: '我是不是', count: newCount } })
          setSoftGuidanceShownToday(true)
        }, 500)
      } catch (e) {
        setIsAnalyzing(false)
        addMessage({ role: 'bot', type: 'text', content: `分析出错：${e.message}` })
      }
    } else {
      try {
        let reply
        if (hasApiKey()) {
          const currentMessages = messages.concat([{ role: 'user', content: text }])
          reply = await sendChatMessage(currentMessages, selfProfile, crushProfile)
        } else {
          await new Promise(r => setTimeout(r, 1000 + Math.random() * 1500))
          reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)]
        }
        addMessage({ role: 'bot', type: 'text', content: reply })
      } catch (e) {
        addMessage({ role: 'bot', type: 'text', content: `发送失败：${e.message}` })
      }
    }
  }, [addMessage, messages, todayAnalysisCount, setTodayAnalysisCount, softGuidanceShownToday, setSoftGuidanceShownToday, setIsAnalyzing, selfProfile, crushProfile])

  const handleUpload = useCallback(async (file, mockIdx) => {
    setShowUpload(false)

    try {
      let imageUrl
      if (file) {
        imageUrl = URL.createObjectURL(file)
      } else {
        imageUrl = MOCK_IMAGE_URLS[mockIdx || 0]
      }

      addMessage({ role: 'user', type: 'image', content: '帮我分析这张截图', imageUrl, ts: Date.now() })
      setIsAnalyzing(true)

      let analysisData
      let insightData
      if (file && hasApiKey()) {
        // Real upload with API key — skip OCR for now, show notice
        throw new Error('图片分析功能即将上线，目前请使用预设的三张模拟截图体验完整分析流程')
      } else {
        await new Promise(r => setTimeout(r, 2500))
        const idx = mockIdx || 0
        analysisData = MOCK_ANALYSES[idx]
        insightData = MOCK_INSIGHTS[idx]
      }
      setIsAnalyzing(false)
      addMessage({ role: 'bot', type: 'analysis-bundle', content: analysisData })
      if (insightData) addInsight(insightData)
    } catch (e) {
      setIsAnalyzing(false)
      addMessage({ role: 'bot', type: 'text', content: `图片分析失败：${e.message}` })
    }
  }, [addMessage, setIsAnalyzing, selfProfile, crushProfile, addInsight])

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-crush-card/40 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-crush-pink/15 flex items-center justify-center text-lg">🛡️</div>
          <div>
            <span className="text-crush-dark text-[14px] font-medium">Crush Pilot</span>
            <p className="text-crush-gray text-[10px]">小盾在线 · 聊天分析</p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-crush-gray text-base hover:bg-crush-card transition-colors">⚙</button>
      </div>

      <ShieldCard silentPeriod={silentPeriod} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-0.5 bg-[#FFF0F3]">
        <div className="flex justify-center py-2">
          <span className="text-[10px] text-crush-gray/40 bg-crush-bg/60 px-3 py-0.5 rounded-full">
            {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
          </span>
        </div>
        {messages.map(msg => {
          if (msg.role === 'bot' && msg.type === 'soft-guidance') return <SoftGuidance key={msg.id} data={msg.content} />
          if (msg.role === 'bot' && msg.type === 'analysis-bundle') return <AnalysisResult key={msg.id} data={msg.content} />
          return <MessageBubble key={msg.id} msg={msg} />
        })}
        {isAnalyzing && (
          <div className="flex flex-col items-center py-5 gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-crush-pink animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <p className="text-crush-gray text-[12px]">深呼吸,AI 正在理智提取客观事实...</p>
          </div>
        )}
      </div>

      {showUpload && <UploadSimulator onUpload={handleUpload} onClose={() => setShowUpload(false)} />}
      <InputArea onSend={handleSend} onUploadClick={() => setShowUpload(true)} />
    </div>
  )
}
