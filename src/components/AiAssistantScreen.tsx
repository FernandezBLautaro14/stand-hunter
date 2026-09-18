import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendAssistantMessage } from '../services/api';

interface AiAssistantScreenProps {
  score: number;
  onUpdateScore: (newScore: number) => void;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: '¡Hola, Agente! Detecto que estás frente al tótem de energía. ¿Necesitas una pista sobre la polaridad de los cables luminosos?',
    timestamp: '14:02:18',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Sí, ¿cuál es el código de colores correcto?',
    timestamp: '14:02:45',
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: 'El patrón sigue la secuencia Magenta - Cian - Violeta.',
    timestamp: '14:02:50',
    isPenalty: true,
    penaltyAmount: 50,
  },
];

export const AiAssistantScreen: React.FC<AiAssistantScreenProps> = ({
  score,
  onUpdateScore,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showPenaltyNotice, setShowPenaltyNotice] = useState(true);
  const [totemTimer, setTotemTimer] = useState(164); // 02:44

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Totem countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTotemTimer((prev) => (prev > 0 ? prev - 1 : 180));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      // Call Axios API
      const result = await sendAssistantMessage(text, score);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: result.reply,
        timestamp: result.timestamp,
        isPenalty: result.isPenalty,
        penaltyAmount: result.penaltyAmount,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (result.isPenalty) {
        setShowPenaltyNotice(true);
        onUpdateScore(result.newScore);
      }
    } catch {
      // Offline fallback
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Nodos de stand sincronizados localmente. Para el tótem B4, polariza los diodos en secuencia horaria.',
        timestamp: new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    // Simulate voice audio capture
    setTimeout(() => {
      setIsListening(false);
      handleSendMessage('¿Cuál es la frecuencia del módulo central?');
    }, 2800);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pt-2 pb-24 relative select-none">
      {/* Context Card Behind HUD Sheet */}
      <div className="w-full rounded-2xl bg-[#1c192f] border border-[#00eefc]/20 p-4 shadow-xl relative overflow-hidden mb-3">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#00eefc]/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00eefc] text-[18px]">radar</span>
            <span className="font-label-code text-[11px] text-[#00eefc] tracking-widest uppercase font-semibold">
              ZONA CONVENCIÓN • NODO B-04
            </span>
          </div>
          <span className="font-label-code text-[10px] text-[#ffb1c4] font-bold tracking-wider px-2 py-0.5 rounded bg-[#3e001a] border border-[#ff027f]/30">
            STAND #142
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#0e0b21] border border-[#00eefc]/30 relative">
            <img
              className="w-full h-full object-cover"
              alt="Tótem de Reactancia"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYkK9oVl1zrL8he7DP5Lz5TRhmsjnU9voiTEnzKEWihV-BDNjRB_Bue9_mq4lc8Lw5WwCZh2TGV7SVwPzoSM2QQNaZ-CrtMxXht68k0zw1jabZnoXAH0S2thF1U2xPpa2NJxps3IxplMKL_zdRuEHfYrMk4ktqXzr02c1YS6VhM1iLGPU7X56FS5EJxfCQcWnUGih0qdXLjhkITHyIKO1qCQF7XGOIXGSkwXtxaYjiPK_HqSJCkADH"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b21]/80 to-transparent" />
            <span className="absolute bottom-1 right-1 text-[#00eefc] material-symbols-outlined text-[16px]">
              bolt
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="font-headline-sm text-[16px] text-[#e5defe] font-bold truncate leading-tight">
              Tótem de Reactancia
            </h2>
            <p className="font-body-sm text-[12px] text-[#c9c5d0] truncate">
              Reto de cableado cuántico activo
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-[#ffb1c4] font-label-code text-[11px] font-bold">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                <span>{formatTimer(totemTimer)}</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-1 text-[#00eefc] font-label-code text-[11px] font-bold">
                <span className="material-symbols-outlined text-[14px]">stars</span>
                <span>{score.toLocaleString()} PTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slidable Tactical AI Assistant Container */}
      <div className="w-full rounded-2xl bg-[#0e0b21] border border-[#00eefc]/25 shadow-[0_-12px_40px_rgba(0,0,0,0.65)] flex flex-col relative overflow-hidden">
        {/* Top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#00eefc]/60 to-transparent" />

        {/* Sheet Header */}
        <div className="w-full pt-3 pb-2 px-4 flex flex-col items-center">
          <div className="w-12 h-1 rounded-full bg-white/20 mb-2" />

          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#1a1442] border border-[#00eefc]/40 text-[#00eefc] flex-shrink-0 shadow-[0_0_12px_rgba(0,238,252,0.25)]">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-pulse" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-headline-sm text-[15px] text-[#e5defe] font-bold truncate">
                    Asistente Táctico IA
                  </h1>
                  <span className="font-label-code text-[9px] text-[#00eefc] font-bold uppercase px-1.5 py-0.5 bg-[#201d33] border border-[#00eefc]/30 rounded">
                    v2.4
                  </span>
                </div>
                <span className="font-label-code text-[10px] text-[#c9c5d0] flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                  Sincronizado con Tótem #142 • StandHunter
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowPenaltyNotice(!showPenaltyNotice)}
              className="w-8 h-8 rounded-full bg-[#201d33] border border-white/10 flex items-center justify-center text-[#c9c5d0] hover:text-[#00eefc] transition-colors cursor-pointer"
              title="Alternar panel informativo"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPenaltyNotice ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Penalty Banner */}
        {showPenaltyNotice && (
          <div className="px-4 py-1.5">
            <div className="w-full rounded-xl bg-[#3e001a]/95 border border-[#ff027f]/50 px-3 py-2 flex items-center justify-between shadow-[0_0_20px_rgba(255,2,127,0.35)] animate-pulse">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#ff027f] flex items-center justify-center text-white flex-shrink-0 shadow-[0_0_8px_#ff027f]">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-[11px] text-[#ffb1c4] font-bold tracking-wide uppercase">
                    PENALIZACIÓN APLICADA
                  </span>
                  <span className="font-body-sm text-[11px] text-[#ffdad6] truncate font-medium">
                    -50 Puntos al marcador global
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0 pl-2">
                <span className="font-headline-sm text-[16px] text-[#ffb1c4] font-extrabold tracking-tight">
                  -50
                </span>
                <span className="font-label-code text-[10px] text-[#ffb1c4]/70 font-semibold">PTS</span>
              </div>
            </div>
          </div>
        )}

        {/* Conversational Stream */}
        <div className="flex flex-col gap-3 px-4 py-3 max-h-[340px] overflow-y-auto no-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2 max-w-[90%] ${
                  isUser ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isUser
                      ? 'bg-[#00eefc] text-[#002022] shadow-[0_0_10px_rgba(0,238,252,0.4)]'
                      : 'bg-[#1a1442] border border-[#00eefc]/30 text-[#00eefc]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isUser ? 'person' : 'neurology'}
                  </span>
                </div>

                <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3 rounded-2xl text-[13px] leading-relaxed shadow-md relative ${
                      isUser
                        ? 'bg-[#00eefc] text-[#002022] font-semibold rounded-tr-xs shadow-[0_0_16px_rgba(0,238,252,0.25)]'
                        : 'bg-[#1c192f] text-[#e5defe] rounded-tl-xs border border-white/5'
                    }`}
                  >
                    {msg.isPenalty && (
                      <div className="mb-1.5 inline-block px-2 py-0.5 rounded bg-[#3e001a] border border-[#ff027f]/40 text-[#ffb1c4] font-label-code text-[10px] tracking-wider font-bold">
                        PISTA DESBLOQUEADA
                      </div>
                    )}
                    <p>{msg.text}</p>
                    {msg.isPenalty && (
                      <div className="mt-2 p-1.5 rounded bg-[#3e001a]/60 border border-[#ff027f]/30 flex items-center gap-1.5 text-[#ffb1c4] text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">report_problem</span>
                        <span>Nota: Esta pista descontó -50 pts de tu marcador.</span>
                      </div>
                    )}
                  </div>

                  <span className="font-label-code text-[10px] text-[#c9c5d0]/70 flex items-center gap-1 px-1">
                    {!isUser && <span className="material-symbols-outlined text-[12px] text-[#00eefc]">verified</span>}
                    {isUser ? `TÚ • ${msg.timestamp}` : `STANDHUNTER IA • ${msg.timestamp}`}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Voice Wave Visualizer */}
          {isListening && (
            <div className="w-full flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c192f] border border-[#ff027f]/40 animate-pulse shadow-inner">
              <div className="flex items-center gap-1.5 text-[#00eefc] mb-1.5 font-label-code text-[10px] tracking-widest uppercase font-bold">
                <span className="w-2 h-2 rounded-full bg-[#ff027f] animate-ping" />
                Escuchando comando de voz por IA...
              </div>
              <div className="flex items-center justify-center gap-1 h-7">
                {[12, 24, 32, 20, 28, 16, 8].map((h, idx) => (
                  <div
                    key={idx}
                    className="w-1 bg-[#00eefc] rounded-full animate-bounce"
                    style={{
                      height: `${h}px`,
                      animationDuration: `${0.4 + idx * 0.1}s`,
                      backgroundColor: idx % 2 === 0 ? '#00eefc' : '#ff027f',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Context Prompt Chips */}
        <div className="w-full px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-white/5 bg-[#0e0b21]">
          <button
            onClick={() => handleSendMessage('¿Una pista sobre el código de colores del tótem?')}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1c192f] border border-white/10 hover:border-[#ff027f]/40 active:scale-95 transition-all text-[#e5defe] text-[11px] font-label-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#00eefc] text-[15px]">lightbulb</span>
            <span>¿Una pista sobre el cuadro?</span>
            <span className="font-label-code text-[10px] text-[#ffb1c4] font-bold ml-1">-50P</span>
          </button>

          <button
            onClick={() => handleSendMessage('¿Cuánto tiempo queda antes del bloqueo térmico?')}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1c192f] border border-white/10 hover:border-[#00eefc]/40 active:scale-95 transition-all text-[#e5defe] text-[11px] font-label-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#00eefc] text-[15px]">schedule</span>
            <span>Ver tiempo restante</span>
          </button>

          <button
            onClick={() => handleSendMessage('¿Dónde está el siguiente tótem físico?')}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1c192f] border border-white/10 hover:border-[#00eefc]/40 active:scale-95 transition-all text-[#e5defe] text-[11px] font-label-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#00eefc] text-[15px]">near_me</span>
            <span>Localizar siguiente tótem</span>
          </button>
        </div>

        {/* Input & Voice Toolbar */}
        <div className="w-full px-4 pt-2 pb-3 bg-[#0e0b21] flex items-center gap-2 border-t border-white/5">
          <div className="flex-1 h-12 rounded-xl bg-[#1c192f] border border-white/10 px-3 flex items-center gap-2 focus-within:border-[#00eefc] transition-all">
            <span className="material-symbols-outlined text-[#c9c5d0] text-[18px]">terminal</span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe una consulta a la IA..."
              className="w-full h-full bg-transparent text-[#e5defe] placeholder-[#c9c5d0]/50 text-[13px] focus:outline-none"
            />
          </div>

          <button
            onClick={handleVoiceToggle}
            aria-label="Dictar por voz"
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-white active:scale-95 transition-transform flex-shrink-0 cursor-pointer ${
              isListening
                ? 'bg-[#ff027f] shadow-[0_0_24px_rgba(255,2,127,0.8)] ring-2 ring-[#00eefc]'
                : 'bg-[#ff027f] shadow-[0_0_18px_rgba(255,2,127,0.45)]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">mic</span>
            <span className="absolute inset-0 rounded-xl bg-[#00eefc]/20 animate-ping pointer-events-none" />
          </button>

          <button
            onClick={() => handleSendMessage()}
            disabled={isSending || !inputText.trim()}
            aria-label="Enviar mensaje"
            className="w-12 h-12 rounded-xl bg-[#00eefc] text-[#002022] flex items-center justify-center shadow-[0_0_20px_rgba(0,238,252,0.45)] hover:shadow-[0_0_28px_rgba(0,238,252,0.65)] active:scale-95 transition-all flex-shrink-0 cursor-pointer disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[20px] font-bold">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
