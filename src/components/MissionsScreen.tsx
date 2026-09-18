import React, { useState } from 'react';
import { MissionItem, ParticipantProfile } from '../types';

interface MissionsScreenProps {
  missions: MissionItem[];
  participant: ParticipantProfile;
  activeAgents: number;
  onStartMission: (mission: MissionItem) => void;
  onRefresh: () => void;
  onSimulateError: () => void;
  isLoading?: boolean;
}

export const MissionsScreen: React.FC<MissionsScreenProps> = ({
  missions,
  participant,
  activeAgents,
  onStartMission,
  onRefresh,
  onSimulateError,
  isLoading = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'media' | 'tiempo'>('all');

  const filteredMissions = missions.filter((m) => {
    if (filter === 'media') return m.difficulty === 'Media';
    if (filter === 'tiempo') return parseInt(m.duration) <= 10;
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-2 pb-24 relative select-none">
      {/* Top Participant Level Strip */}
      <div className="flex items-center justify-between py-2 text-[#c9c5d0] font-label-code text-[11px] border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00eefc] shadow-[0_0_6px_#00eefc]" />
          <span>PASE: #{participant.id}</span>
        </div>
        <div className="flex items-center gap-1 bg-[#1c192f] px-2.5 py-0.5 rounded-full border border-white/10 text-[#c7c0f8]">
          <span className="material-symbols-outlined text-[14px]">shield</span>
          <span className="font-semibold uppercase tracking-wider">NIVEL 1 AGENTE</span>
        </div>
      </div>

      {/* Radar Section Title Banner */}
      <div className="flex items-center justify-between mt-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#201d33] border border-[#00eefc]/30 flex items-center justify-center text-[#00eefc]">
            <span className="material-symbols-outlined text-[20px]">radar</span>
          </div>
          <div>
            <h1 className="font-headline-md text-[20px] font-bold text-[#e5defe] leading-tight">
              Misiones Disponibles
            </h1>
            <p className="font-label-code text-[10px] text-[#00eefc] tracking-widest uppercase font-semibold">
              RADAR DE STAND SINCRONIZADO
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRefresh}
            title="Refrescar misiones en tiempo real"
            aria-label="Actualizar datos"
            className="w-8 h-8 rounded-full bg-[#1c192f] border border-white/10 flex items-center justify-center text-[#c9c5d0] hover:text-[#00eefc] transition-colors cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[18px] ${isLoading ? 'animate-spin text-[#00eefc]' : ''}`}>
              sync
            </span>
          </button>
          <button
            onClick={onSimulateError}
            title="Probar manejo de error Axios"
            aria-label="Probar error Axios"
            className="w-8 h-8 rounded-full bg-[#3e001a]/70 border border-[#ff027f]/30 flex items-center justify-center text-[#ffb1c4] hover:text-[#ff027f] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">bug_report</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full font-label-md text-[12px] tracking-wide whitespace-nowrap transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#00eefc] text-[#002022] font-bold shadow-[0_0_12px_rgba(0,238,252,0.4)]'
              : 'bg-[#1c192f] text-[#c9c5d0] hover:text-white border border-white/5'
          }`}
        >
          Todos los Retos
        </button>

        <button
          onClick={() => setFilter('media')}
          className={`px-3 py-1.5 rounded-full font-label-md text-[12px] tracking-wide whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
            filter === 'media'
              ? 'bg-[#00eefc] text-[#002022] font-bold shadow-[0_0_12px_rgba(0,238,252,0.4)]'
              : 'bg-[#1c192f] text-[#c9c5d0] hover:text-white border border-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">bolt</span>
          <span>Dificultad: Media</span>
        </button>

        <button
          onClick={() => setFilter('tiempo')}
          className={`px-3 py-1.5 rounded-full font-label-md text-[12px] tracking-wide whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
            filter === 'tiempo'
              ? 'bg-[#00eefc] text-[#002022] font-bold shadow-[0_0_12px_rgba(0,238,252,0.4)]'
              : 'bg-[#1c192f] text-[#c9c5d0] hover:text-white border border-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">timer</span>
          <span>Tiempo ≤ 10m</span>
        </button>
      </div>

      {/* Missions List */}
      <div className="flex flex-col gap-4">
        {filteredMissions.map((mission) => {
          const isPrimary = mission.tagType === 'primary';
          const isDanger = mission.tagType === 'danger';

          return (
            <div
              key={mission.id}
              className={`rounded-2xl overflow-hidden bg-[#1c192f] border transition-all shadow-xl p-4 flex flex-col gap-3 relative ${
                isPrimary
                  ? 'border-[#ff027f]/50 shadow-[0_0_24px_rgba(255,2,127,0.15)]'
                  : isDanger
                  ? 'border-[#ffb1c4]/30'
                  : 'border-[#00eefc]/30'
              }`}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span
                  className={`font-label-code text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${
                    isPrimary
                      ? 'bg-[#1a1442] text-[#ff027f] border border-[#ff027f]/40'
                      : isDanger
                      ? 'bg-[#3e001a] text-[#ffb1c4] border border-[#ff027f]/30'
                      : 'bg-[#0e0b21] text-[#00eefc] border border-[#00eefc]/30'
                  }`}
                >
                  {mission.tag}
                </span>

                <div
                  className={`flex items-center gap-1 font-label-code text-[13px] font-extrabold ${
                    isPrimary ? 'text-[#00eefc]' : isDanger ? 'text-[#ffb1c4]' : 'text-[#7df4ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isPrimary ? 'bolt' : isDanger ? 'military_tech' : 'stars'}
                  </span>
                  <span>+{mission.points.toLocaleString()} pts</span>
                </div>
              </div>

              {/* Mission Image with HUD tags */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#0e0b21] border border-white/10">
                <img
                  src={mission.imageUrl}
                  alt={mission.title}
                  className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b21] via-transparent to-transparent" />

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-label-code text-[10px] text-[#e5defe]">
                  <span className="bg-[#0e0b21]/80 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                    {mission.location}
                  </span>
                  <span className="text-[#00eefc] bg-[#0e0b21]/80 backdrop-blur-sm px-2 py-0.5 rounded border border-[#00eefc]/30 font-semibold">
                    {mission.synchrony}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-headline-sm text-[17px] font-bold text-[#e5defe] leading-snug">
                  {mission.title}
                </h3>
                <p className="font-body-sm text-[13px] text-[#c9c5d0] mt-1 line-clamp-2 leading-relaxed">
                  {mission.description}
                </p>
              </div>

              {/* Mission Metadata */}
              <div className="flex items-center gap-3 text-[#c9c5d0] font-label-code text-[11px] pt-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  <span>{mission.duration}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
                  <span>Dificultad: {mission.difficulty}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onStartMission(mission)}
                className={`w-full h-12 rounded-xl font-headline-sm text-[14px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer ${
                  isPrimary
                    ? 'bg-[#ff027f] hover:bg-[#ff027f]/90 text-white shadow-[0_0_20px_rgba(255,2,127,0.55)]'
                    : isDanger
                    ? 'bg-[#2a273e] text-[#c9c5d0] hover:text-white border border-[#ff027f]/30'
                    : 'bg-[#00eefc] hover:bg-[#00eefc]/90 text-[#002022] shadow-[0_0_16px_rgba(0,238,252,0.4)]'
                }`}
              >
                <span>INICIAR DESAFÍO</span>
                <span className="material-symbols-outlined text-[18px]">
                  {isDanger ? 'lock' : 'arrow_forward'}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Attendees Real-Time Telemetry Footer */}
      <div className="mt-5 p-3 rounded-xl bg-[#0e0b21]/90 border border-[#00eefc]/25 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-lg bg-[#1a1442] flex items-center justify-center text-[#00eefc] flex-shrink-0 border border-[#00eefc]/40 shadow-[0_0_10px_rgba(0,238,252,0.3)]">
          <span className="material-symbols-outlined text-[20px] animate-pulse">radar</span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-[15px] font-bold text-[#e5defe]">
              {activeAgents} Agentes activos
            </span>
            <span className="w-2 h-2 rounded-full bg-[#00eefc] animate-ping" />
          </div>
          <span className="font-body-sm text-[12px] text-[#c9c5d0] truncate">
            Completando desafíos en este stand ahora (Sincronizado vía Axios)
          </span>
        </div>
      </div>
    </div>
  );
};
