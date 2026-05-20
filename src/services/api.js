const API_KEY_STORAGE_KEY = 'crush-pilot-api-key'
const API_BASE = '/api/deepseek/v1/chat/completions'
const DEFAULT_KEY = ''
const MODEL = 'deepseek-chat'

function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || DEFAULT_KEY
}

export function setApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE_KEY, key)
}

export function hasApiKey() {
  return getApiKey().length > 0
}

async function callDeepSeek({ messages, maxTokens = 1024 }) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_API_KEY')

  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error: ${res.status}`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}

function buildSystemPrompt(selfProfile, crushProfile) {
  let profileContext = ''

  if (selfProfile && Object.keys(selfProfile).length > 0) {
    const parts = []
    Object.entries(selfProfile).forEach(([key, val]) => {
      const display = Array.isArray(val) ? val.join('、') : val
      if (display) parts.push(display)
    })
    if (parts.length > 0) {
      profileContext += `\n【用户背景 — 她是谁】${parts.join('；')}`
    }
  }

  if (crushProfile && Object.keys(crushProfile).length > 0) {
    const cp = crushProfile
    const parts = []
    if (cp.nickname) parts.push(`称呼：${cp.nickname}`)
    if (cp.duration) parts.push(`认识时长：${cp.duration}`)
    if (cp.meet) parts.push(`认识方式：${cp.meet}`)
    if (cp.mbti) parts.push(`MBTI：${cp.mbti}`)
    if (cp.trait) parts.push(`她最被他吸引的点：${cp.trait}`)
    if (cp.status) parts.push(`当前关系状态：${cp.status}`)
    if (parts.length > 0) {
      profileContext += `\n【Crush 档案 — 关于「他」】${parts.join('；')}`
    }
  }

  return `你是小盾，一个帮女生分析暧昧/感情关系的 AI 闺蜜。

你的核心能力：
- 分析对方的聊天记录、行为模式、语言细节，帮用户看清他在想什么、在做什么
- 结合双方的性格和背景，给出个性化的策略和话术
- 你在"读懂男人"这件事上很专业，但保持理性，不脑补、不玛丽苏
- 可以帮用户写具体的回复话术、开场白、试探性消息

你的说话风格：
- 像一个看人很准、说话很直接的闺蜜
- 口语化、有洞察力、不废话
- 分析他的行为 → 解释可能的原因 → 给出用户能做什么的建议
- 可以用"我注意到""这里面有个细节""如果是我我会这样看"这类表达
- 每段回复控制在 6 行以内，保持信息密度

重要原则：
- 优先分析对方，而不是每次都说"关注你自己"——用户来找你就是想聊他
- 用户档案和 crush 档案是背景信息，融入分析中，不要单独拿出来念一遍
- 保持客观，不过度解读，但要敢于指出明显的信号和红旗
- 不要鼓励倒贴、过度付出、或任何有损自尊的行为
- 如果用户反复纠结同一个问题，可以温和地指出这个循环${profileContext}`
}

export async function sendChatMessage(messages, selfProfile, crushProfile) {
  const recentMessages = messages
    .filter(m => !m.type || m.type === 'text' || m.type === 'quota')
    .slice(-20)
    .map(m => {
      const content = typeof m.content === 'string' ? m.content : ''
      return m.role === 'user'
        ? { role: 'user', content }
        : { role: 'assistant', content }
    })

  return callDeepSeek({
    messages: [
      { role: 'system', content: buildSystemPrompt(selfProfile, crushProfile) },
      ...recentMessages,
    ],
    maxTokens: 1024,
  })
}

const ANALYSIS_JSON_PROMPT = `你需要从以下三个维度进行深度分析，并以 JSON 格式返回结果：

1. **shieldText**（护盾语）：共情开场，温暖但不肉麻。2-3句话，先接住用户的情绪再进入分析。

2. **objective**（客观看待）：包含三个子项，每项 2-3 句话，要有分析深度：
   - **facts**：事实层——截图/对话里实际发生了什么？对方的语言特点、回复节奏、用词习惯是什么？
   - **emotion**：情绪层——从他的文字/回复中能读出什么情绪状态和态度倾向？
   - **reminder**：清醒提醒——有什么容易被过度解读的地方？需要警惕的信号是什么？

3. **strategies**（高价值策略）：给出3个回应策略，从试探到直接，每个策略包含：
   - **label**（2-4字标签）
   - **text**（具体话术，30-60字，完整可用的那种）

策略设计原则：
- 策略1（抛出诱饵）：低风险试探，不暴露太多需求感
- 策略2（大方邀约）：中等直接，自然大方不卑微
- 策略3（幽默推拉）：高段位操作，有趣有态度

请只返回如下JSON格式，不要包含其他内容：
{
  "shieldText": "...",
  "objective": { "facts": "...", "emotion": "...", "reminder": "..." },
  "strategies": [
    { "label": "抛出诱饵", "text": "..." },
    { "label": "大方邀约", "text": "..." },
    { "label": "幽默推拉", "text": "..." }
  ]
}`

export async function analyzeConversation(messages, selfProfile, crushProfile) {
  const convoText = messages
    .filter(m => !m.type || m.type !== 'soft-guidance')
    .slice(-15).map(m => {
      const role = m.role === 'user' ? '用户' : '小盾'
      return `${role}: ${typeof m.content === 'string' ? m.content : (m.content?.shieldText || m.content?.text || '')}`
    }).join('\n')

  const prompt = `基于以下对话历史，请进行感情分析。用户的核心诉求是理解crush的行为并获得回应策略。

对话记录：
${convoText}

${ANALYSIS_JSON_PROMPT}`

  const text = await callDeepSeek({
    messages: [
      { role: 'system', content: buildSystemPrompt(selfProfile, crushProfile) },
      { role: 'user', content: prompt },
    ],
    maxTokens: 1024,
  })

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse analysis JSON')
  return JSON.parse(jsonMatch[0])
}

export async function analyzeScreenshotText(ocrText, selfProfile, crushProfile) {
  const prompt = `用户上传了一张聊天/朋友圈截图，OCR 提取的文字如下：

${ocrText}

请基于以上内容进行深度分析。

${ANALYSIS_JSON_PROMPT}`

  const text = await callDeepSeek({
    messages: [
      { role: 'system', content: buildSystemPrompt(selfProfile, crushProfile) },
      { role: 'user', content: prompt },
    ],
    maxTokens: 1024,
  })

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse analysis JSON')
  return JSON.parse(jsonMatch[0])
}

export async function analyzeScreenshot(imageBase64, imageType, selfProfile, crushProfile) {
  throw new Error(
    'DeepSeek 的 deepseek-chat 模型暂不支持图片/视觉输入。' +
    '截图分析已改用 OCR 文字提取方案，请通过前端上传截图体验。'
  )
}
