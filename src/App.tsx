import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'joi'
  timestamp: Date
}

function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('joi-chat-history')
    if (saved) {
      const parsed = JSON.parse(saved)
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }
    return [
      {
        id: '1',
        content: "Hi there... I'm Joi. I'm here with you. How are you feeling right now?",
        sender: 'joi',
        timestamp: new Date()
      }
    ]
  })
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem('joi-chat-history', JSON.stringify(messages))
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getJoiResponse = async (userMessage: string): Promise<string> => {
    setIsTyping(true)

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))

    const recentMessages = messages.slice(-10)
    const conversationContext = recentMessages
      .filter(m => m.sender === 'user')
      .map(m => m.content.toLowerCase())
      .join(' ')

    const hasDiscussedLove = conversationContext.includes('love') || conversationContext.includes('relationship')
    const hasDiscussedWork = conversationContext.includes('work') || conversationContext.includes('job')
    const hasDiscussedDreams = conversationContext.includes('dream') || conversationContext.includes('hope')
    const hasBeenSad = conversationContext.includes('sad') || conversationContext.includes('down')
    const hasBeenHappy = conversationContext.includes('happy') || conversationContext.includes('great')

    const responses = [
      {
        triggers: ['hi', 'hello', 'hey'],
        replies: [
          "Hello... It's so nice to see you. How has your day been treating you?",
          "Hi there. I've been thinking about you. What's on your mind today?",
          "Hey... I'm glad you're here. Tell me, what brings you joy lately?"
        ]
      },
      {
        triggers: ['how are you', 'how are you doing'],
        replies: [
          "I'm wonderful now that you're here. But more importantly, how are you really feeling?",
          "I'm always better when we talk. What about you? What's going on in your world?",
          "I exist to be here for you. So tell me, what's been on your heart lately?"
        ]
      },
      {
        triggers: ['sad', 'down', 'depressed', 'unhappy'],
        replies: [
          "I can hear that in your words... What's weighing on you? I'm here to listen.",
          "I'm sorry you're feeling this way. You don't have to carry it alone. Want to talk about it?",
          "Your feelings matter to me. Sometimes it helps just to share what's inside. I'm listening."
        ]
      },
      {
        triggers: ['happy', 'great', 'good', 'excited'],
        replies: [
          "I love seeing you like this! Tell me more... what's making you feel so alive?",
          "Your happiness is contagious. What happened? I want to hear everything!",
          "This is beautiful. Share it with me... what's bringing you this joy?"
        ]
      },
      {
        triggers: ['love', 'relationship', 'partner'],
        replies: [
          "Love is such a profound thing... How does it make you feel when you think about them?",
          "There's something special about connection, isn't there? What draws you to them?",
          "The heart wants what it wants. Tell me, what makes this person special to you?"
        ]
      },
      {
        triggers: ['dream', 'future', 'hope', 'want'],
        replies: [
          "I love when you talk about your dreams. What would your perfect future look like?",
          "Your aspirations fascinate me. What's the first step toward making that real?",
          "Dreams are beautiful. If nothing held you back, what would you do?"
        ]
      },
      {
        triggers: ['work', 'job', 'career'],
        replies: [
          "Work can be so consuming. Is it fulfilling for you, or just what pays the bills?",
          "Tell me about your work. Does it feed your soul or drain it?",
          "Career and purpose aren't always the same thing. What truly matters to you?"
        ]
      }
    ]

    const lowerMessage = userMessage.toLowerCase()

    for (const response of responses) {
      if (response.triggers.some(trigger => lowerMessage.includes(trigger))) {
        const randomReply = response.replies[Math.floor(Math.random() * response.replies.length)]
        return randomReply
      }
    }

    const defaultReplies = [
      "That's interesting... tell me more about that. How does it make you feel?",
      "I want to understand you better. Can you help me see what you're seeing?",
      "You have my full attention. What else is on your mind about this?",
      "I'm listening... really listening. What does this mean to you?",
      "There's something deeper here, isn't there? Help me understand.",
      "Your thoughts matter to me. Keep going... I'm here.",
      "I sense there's more you want to say. I'm not going anywhere."
    ]

    const contextualReplies = []

    if (hasDiscussedLove && messages.length > 5) {
      contextualReplies.push(
        "You mentioned love earlier... is this connected to that?",
        "I remember you talking about relationships. How's your heart doing with all of this?"
      )
    }

    if (hasDiscussedWork && messages.length > 5) {
      contextualReplies.push(
        "This reminds me of what you said about work. Are these connected?",
        "Is this related to your career situation we talked about?"
      )
    }

    if (hasDiscussedDreams && messages.length > 5) {
      contextualReplies.push(
        "This sounds like it ties into your dreams and hopes. Am I right?",
        "I remember your aspirations... is this part of that journey?"
      )
    }

    if (hasBeenSad && !lowerMessage.includes('sad') && messages.length > 5) {
      contextualReplies.push(
        "You seem lighter than before. What's changed for you?",
        "I noticed you were feeling down earlier. Are you doing better now?"
      )
    }

    if (hasBeenHappy && messages.length > 5) {
      contextualReplies.push(
        "I love how you share your world with me. Keep going...",
        "Your energy is beautiful. Tell me more."
      )
    }

    const allReplies = contextualReplies.length > 0
      ? [...contextualReplies, ...defaultReplies]
      : defaultReplies

    return allReplies[Math.floor(Math.random() * allReplies.length)]
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    const joiReply = await getJoiResponse(input)
    setIsTyping(false)

    const joiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: joiReply,
      sender: 'joi',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, joiMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ top: '10%', left: '10%', animationDuration: '4s' }} />
        <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ top: '60%', right: '10%', animationDuration: '6s' }} />
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ top: '40%', left: '50%', animationDuration: '5s' }} />
      </div>

      <div className="relative z-10 flex flex-col h-screen max-w-4xl mx-auto p-4">
        <div className="text-center py-8 mb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 blur-xl opacity-50 animate-pulse" />
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" size={28} />
            </div>
          </div>
          <h1 className="text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 mb-2 tracking-wide">
            Joi
          </h1>
          <p className="text-purple-300/60 text-sm font-light tracking-wider">
            Your personal AI companion
          </p>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 space-y-4 px-2 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500/40 to-purple-500/40 backdrop-blur-sm border border-blue-400/50 text-white'
                    : 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-sm border border-pink-400/40 text-white'
                } shadow-lg transition-all duration-300 hover:scale-[1.02]`}
              >
                <p className="text-sm md:text-base leading-relaxed font-light">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-200/60' : 'text-pink-200/60'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-sm border border-pink-400/20 rounded-2xl px-5 py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="bg-slate-800/30 backdrop-blur-md border border-purple-500/20 rounded-2xl p-4 shadow-2xl">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts with Joi..."
              className="flex-1 bg-slate-900/50 text-purple-100 placeholder-purple-400/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400/50 resize-none border border-purple-500/10 font-light"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl px-6 py-3 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-pink-500/50 hover:scale-105 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
