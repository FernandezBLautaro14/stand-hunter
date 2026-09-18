import React, { useEffect, useRef, useState } from 'react';
import { ClueEvidence } from '../types';
import { identifyObject } from '../services/api';

interface ArScannerScreenProps {
  onOpenAiAssistant: () => void;
  onClueClaimed: (points: number) => void;
  accumulatedPoints: number;
}

export const ArScannerScreen: React.FC<ArScannerScreenProps> = ({
  onOpenAiAssistant,
  onClueClaimed,
  accumulatedPoints,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(7 * 60 + 40);
  const [speaking, setSpeaking] = useState(false);
  const [identifiedEvidence, setIdentifiedEvidence] = useState<ClueEvidence | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [reticleTapPulse, setReticleTapPulse] = useState(false);
  const [useRealVideo, setUseRealVideo] = useState(false);
  const [cluesDiscovered, setCluesDiscovered] = useState(2);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [claimingEvidence, setClaimingEvidence] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // WebRTC Camera Attempt
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setUseRealVideo(true);
          }
        }
      } catch {
        // Fallback to simulated high-res video backdrop
        setUseRealVideo(false);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const speakObjective = () => {
    const text = 'Escanea el panel lateral derecho del servidor holográfico';
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const triggerScan = async () => {
    setReticleTapPulse(true);
    setIsScanning(true);
    setTimeout(() => setReticleTapPulse(false), 400);

    try {
      // Call Axios API to identify target
      const result = await identifyObject('stand-b4-totem');
      setIdentifiedEvidence(result);
      setShowEvidenceModal(true);
    } catch {
      // Local fallback in case of simulated server failure
      setIdentifiedEvidence({
        id: 'evidence-x89',
        confidence: '98.4%',
        title: '¡Objeto Identificado por IA!',
        subTitle: 'SUB-NÚCLEO NEURONAL DESBLOQUEADO',
        fileName: 'X-89_SCHEMATIC.DAT',
        status: 'DESCIFRADO',
        hexCode: '0x7F...9A4E',
        sequence: '1101-HEX',
        chipTag: 'CHIP X-89',
        description:
          'La IA ha descifrado los planos ocultos en la base del tótem físico. Contiene la secuencia de activación requerida para el terminal 3.',
        locationTag: 'STAND B4 • TÓTEM PRIMARIO • SECTOR ALPHA',
        rewardPoints: 350,
        accumulatedPoints: accumulatedPoints + 350,
        cluesDiscovered: cluesDiscovered + 1,
        totalClues: 5,
      });
      setShowEvidenceModal(true);
    } finally {
      setIsScanning(false);
    }
  };

  const handleClaimEvidence = () => {
    setClaimingEvidence(true);
    setTimeout(() => {
      setCluesDiscovered((prev) => Math.min(5, prev + 1));
      onClueClaimed(350);
      setShowEvidenceModal(false);
      setClaimingEvidence(false);
    }, 700);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto relative select-none overflow-hidden pb-24">
      {/* AR Viewport Frame Container */}
      <div className="relative w-full aspect-[9/17] max-h-[740px] overflow-hidden rounded-2xl bg-[#0e0b21] border border-[#00eefc]/25 shadow-2xl flex flex-col justify-between p-3.5">
        {/* Live Camera Stream or Simulated Visual Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {useRealVideo ? (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover brightness-[0.75] contrast-[1.1]"
            />
          ) : (
            <img
              id="camera-stream"
              alt="First-person POV augmented reality live camera view"
              className="w-full h-full object-cover brightness-[0.7] contrast-[1.1] scale-105 filter transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4_vnBUD6jRWE5NgtlQiSn7qH2UgEjftkPNk-oTw4ihDJ2jjiNJreA-BwuB_lmVBbSoEbE8BbWtTUD3UJ38fvxC-SQrk3M5ocFKb643yoB8xWQuIh0df_5cecFNLKJsGZrmhIvy0m81siBUODwanTerdQxbwQWcvtslNQXbgeCVCpmLUg4lEWwyLFxWTB_Kius940r2WriQuAXDNVXq2r8pKv8gnJAyKjb4pbMnXzjrnjgGVkHAJQN"
            />
          )}

          {/* Spatial 3D Mapping Wireframe Overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="36" id="ar-grid-dots" patternUnits="userSpaceOnUse" width="36">
                <circle cx="18" cy="18" r="1.2" fill="#00eefc" opacity="0.6" />
                <path d="M 18 0 L 18 4 M 0 18 L 4 18 M 18 32 L 18 36 M 32 18 L 36 18" stroke="rgba(0, 238, 252, 0.25)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect fill="url(#ar-grid-dots)" height="100%" width="100%" />
          </svg>

          {/* Laser Surface Detection Sweep */}
          <div className="absolute inset-x-0 h-44 top-1/3 bg-gradient-to-b from-transparent via-[#00eefc]/15 to-transparent pointer-events-none transform -skew-y-3 blur-xs animate-pulse" />

          {/* Spatial Node Trackers */}
          <div className="absolute top-[38%] left-[22%] flex items-center gap-1.5 pointer-events-none animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00eefc] shadow-[0_0_12px_#00eefc]" />
            <span className="font-label-code text-[10px] text-[#00eefc] bg-[#0e0b21]/80 px-2 py-0.5 rounded backdrop-blur-sm border border-[#00eefc]/30">
              NODE #04 // REF_LOCK
            </span>
          </div>

          <div className="absolute top-[48%] right-[16%] flex items-center gap-1.5 pointer-events-none opacity-85">
            <div className="w-2 h-2 rounded-full bg-[#ff027f] shadow-[0_0_8px_#ff027f]" />
            <span className="font-label-code text-[10px] text-[#ffb1c4] bg-[#0e0b21]/80 px-2 py-0.5 rounded backdrop-blur-sm border border-[#ff027f]/30">
              SERVER_RACK: 88%
            </span>
          </div>
        </div>

        {/* HUD Layer 01: Top Tactical Floating Card */}
        <div className="relative z-20 w-full">
          <div className="w-full min-h-[64px] rounded-xl bg-[#0e0b21]/85 border border-[#00eefc]/30 backdrop-blur-xl p-3 shadow-[0_0_24px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2">
            {/* Objective Section */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-lg bg-[#2a273e] border border-[#00eefc]/40 flex items-center justify-center flex-shrink-0 text-[#00eefc] shadow-[0_0_10px_rgba(0,238,252,0.3)]">
                <span className="material-symbols-outlined text-[20px]">radar</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-code text-[10px] text-[#7df4ff] tracking-wider uppercase font-bold">
                  MISIÓN EN CURSO
                </span>
                <p className="font-body-md text-[13px] text-[#e5defe] truncate leading-tight font-medium">
                  Escanea el panel lateral derecho del servidor holográfico
                </p>
              </div>
            </div>

            {/* Timer & Audio TTS */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={speakObjective}
                aria-label="Escuchar objetivo por voz"
                className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                  speaking
                    ? 'bg-[#00eefc] text-[#002022] shadow-[0_0_12px_#00eefc]'
                    : 'bg-[#2a273e]/80 text-[#00eefc] border border-white/10 hover:bg-[#3a364e]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {speaking ? 'record_voice_over' : 'volume_up'}
                </span>
              </button>

              <div className="h-8 px-2.5 rounded-lg bg-[#3e001a]/70 border border-[#ff027f]/40 flex items-center gap-1.5 shadow-[0_0_16px_rgba(255,2,127,0.35)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff027f] animate-ping" />
                <span className="font-label-code text-[11px] font-bold tracking-widest text-[#ffb1c4]">
                  {formatTimer(secondsLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Diagnostic Banner Sub-HUD */}
          <div className="flex items-center justify-between px-1 mt-1.5">
            <div className="flex items-center gap-2">
              <span className="font-label-code text-[10px] text-[#00eefc] tracking-widest font-semibold">
                FOV: 84.6°
              </span>
              <span className="text-white/20 font-label-code text-[10px]">|</span>
              <span className="font-label-code text-[10px] text-[#c9c5d0] tracking-wider">
                DEPTH: CALIBRADO
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00eefc]" />
              <span className="font-label-code text-[10px] text-[#00eefc] tracking-widest uppercase font-semibold">
                LiDAR ACTIVO
              </span>
            </div>
          </div>
        </div>

        {/* HUD Layer 02: Central High-Precision Focus Reticle */}
        <div
          onClick={triggerScan}
          className="relative z-10 w-full flex-1 flex flex-col items-center justify-center cursor-pointer py-4 group"
          title="Toca para escanear el objeto físico con IA"
        >
          <div
            className={`relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center transition-transform duration-300 ${
              reticleTapPulse ? 'scale-105' : 'hover:scale-[1.02]'
            }`}
          >
            {/* Outer Rotating Sci-Fi Ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#00eefc]/35 animate-[spin_16s_linear_infinite]" />

            {/* Pulse Echo Horizon */}
            <div className="absolute inset-4 rounded-full border border-[#00eefc]/20 animate-ping opacity-25" />

            {/* Reticle Central Ring */}
            <div className="absolute w-44 h-44 rounded-full bg-[#0e0b21]/30 backdrop-blur-[2px] border border-[#00eefc]/30 shadow-[inset_0_0_24px_rgba(0,238,252,0.25)] flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border border-dotted border-[#00eefc]/40 flex items-center justify-center animate-[spin_10s_linear_infinite_reverse]">
                {/* Crosshair Lines */}
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#00eefc]/80 to-transparent" />
                <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#00eefc]/80 to-transparent" />
              </div>
            </div>

            {/* Corner HUD Brackets with Dynamic Cyan Glow */}
            <div className="absolute top-0 left-0 w-8 h-8 flex flex-col justify-between">
              <div className="w-full h-1 bg-[#00eefc] shadow-[0_0_12px_#00eefc]" />
              <div className="w-1 h-full bg-[#00eefc] shadow-[0_0_12px_#00eefc]" />
            </div>

            <div className="absolute top-0 right-0 w-8 h-8 flex flex-col items-end justify-between">
              <div className="w-full h-1 bg-[#00eefc] shadow-[0_0_12px_#00eefc]" />
              <div className="w-1 h-full bg-[#00eefc] shadow-[0_0_12px_#00eefc]" />
            </div>

            <div className="absolute bottom-0 left-0 w-8 h-8 flex flex-col justify-between">
              <div className="w-1 h-full bg-[#00eefc] shadow-[0_0_12px_#00eefc]" />
              <div className="w-full h-1 bg-[#00eefc] shadow-[0_0_12px_#00eefc]" />
            </div>

            <div className="absolute bottom-0 right-0 w-8 h-8 flex flex-col items-end justify-between">
              <div className="w-1 h-full bg-[#00eefc] shadow-[0_0_12px_#00eefc]" />
              <div className="w-full h-1 bg-[#00eefc] shadow-[0_0_12px_#00eefc]" />
            </div>

            {/* Dynamic Laser Sweep */}
            <div className="absolute inset-x-3 h-1 bg-gradient-to-r from-transparent via-[#00eefc] to-transparent shadow-[0_0_16px_#00eefc] animate-[bounce_3s_ease-in-out_infinite]" />

            {/* Target Identification Pill */}
            <div className="absolute -bottom-8 flex items-center gap-1.5 bg-[#0e0b21]/90 border border-[#00eefc]/40 px-3 py-1 rounded shadow-lg backdrop-blur-md">
              <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-[#ff027f] animate-ping' : 'bg-[#00eefc] animate-pulse'}`} />
              <span className="font-label-code text-[10px] text-[#00eefc] font-bold tracking-widest uppercase">
                {isScanning ? '[ IA: PROCESANDO MARCADOR... ]' : '[ TOCA AQUÍ PARA ESCANEAR OBJETO ]'}
              </span>
            </div>
          </div>
        </div>

        {/* HUD Layer 03: Distance Sensor & Mystery Progress */}
        <div className="relative z-20 w-full flex flex-col gap-2.5">
          {/* Distance Calibration Sensor Prompt */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0e0b21]/85 border border-[#00eefc]/20 backdrop-blur-md shadow-md">
              <span className="material-symbols-outlined text-[#00eefc] text-[16px]">sensors</span>
              <span className="font-label-md text-[12px] text-[#c9c5d0] font-medium">
                Apunta a <strong className="text-[#00eefc] font-bold">50 cm</strong> del panel o código QR físico
              </span>
            </div>
          </div>

          {/* Bottom Card Panel: Progress Tracker & FAB */}
          <div className="relative w-full rounded-xl bg-[#0e0b21]/90 border border-white/10 backdrop-blur-xl p-3 shadow-[0_4px_24px_rgba(0,0,0,0.7)] flex items-center justify-between gap-3">
            {/* Clues Segmented Progress */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-code text-[10px] text-[#e5defe] font-bold tracking-wider uppercase">
                  PISTAS DEL MISTERIO
                </span>
                <span className="font-label-code text-[10px] text-[#00eefc] font-bold">
                  {cluesDiscovered} DE 5 DESCUBIERTAS
                </span>
              </div>

              {/* 5 Segmented Bar Indicators */}
              <div className="grid grid-cols-5 gap-1.5 w-full h-2">
                {[1, 2, 3, 4, 5].map((idx) => {
                  const isDone = idx <= cluesDiscovered;
                  return (
                    <div
                      key={idx}
                      className={`rounded-full transition-all duration-300 ${
                        isDone
                          ? 'bg-[#00eefc] shadow-[0_0_10px_#00eefc]'
                          : 'bg-[#35324a]'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Mini Telemetry Stat */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="font-body-sm text-[11px] text-[#c9c5d0] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#ffb1c4]">
                    {cluesDiscovered >= 3 ? 'lock_open' : 'lock'}
                  </span>
                  Fragmento 3 {cluesDiscovered >= 3 ? 'desbloqueado' : 'bloqueado'}
                </span>
                <span className="font-label-code text-[10px] text-[#c7c0f8] font-semibold">
                  +250 XP DISPONIBLE
                </span>
              </div>
            </div>

            {/* Right: AI FAB Button */}
            <div className="relative flex-shrink-0">
              <span className="absolute -inset-2 rounded-full bg-[#ff027f]/30 animate-ping pointer-events-none" />
              <button
                onClick={onOpenAiAssistant}
                aria-label="Consultar Asistente IA StandHunter"
                className="relative w-14 h-14 rounded-full bg-[#ff027f] text-[#0e0b21] flex items-center justify-center shadow-[0_0_24px_rgba(255,2,127,0.7)] active:scale-95 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[28px] text-white">
                  smart_toy
                </span>
                {/* Voice Audio Pips Indicator Badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00eefc] flex items-center justify-center shadow-[0_0_8px_#00eefc]">
                  <span className="material-symbols-outlined text-[#0e0b21] text-[12px] font-bold">
                    graphic_eq
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ¡Objeto Identificado por IA! */}
      {showEvidenceModal && identifiedEvidence && (
        <div className="fixed inset-0 z-50 bg-[#0e0b21]/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute w-72 h-72 bg-[#00eefc]/20 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="relative w-full max-w-sm rounded-2xl bg-[#1a1442] border border-[#00eefc]/40 p-4 flex flex-col gap-3 shadow-[0_0_36px_rgba(0,238,252,0.35)] overflow-hidden">
            {/* Header Telemetry */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0e0b21] border border-[#00eefc]/40 text-[#00eefc] shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00eefc] animate-ping" />
                  <span className="font-label-code text-[10px] font-bold tracking-wider uppercase">
                    COINCIDENCIA IA: {identifiedEvidence.confidence}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#2a273e] flex items-center justify-center text-[#00eefc]">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
              </div>

              {/* Title with Sparkle */}
              <div className="flex items-start gap-2 mt-1">
                <div className="p-1 rounded bg-[#00eefc]/20 text-[#00eefc] flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-[18px] font-bold text-[#00eefc] leading-tight">
                    {identifiedEvidence.title}
                  </h2>
                  <span className="font-label-code text-[10px] text-[#c9c5d0] uppercase tracking-widest font-semibold">
                    {identifiedEvidence.subTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Holographic Document Display */}
            <div className="relative w-full h-44 rounded-xl bg-[#0e0b21] border border-[#00eefc]/30 overflow-hidden flex flex-col justify-between p-2.5 shadow-inner">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-85"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZrExTuv6vSjG1xBtnw2fzSVp27K56BE_7815XBP5kZuMQRcz-FUbdQ4OWcrKOaqu9cvyNKohpFFFqrrMw4tqEOFtpMbo4Za--fzx1kNuS-SBfMIOs_t1IuzqbcTOr6jN4VMGALqjwRdEWKXIQYWyzF-7SeYxdAC5A7gTvOpDeQboWU0Ic8DuY7KtsdGKBuNaxM2kszCGcGsOelxdBM-onlcFfjvMn8o1D9W4PZ5BhmK03UrK8tu1w')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#00eefc]/10 via-transparent to-[#0e0b21]/80 pointer-events-none" />

              {/* Top micro ruler */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="px-2 py-0.5 rounded bg-[#0e0b21]/90 border border-[#00eefc]/40 text-[#00eefc] font-label-code text-[10px] tracking-widest font-semibold">
                  {identifiedEvidence.fileName}
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0e0b21]/90 text-[#c9c5d0] font-label-code text-[10px]">
                  <span className="material-symbols-outlined text-[12px] text-[#ffb1c4]">lock_open</span>
                  <span className="text-[#00FF88] font-bold">{identifiedEvidence.status}</span>
                </div>
              </div>

              {/* Bottom coordinates */}
              <div className="relative z-10 flex items-end justify-between w-full">
                <div className="flex flex-col bg-[#0e0b21]/80 backdrop-blur-xs px-2 py-1 rounded border border-white/5">
                  <span className="font-label-code text-[10px] text-[#d3fbff] font-mono leading-none font-semibold">
                    {identifiedEvidence.hexCode}
                  </span>
                  <span className="font-label-code text-[9px] text-[#c9c5d0] leading-none mt-1">
                    SECUENCIA: {identifiedEvidence.sequence}
                  </span>
                </div>

                <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#c7c0f8]/20 backdrop-blur-xs text-[#c7c0f8] border border-[#c7c0f8]/30">
                  <span className="material-symbols-outlined text-[14px]">memory</span>
                  <span className="font-label-code text-[10px] font-bold uppercase tracking-wider">
                    {identifiedEvidence.chipTag}
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative text */}
            <div className="flex flex-col gap-1">
              <p className="font-body-md text-[13px] text-[#e5defe] leading-relaxed">
                {identifiedEvidence.description}
              </p>
              <div className="flex items-center gap-1 text-[#c9c5d0] font-label-code text-[10px]">
                <span className="material-symbols-outlined text-[14px] text-[#00eefc]">pin_drop</span>
                <span>{identifiedEvidence.locationTag}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-1">
              <button
                onClick={handleClaimEvidence}
                disabled={claimingEvidence}
                className="w-full h-12 rounded-xl bg-[#00eefc] hover:bg-[#00eefc]/90 text-[#002022] font-headline-sm text-[14px] font-bold uppercase tracking-wider flex items-center justify-between px-4 active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(0,238,252,0.5)] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bookmark_added
                  </span>
                  <span>{claimingEvidence ? 'Registrando...' : 'REGISTRAR EVIDENCIA'}</span>
                </div>
                <div className="flex items-center gap-1 bg-[#002022]/15 px-2 py-0.5 rounded text-[#002022] font-bold text-[12px]">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>+{identifiedEvidence.rewardPoints} PTS</span>
                </div>
              </button>

              <button
                onClick={() => setShowEvidenceModal(false)}
                className="w-full py-1.5 rounded-lg bg-transparent text-[#00eefc] hover:text-white transition-colors flex items-center justify-center gap-1 font-label-md text-[13px] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">videocam</span>
                <span>Continuar Escaneando</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
