import React, { useState, useEffect, useCallback } from 'react';
import {
  ActiveTab,
  ApiError,
  LiveTelemetry,
  MissionItem,
  ParticipantProfile,
  RewardPassData,
} from './types';
import {
  fetchLiveTelemetry,
  fetchMissions,
  fetchRewardPass,
  handleAxiosError,
} from './services/api';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { RegistrationModal } from './components/RegistrationModal';
import { MissionsScreen } from './components/MissionsScreen';
import { ArScannerScreen } from './components/ArScannerScreen';
import { AiAssistantScreen } from './components/AiAssistantScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { ErrorBanner } from './components/ErrorBanner';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('misiones');

  const [participant, setParticipant] = useState<ParticipantProfile>({
    id: 'SH-9428',
    nickname: 'Lautaro_Agent',
    email: 'lautarofernandezb14@gmail.com',
    specialty: 'cazador',
    registered: true,
    score: 1450,
  });

  const [telemetry, setTelemetry] = useState<LiveTelemetry | null>(null);
  const [missions, setMissions] = useState<MissionItem[]>([]);
  const [rewardPass, setRewardPass] = useState<RewardPassData | null>(null);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Load telemetry and missions via Axios
  const loadData = useCallback(async (simulateError: boolean = false) => {
    setLoadingData(true);
    try {
      const [telemetryRes, missionsRes, passRes] = await Promise.all([
        fetchLiveTelemetry(simulateError),
        fetchMissions(simulateError),
        fetchRewardPass(),
      ]);

      setTelemetry(telemetryRes);
      setMissions(missionsRes);
      setRewardPass(passRes);
      setApiError(null);
    } catch (err: any) {
      const formatted = handleAxiosError(err);
      setApiError(formatted);
    } finally {
      setLoadingData(false);
      setIsRetrying(false);
    }
  }, []);

  // Initial load and periodic telemetry polling (every 12 seconds)
  useEffect(() => {
    loadData(false);
    const interval = setInterval(() => {
      // Background non-intrusive polling
      fetchLiveTelemetry(false)
        .then((data) => setTelemetry(data))
        .catch(() => {});
    }, 12000);

    return () => clearInterval(interval);
  }, [loadData]);

  const handleRetry = () => {
    setIsRetrying(true);
    loadData(false);
  };

  const handleSimulateError = () => {
    loadData(true);
  };

  const handleClueClaimed = (points: number) => {
    setParticipant((prev) => {
      const newScore = prev.score + points;
      return { ...prev, score: newScore };
    });
    if (rewardPass) {
      setRewardPass((prev) =>
        prev
          ? {
              ...prev,
              netPoints: prev.netPoints + points,
              cluesCount: '5 / 5',
            }
          : null
      );
    }
  };

  const handleUpdateScore = (newScore: number) => {
    setParticipant((prev) => ({ ...prev, score: newScore }));
  };

  return (
    <div className="min-h-screen bg-[#131027] text-[#e5defe] flex flex-col justify-between selection:bg-[#00eefc] selection:text-[#002022] relative overflow-x-hidden font-body-md">
      {/* 1. Splash Screen during Initial Boot */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
            // Optionally prompt onboarding once
            const hasSeen = localStorage.getItem('sh_has_seen_onboarding');
            if (!hasSeen) {
              setShowOnboarding(true);
              localStorage.setItem('sh_has_seen_onboarding', 'true');
            }
          }}
        />
      )}

      {/* 2. Top Header with Live HUD status */}
      <Header
        activeTab={activeTab}
        participant={participant}
        latencyMs={telemetry?.latencyMs || 12}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* 3. Global Axios Error Banner with Retry */}
      <ErrorBanner
        error={apiError}
        onRetry={handleRetry}
        onDismiss={() => setApiError(null)}
        isRetrying={isRetrying}
      />

      {/* 4. Main Body Content Area */}
      <main className="flex-1 w-full pt-16 pb-20 relative">
        {showOnboarding ? (
          <OnboardingScreen
            onDismiss={() => setShowOnboarding(false)}
            onCameraGranted={() => {
              setShowOnboarding(false);
              setActiveTab('escaner-ar');
            }}
          />
        ) : (
          <>
            {activeTab === 'misiones' && (
              <MissionsScreen
                missions={
                  missions.length > 0
                    ? missions
                    : [
                        {
                          id: 'mission-01',
                          tag: 'DESAFÍO PRINCIPAL',
                          tagType: 'primary',
                          points: 1200,
                          title: 'El Núcleo Cuántico Perdido',
                          description:
                            'Localiza y restablece la matriz de refrigeración cuántica en el tótem holográfico antes de que la temperatura alcance el umbral crítico.',
                          location: 'STAND A-12',
                          synchrony: 'SINCRONÍA 98%',
                          duration: '10 min',
                          difficulty: 'Media',
                          unlocked: true,
                          imageUrl:
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuAYkK9oVl1zrL8he7DP5Lz5TRhmsjnU9voiTEnzKEWihV-BDNjRB_Bue9_mq4lc8Lw5WwCZh2TGV7SVwPzoSM2QQNaZ-CrtMxXht68k0zw1jabZnoXAH0S2thF1U2xPpa2NJxps3IxplMKL_zdRuEHfYrMk4ktqXzr02c1YS6VhM1iLGPU7X56FS5EJxfCQcWnUGih0qdXLjhkITHyIKO1qCQF7XGOIXGSkwXtxaYjiPK_HqSJCkADH',
                        },
                        {
                          id: 'mission-02',
                          tag: 'DISPONIBLE',
                          tagType: 'success',
                          points: 800,
                          title: 'Decodificador de Señales NFC',
                          description:
                            'Acerca tu terminal a 3 puntos baliza distribuidos en las columnas del stand y triangula el paquete de datos...',
                          location: 'TERMINAL B-04',
                          synchrony: 'ONLINE',
                          duration: '8 min',
                          difficulty: 'Fácil',
                          unlocked: true,
                          imageUrl:
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuDxkbGPVeGBQE0VDuzlZaFzZwxoIbJFefbuMGxYTScpBdxWDLbFrg6kOwlbytnCkfyPHy9zdp6LxaRQzXug66gZsUxAbKNlVhIVqVPeMDiM8-o7T54Etq1LNvUQ2PsTpRPPE_znhbC0GwRRak0d9_5No-tt7UunSZn4xMpF_KI_gZdIGcPN1VZRdKzVGM6lt4zR00r63PjLYVPVm3RcZeEtDL-qQ0Kjh_Dpx3gD_dyTa2MPTiPyJzTW',
                        },
                        {
                          id: 'mission-03',
                          tag: 'ALTA SEGURIDAD',
                          tagType: 'danger',
                          points: 2000,
                          title: 'Infiltración Biométrica en el Stand',
                          description:
                            'Supera el escaneo de expresión facial computarizada y responde las 3 preguntas de seguridad ante el avatar...',
                          location: 'CÁMARA DE VALIDACIÓN C-01',
                          synchrony: 'ENCRIPTADO',
                          duration: '15 min',
                          difficulty: 'Difícil',
                          unlocked: false,
                          imageUrl:
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuDRzWKtT2RKfedzlp1ThYAIu0D9za1cHEjTBjGU1BSbhWCzDjZdf8bk_4QRt1-8nb599P1709Ke3iBw-qsUrQoWIQlLBhu1xy6YfUhmlLVntqwKJH7o1YhGJdtq01y0MFEezQFpZHuCC9GV87TP6rcnptZaWxZ0fcyQ6iedEDi5yJpWELNHGyUPR6yKJpQDkDLK27p6uhdy0V_TLe_yMPLSf1iM9cILPN80HgYOC6evB4SZpoOr0H6h',
                        },
                      ]
                }
                participant={participant}
                activeAgents={telemetry?.activeAgents || 3}
                onStartMission={() => setActiveTab('escaner-ar')}
                onRefresh={() => loadData(false)}
                onSimulateError={handleSimulateError}
                isLoading={loadingData}
              />
            )}

            {activeTab === 'escaner-ar' && (
              <ArScannerScreen
                accumulatedPoints={participant.score}
                onOpenAiAssistant={() => setActiveTab('asistente-ia')}
                onClueClaimed={handleClueClaimed}
              />
            )}

            {activeTab === 'asistente-ia' && (
              <AiAssistantScreen
                score={participant.score}
                onUpdateScore={handleUpdateScore}
              />
            )}

            {activeTab === 'recompensas' && (
              <RewardsScreen
                passData={
                  rewardPass || {
                    hash: 'SHA256: 8F2A-94B1-SH-2025',
                    node: 'NODO #04',
                    verified: true,
                    rank: 'Agente Rango Oro • StandHunter Lab',
                    netPoints: 2450,
                    tier: 'TOP 3% DEL EVENTO',
                    timeFormatted: '06:18',
                    timeRating: 'Muy rápido',
                    cluesCount: '5 / 5',
                    cluesSuccess: '100% éxito',
                    penaltyPoints: -100,
                    penaltyReason: '1 Asistencia IA',
                    prizeTitle: 'Kit StandHunter Cyberpack V1',
                    prizeDescription:
                      'Incluye Camiseta Edición Limitada + Hardware Tag NFC',
                  }
                }
                onReturnToMissions={() => setActiveTab('misiones')}
              />
            )}
          </>
        )}
      </main>

      {/* 5. Fixed Tactical Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setShowOnboarding(false);
          setActiveTab(tab);
        }}
        unclaimedRewards={participant.score >= 1800}
      />

      {/* 6. Participant Profile & Registration Modal */}
      <RegistrationModal
        profile={participant}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSaveProfile={(updated) => setParticipant(updated)}
      />
    </div>
  );
}
