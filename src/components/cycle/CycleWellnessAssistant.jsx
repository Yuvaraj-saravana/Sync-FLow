import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bot,
  Sparkles,
  Send,
  ArrowRight,
  ShieldCheck,
  Info,
  RefreshCw,
  AlertCircle,
  User
} from 'lucide-react'
import { useCycle } from '../../context/useCycle'
import {
  processCycleWellnessQuery,
  SUGGESTED_QUESTIONS
} from '../../services/cycleWellnessAssistantService.js'

export default function CycleWellnessAssistant({ compact = false }) {
  const { profile, periods, checkIns } = useCycle()
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Hello! I am your Cycle & Wellness AI Assistant. I can help answer questions about your estimated phase, period history, cycle intervals, energy trends, and monthly summaries using your actual logs.',
      tags: ['Cycle & Wellness AI', 'Session Only'],
      suggestedPrompts: [
        'What is my currently estimated cycle phase?',
        'When did my last recorded period start?',
        'What is my average recorded cycle interval?',
        'Summarize my monthly wellness activity',
      ],
      links: [
        { text: 'Cycle Overview', path: '/employee/cycle' },
        { text: 'Daily Check-in', path: '/employee/cycle/check-in' },
        { text: 'Personal Insights', path: '/employee/cycle/insights' },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const [inputQuery, setInputQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const chatBottomRef = useRef(null)

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isProcessing])

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputQuery).trim()
    if (!query) return

    const userMessageId = `user-${Date.now()}`
    const userMessage = {
      id: userMessageId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputQuery('')
    setIsProcessing(true)

    // Simulate realistic sub-second cognitive processing
    setTimeout(() => {
      const responseObj = processCycleWellnessQuery(query, {
        profile,
        periods,
        checkIns,
        asOfDate: new Date(),
      })

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        title: responseObj.title,
        text: responseObj.response,
        additionalNotes: responseObj.additionalNotes,
        cards: responseObj.cards,
        links: responseObj.links,
        tags: responseObj.tags,
        isMedicalAdvisory: responseObj.isMedicalAdvisory,
        suggestedPrompts: responseObj.suggestedPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsProcessing(false)
    }, 350)
  }

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. How can I assist you with your cycle records or wellness check-in patterns today?',
        suggestedPrompts: SUGGESTED_QUESTIONS.slice(0, 4),
        links: [
          { text: 'Cycle Overview', path: '/employee/cycle' },
          { text: 'Cycle Calendar', path: '/employee/cycle/calendar' },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Cycle & Wellness AI Assistant
              </h3>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Rule-Based Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grounded in actual records · Employee-Controlled Privacy</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-xs flex items-center gap-1.5"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className={`p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/30 ${compact ? 'max-h-[380px]' : 'min-h-[420px] max-h-[580px]'}`}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-white'
                  : msg.isMedicalAdvisory
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-purple-100 text-purple-700 border border-purple-200'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-4 h-4" />
              ) : msg.isMedicalAdvisory ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            {/* Bubble Content */}
            <div className={`space-y-2 max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-purple-700 text-white rounded-tr-xs'
                    : msg.isMedicalAdvisory
                    ? 'bg-amber-50/90 border border-amber-200 text-amber-950 rounded-tl-xs'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs'
                }`}
              >
                {/* Title if present */}
                {msg.title && (
                  <div className="font-bold text-xs uppercase tracking-wider text-purple-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>{msg.title}</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Additional Notes / Medical caveats */}
                {msg.additionalNotes && (
                  <p className="mt-2 text-xs italic opacity-90 border-t border-slate-100 pt-2 text-slate-500">
                    {msg.additionalNotes}
                  </p>
                )}

                {/* Metric Cards */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-left">
                    {msg.cards.map((card, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100/70"
                      >
                        <span className="block text-[10px] font-semibold text-purple-800 uppercase tracking-wider">
                          {card.label}
                        </span>
                        <span className="block text-xs font-bold text-slate-900 mt-0.5 truncate">
                          {card.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Links */}
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2 text-left">
                    {msg.links.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.path}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 hover:underline bg-purple-50/80 border border-purple-200 px-2 py-1 rounded-lg transition-colors"
                      >
                        <span>{link.text}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp and Tags */}
              <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                <span>{msg.timestamp}</span>
                {msg.tags && msg.tags.map((t, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                    {t}
                  </span>
                ))}
              </div>

              {/* Suggested Follow-up Prompts */}
              {msg.suggestedPrompts && (
                <div className="pt-2 flex flex-wrap gap-1.5 text-left">
                  {msg.suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(p)}
                      className="text-[11px] font-medium text-slate-600 hover:text-purple-700 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 px-2.5 py-1 rounded-lg transition-all shadow-2xs text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs flex items-center gap-2 shadow-2xs">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
              <span>Analyzing your cycle records and wellness patterns...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div className="p-2 sm:p-3 bg-white border-t border-slate-100 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
            Suggested:
          </span>
          {SUGGESTED_QUESTIONS.slice(0, 5).map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200/80 hover:border-purple-200 text-[11px] font-medium transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
        className="p-3 sm:p-4 bg-white border-t border-slate-200/80 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about your estimated phase, period dates, cycle interval, energy..."
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
            disabled={isProcessing}
          />
        </div>

        <button
          type="submit"
          disabled={!inputQuery.trim() || isProcessing}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-slate-200 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Non-Diagnostic Safety Footer */}
      <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Non-diagnostic informational AI. Does not provide clinical evaluation or confirmed ovulation.</span>
        </span>
        <span className="hidden sm:inline">Session In-Memory Storage</span>
      </div>
    </div>
  )
}
