import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

const DAILY_LIMITS = { screenshots: 3, chats: 10 }

const INITIAL_BOT_MESSAGES = [
  { id: 'bot-0', role: 'bot', type: 'text', content: '今天你怎么样？发生了什么让你觉得自己挺酷的事？', ts: Date.now() - 60000 },
]

const CHECKIN_QUESTIONS = [
  '今天有让你觉得自己很专业的瞬间吗？',
  '今天你拒绝了什么让你不舒服的事？',
  '今天有没有哪一刻你为自己感到骄傲？',
  '今天有没有为自己做一件他完全不知道的小事？',
  '今天你最享受的独处时刻是什么？',
  '今天有什么小事让你笑了一下？',
]

const SHIELD_EXAMPLES = [
  '你今天已经打开这个聊天 4 次了。先停一下，你现在感受到的焦虑，不一定是事情本身的样子。',
  '你在他回复之前先做了自己的事，这本身就值得庆祝。今天继续。',
  '你今天还没给自己倒杯水。先照顾好自己的身体，再想他的消息。',
  '你今天完成了一件和他无关的事。那件让你专注的事，比他的回复更值得记住。',
]

export function AppProvider({ children }) {
  const [screen, setScreen] = useState('welcome')
  const [activeTab, setActiveTab] = useState('analyze')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  // Onboarding
  const [selfProfile, setSelfProfile] = useState({})
  const [crushProfile, setCrushProfile] = useState({})

  // Chat
  const [messages, setMessages] = useState(INITIAL_BOT_MESSAGES)
  const [usedQuota, setUsedQuota] = useState({ screenshots: 0, chats: 0 })
  const [todayAnalysisCount, setTodayAnalysisCount] = useState(0)
  const [softGuidanceShownToday, setSoftGuidanceShownToday] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Insights — accumulated personality findings from analyses
  const [personalityInsights, setPersonalityInsights] = useState({
    aboutHim: [],
    aboutYou: [],
    totalAnalyses: 0,
  })

  // Me
  const [silentPeriod, setSilentPeriod] = useState({ active: false, duration: null, endTime: null })

  // Today's shield
  const [shieldText] = useState(() => SHIELD_EXAMPLES[Math.floor(Math.random() * SHIELD_EXAMPLES.length)])

  const navigate = useCallback((s) => setScreen(s), [])

  const addMessage = useCallback((msg) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now() + Math.random(), ts: Date.now() }])
  }, [])

  const addMessages = useCallback((msgs) => {
    setMessages(prev => [...prev, ...msgs.map((m, i) => ({
      ...m, id: Date.now() + Math.random() + i, ts: Date.now() + i * 100
    }))])
  }, [])

  const useQuota = useCallback((type) => {
    setUsedQuota(prev => ({ ...prev, [type]: prev[type] + 1 }))
  }, [])

  const remainingQuota = useCallback((type) => {
    return DAILY_LIMITS[type] - usedQuota[type]
  }, [usedQuota])

  const resetQuotas = useCallback(() => {
    setUsedQuota({ screenshots: 0, chats: 0 })
    setTodayAnalysisCount(0)
    setSoftGuidanceShownToday(false)
  }, [])

  const addInsight = useCallback((insight) => {
    setPersonalityInsights(prev => ({
      ...prev,
      aboutHim: [...prev.aboutHim, ...(insight.aboutHim || [])],
      aboutYou: [...prev.aboutYou, ...(insight.aboutYou || [])],
      totalAnalyses: prev.totalAnalyses + 1,
    }))
  }, [])

  const value = {
    screen, setScreen, navigate,
    activeTab, setActiveTab,
    privacyAccepted, setPrivacyAccepted,

    selfProfile, setSelfProfile,
    crushProfile, setCrushProfile,

    messages, setMessages, addMessage, addMessages,
    usedQuota, useQuota, remainingQuota, resetQuotas,
    todayAnalysisCount, setTodayAnalysisCount,
    softGuidanceShownToday, setSoftGuidanceShownToday,
    isAnalyzing, setIsAnalyzing,

    personalityInsights, addInsight,

    silentPeriod, setSilentPeriod,
    shieldText,

    DAILY_LIMITS,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
