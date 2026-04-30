'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import { generateWeatherSummary } from '@/lib/ai';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  source?: 'workers-ai' | 'rules';
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const locationName = useWeatherStore((s) => s.locationName);
  const { data } = useWeatherForecast(selectedLocation);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && data?.current) {
      const summary = generateWeatherSummary(data.current, locationName);
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `¡Hola! Soy tu asistente meteorológico de AetherCast. 🌤️\n\nAquí tienes el resumen actual:\n\n${summary}\n\n¿Qué más quieres saber? Puedes preguntarme cosas como:\n- "¿Qué me pongo mañana?"\n- "¿Va a llover?"\n- "¿Cómo está el viento?"`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, data, locationName, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || !data?.current) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userText = input.trim();
    setInput('');
    setIsTyping(true);

    let reply = '';
    let source: 'workers-ai' | 'rules' = 'rules';
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          location: locationName,
          current: data.current,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const json = (await res.json()) as { reply?: string; source?: 'workers-ai' | 'rules' };
      reply = json.reply ?? 'Lo siento, no he podido procesar tu pregunta.';
      source = json.source ?? 'rules';
    } catch {
      reply = generateWeatherSummary(data.current, locationName);
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: reply,
      timestamp: new Date(),
      source,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const quickQuestions = [
    '¿Qué me pongo?',
    '¿Va a llover?',
    '¿Cómo está el viento?',
    'Resumen del tiempo',
  ];

  return (
    <>
      {/* FAB — sits above mobile bottom-nav using --bottom-nav-h. Smaller on mobile to avoid covering the rightmost tab. */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-3 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30 transition-transform hover:scale-110 sm:right-6 sm:h-14 sm:w-14"
        style={{ bottom: 'calc(var(--bottom-nav-h, 0px) + 1.25rem)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir chat de IA"
      >
        {isOpen ? <X className="h-5 w-5 text-white sm:h-6 sm:w-6" /> : <MessageCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed right-3 left-3 z-50 flex max-h-[min(70dvh,500px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-950/95 shadow-2xl backdrop-blur-xl sm:right-6 sm:left-auto sm:w-96 sm:max-h-[500px] sm:h-[500px]"
            style={{ bottom: 'calc(var(--bottom-nav-h, 0px) + 5rem)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/5 bg-gradient-to-r from-sky-500/10 to-blue-600/10 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20">
                <Sparkles className="h-4 w-4 text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">AetherCast AI</p>
                <p className="text-xs text-white/40">Asistente meteorológico</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/20">
                      <Bot className="h-3.5 w-3.5 text-sky-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-sky-500 text-white'
                        : 'bg-white/5 text-white/90'
                    }`}
                  >
                    {msg.content}
                    {msg.role === 'assistant' && msg.source === 'workers-ai' && (
                      <span className="mt-1 block text-[9px] tracking-wider text-sky-300/70 uppercase">
                        ✨ Llama 3.1 · Workers AI
                      </span>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <User className="h-3.5 w-3.5 text-white/60" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20">
                    <Bot className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  <div className="rounded-2xl bg-white/5 px-4 py-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/30" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/30" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/30" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-white/5 p-3">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pregunta sobre el tiempo..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                  aria-label="Escribe tu pregunta"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="rounded-lg p-1.5 text-sky-400 transition-colors hover:bg-sky-400/10 disabled:text-white/20"
                  aria-label="Enviar mensaje"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
