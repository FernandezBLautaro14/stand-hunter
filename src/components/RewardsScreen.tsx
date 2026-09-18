import React, { useState } from 'react';
import { RewardPassData } from '../types';

interface RewardsScreenProps {
  passData: RewardPassData;
  onReturnToMissions: () => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({
  passData,
  onReturnToMissions,
}) => {
  const [isMaxBright, setIsMaxBright] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  const toggleBrightness = () => {
    setIsMaxBright(!isMaxBright);
  };

  const handleShare = async () => {
    const shareData = {
      title: '¡Completé el desafío StandHunter!',
      text: `Obtuve ${passData.netPoints.toLocaleString()} PTS y Rango Oro en el StandHunter Lab. ¡Ven a desafiar tu ingenio en el stand!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share dismissed
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${shareData.title} - ${shareData.text} ${shareData.url}`
        );
        setShareFeedback('¡Enlace de Logro Copiado!');
        setTimeout(() => setShareFeedback(''), 2500);
      } catch {
        setShareFeedback('Logro listo para compartir');
        setTimeout(() => setShareFeedback(''), 2000);
      }
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[480px] mx-auto px-4 py-3 gap-5 relative select-none pb-24 overflow-hidden">
      {/* Background radial neon auras */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#00eefc]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-[-20%] w-60 h-60 bg-[#ffb1c4]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* SECCIÓN DE ÉXITO SUPERIOR CON HUD VICTORY GLOW */}
      <section className="flex flex-col items-center text-center relative pt-2">
        {/* Partículas y Emblema Radiante */}
        <div className="relative flex items-center justify-center mb-3">
          <div className="absolute w-24 h-24 rounded-full bg-[#00eefc]/20 animate-ping opacity-30" />
          <div className="absolute w-20 h-20 rounded-full bg-[#3e001a]/60 blur-md" />
          <div className="relative w-16 h-16 rounded-2xl bg-[#2a273e] border border-[#00eefc]/40 flex items-center justify-center shadow-[0_0_28px_rgba(0,238,252,0.45)]">
            <span
              className="material-symbols-outlined text-[#7df4ff] text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              military_tech
            </span>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#ffb1c4] flex items-center justify-center shadow-[0_0_10px_rgba(255,177,196,0.6)]">
              <span className="material-symbols-outlined text-[#65002e] text-[14px]">
                verified
              </span>
            </div>
          </div>
        </div>

        {/* Pips decorativos HUD */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00eefc] shadow-[0_0_8px_rgba(0,238,252,0.9)]" />
          <span className="font-label-code text-[11px] tracking-widest text-[#00eefc] uppercase font-bold">
            MISIÓN PROTOCOLO LAB-9 FINALIZADA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00eefc] shadow-[0_0_8px_rgba(0,238,252,0.9)]" />
        </div>

        <h1 className="font-headline-lg text-[25px] sm:text-[28px] text-[#e5defe] font-bold tracking-tight">
          ¡Desafío Completado con Éxito!
        </h1>
        <p className="font-body-md text-[13px] text-[#c9c5d0] mt-1 flex items-center justify-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00eefc]" />
          <span>{passData.rank}</span>
        </p>
      </section>

      {/* PANEL DE ESTADÍSTICAS Y EVALUACIÓN TÉCNICA */}
      <section className="flex flex-col rounded-2xl bg-[#1c192f] border border-[#00eefc]/25 shadow-lg relative p-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00eefc]/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00eefc] text-[20px]">
              analytics
            </span>
            <span className="font-label-lg text-[13px] text-[#e5defe] font-bold tracking-wide">
              TELEMETRÍA DE RENDIMIENTO
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#201d33] border border-[#00eefc]/30 text-[#00eefc] font-label-code text-[10px] tracking-wider uppercase font-bold">
            PRECISIÓN: ALTA
          </span>
        </div>

        {/* Puntuación Central Destacada */}
        <div className="flex flex-col items-center justify-center py-3 rounded-xl bg-[#0e0b21] border border-white/5 relative my-2 shadow-inner">
          <div className="absolute inset-0 bg-[#00eefc]/5 rounded-xl pointer-events-none" />
          <span className="font-label-code text-[11px] text-[#c9c5d0] uppercase tracking-widest font-semibold">
            Puntos Netos Acumulados
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display-hero-mobile text-[36px] text-[#7df4ff] font-black tracking-tight drop-shadow-[0_0_16px_rgba(0,238,252,0.6)]">
              {passData.netPoints.toLocaleString()}
            </span>
            <span className="font-headline-sm text-[18px] text-[#00eefc] font-extrabold tracking-wider">
              PTS
            </span>
          </div>
          <span className="font-label-code text-[11px] text-[#7df4ff] bg-[#2a273e] border border-[#00eefc]/30 px-3 py-1 rounded-full mt-2 flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {passData.tier}
          </span>
        </div>

        {/* Desglose Métrico */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          {/* Tiempo Total */}
          <div className="flex flex-col p-2.5 rounded-xl bg-[#201d33] border border-white/5">
            <div className="flex items-center gap-1 text-[#c9c5d0]">
              <span className="material-symbols-outlined text-[14px] text-[#00eefc]">timer</span>
              <span className="font-label-code text-[10px] uppercase tracking-tight">Tiempo</span>
            </div>
            <span className="font-headline-sm text-[16px] text-[#e5defe] font-bold mt-1 leading-tight">
              {passData.timeFormatted}
            </span>
            <span className="font-label-code text-[10px] text-[#00eefc] font-semibold mt-0.5">
              {passData.timeRating}
            </span>
          </div>

          {/* Pistas Descubiertas */}
          <div className="flex flex-col p-2.5 rounded-xl bg-[#201d33] border border-white/5">
            <div className="flex items-center gap-1 text-[#c9c5d0]">
              <span className="material-symbols-outlined text-[14px] text-[#00eefc]">radar</span>
              <span className="font-label-code text-[10px] uppercase tracking-tight">Pistas</span>
            </div>
            <span className="font-headline-sm text-[16px] text-[#e5defe] font-bold mt-1 leading-tight">
              {passData.cluesCount}
            </span>
            <span className="font-label-code text-[10px] text-[#00eefc] font-semibold mt-0.5">
              {passData.cluesSuccess}
            </span>
          </div>

          {/* Penalizaciones IA */}
          <div className="flex flex-col p-2.5 rounded-xl bg-[#201d33] border border-white/5">
            <div className="flex items-center gap-1 text-[#c9c5d0]">
              <span className="material-symbols-outlined text-[14px] text-[#ffb1c4]">warning</span>
              <span className="font-label-code text-[10px] uppercase tracking-tight">Penaliz.</span>
            </div>
            <span className="font-headline-sm text-[16px] text-[#ffb1c4] font-bold mt-1 leading-tight">
              {passData.penaltyPoints}
            </span>
            <span className="font-label-code text-[10px] text-[#c9c5d0] font-medium mt-0.5">
              {passData.penaltyReason}
            </span>
          </div>
        </div>
      </section>

      {/* CONTENEDOR DEL PREMIO SEGURO (TARJETA PASE QR) */}
      <section className="relative rounded-2xl p-4 bg-[#201d33] border border-[#00eefc]/30 shadow-xl overflow-hidden">
        {/* Ambient perimeter blurs */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#ffb1c4]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-[#00eefc]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center text-center relative z-10">
          {/* Badge de Estado */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0e0b21] text-[#00eefc] border border-[#00eefc]/30 mb-2 shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-[#00eefc]">
              card_membership
            </span>
            <span className="font-label-code text-[10px] tracking-widest uppercase font-bold">
              PASE DE RECOMPENSA FÍSICA
            </span>
          </div>

          <p className="font-body-sm text-[13px] text-[#c9c5d0] max-w-[320px] mb-4">
            Presenta este código al embajador del stand para retirar tu kit tecnológico oficial.
          </p>

          {/* Frame de QR Luminoso */}
          <div
            id="qr-target-container"
            onClick={toggleBrightness}
            className={`p-4 bg-[#0e0b21] rounded-2xl shadow-[0_0_24px_rgba(0,238,252,0.3)] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer relative border ${
              isMaxBright
                ? 'ring-8 ring-[#00eefc] bg-[#e5defe] shadow-[0_0_40px_rgba(0,238,252,0.8)] border-[#00eefc]'
                : 'border-white/10 hover:border-[#00eefc]/50'
            }`}
          >
            <div className="w-48 h-48 bg-[#e5defe] rounded-xl p-2.5 flex items-center justify-center shadow-inner relative overflow-hidden">
              {/* Exact SVG Vector QR */}
              <svg className="w-full h-full text-[#131027]" fill="currentColor" viewBox="0 0 100 100">
                {/* Standard Corner Scanning Targets */}
                <rect height="28" width="28" x="0" y="0" />
                <rect fill="#e5defe" height="20" width="20" x="4" y="4" />
                <rect height="12" width="12" x="8" y="8" />

                <rect height="28" width="28" x="72" y="0" />
                <rect fill="#e5defe" height="20" width="20" x="76" y="4" />
                <rect height="12" width="12" x="80" y="8" />

                <rect height="28" width="28" x="0" y="72" />
                <rect fill="#e5defe" height="20" width="20" x="4" y="76" />
                <rect height="12" width="12" x="8" y="80" />

                {/* Matrix Points */}
                <rect height="6" width="6" x="34" y="6" />
                <rect height="6" width="12" x="44" y="6" />
                <rect height="6" width="6" x="60" y="6" />
                <rect height="8" width="8" x="34" y="16" />
                <rect height="12" width="6" x="46" y="16" />
                <rect height="6" width="10" x="56" y="18" />
                <rect height="8" width="8" x="6" y="34" />
                <rect height="6" width="10" x="18" y="34" />
                <rect height="16" width="16" x="32" y="32" />
                <rect height="8" width="8" x="52" y="32" />
                <rect height="6" width="14" x="64" y="34" />
                <rect height="8" width="12" x="82" y="34" />
                <rect height="6" width="14" x="6" y="46" />
                <rect height="14" width="6" x="24" y="44" />
                <rect height="14" width="16" x="52" y="44" />
                <rect height="12" width="8" x="72" y="44" />
                <rect height="12" width="10" x="84" y="46" />
                <rect height="10" width="8" x="6" y="56" />
                <rect height="6" width="8" x="18" y="62" />
                <rect height="6" width="14" x="32" y="52" />
                <rect height="14" width="12" x="34" y="62" />
                <rect height="8" width="10" x="72" y="60" />
                <rect height="14" width="8" x="86" y="62" />
                <rect height="14" width="6" x="34" y="80" />
                <rect height="6" width="14" x="44" y="82" />
                <rect height="14" width="6" x="62" y="80" />
                <rect height="6" width="12" x="72" y="74" />
                <rect height="10" width="8" x="74" y="84" />

                {/* Core Lab Emblem */}
                <rect fill="#131027" height="12" width="12" x="44" y="44" />
                <circle cx="50" cy="50" fill="#00eefc" r="3" />
              </svg>
            </div>

            {/* Brightness Trigger Button */}
            <button
              id="toggle-brightness-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleBrightness();
              }}
              className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-code text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                isMaxBright
                  ? 'bg-[#00eefc] text-[#002022] font-bold shadow-[0_0_12px_#00eefc]'
                  : 'bg-[#2a273e] text-[#00eefc] hover:text-[#e5defe]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isMaxBright ? 'brightness_7' : 'brightness_high'}
              </span>
              <span>
                {isMaxBright
                  ? 'Brillo Máximo Activo (Toca para normalizar)'
                  : 'Toca para brillo máximo (Facilita escaneo)'}
              </span>
            </button>
          </div>

          {/* Hash Criptográfico y Validación */}
          <div className="mt-4 flex flex-col items-center gap-1 w-full px-3 py-2 rounded-xl bg-[#0e0b21] border border-white/5">
            <div className="flex items-center gap-1.5 text-[#00eefc]">
              <span className="material-symbols-outlined text-[16px]">fingerprint</span>
              <span className="font-label-code text-[11px] font-bold tracking-wider">
                {passData.hash}
              </span>
            </div>
            <span className="font-label-code text-[10px] text-[#00eefc] tracking-widest uppercase font-semibold">
              • FIRMA DIGITAL VERIFICADA EN {passData.node} •
            </span>
          </div>
        </div>
      </section>

      {/* DETALLE DEL PREMIO FÍSICO ASIGNADO */}
      <section className="flex items-center gap-3 p-3 rounded-2xl bg-[#1c192f] border border-white/5 shadow-sm">
        <div className="w-14 h-14 rounded-xl bg-[#2a273e] border border-[#00eefc]/30 flex items-center justify-center flex-shrink-0 text-[#00eefc] shadow-[0_0_12px_rgba(0,238,252,0.2)]">
          <span className="material-symbols-outlined text-[28px]">inventory_2</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-label-code text-[10px] text-[#00eefc] uppercase font-bold tracking-wider">
            Premio Asignado
          </span>
          <span className="font-headline-sm text-[16px] text-[#e5defe] font-semibold truncate leading-snug">
            {passData.prizeTitle}
          </span>
          <span className="font-body-sm text-[12px] text-[#c9c5d0] truncate">
            {passData.prizeDescription}
          </span>
        </div>
      </section>

      {/* BOTONES DE SALIDA Y ACCIONES PRINCIPALES */}
      <footer className="flex flex-col gap-2.5 pt-1">
        {/* Botón Principal: Compartir Logro */}
        <button
          onClick={handleShare}
          id="share-achievement-btn"
          type="button"
          className="w-full h-13 rounded-xl bg-[#ffb1c4] text-[#65002e] font-headline-sm text-[15px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,177,196,0.4)] active:scale-[0.98] transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            {shareFeedback ? 'check' : 'share'}
          </span>
          <span>{shareFeedback || 'Compartir Logro en Redes'}</span>
        </button>

        {/* Botón Secundario: Volver al Inicio */}
        <button
          onClick={onReturnToMissions}
          type="button"
          className="w-full h-12 rounded-xl bg-[#2a273e] hover:bg-[#3a364e] text-[#00eefc] font-headline-sm text-[14px] font-semibold tracking-wide flex items-center justify-center gap-2 border border-[#00eefc]/20 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">restart_alt</span>
          <span>Volver al Inicio / Nuevas Misiones</span>
        </button>
      </footer>
    </div>
  );
};
