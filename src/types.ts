export type ActiveTab = 'misiones' | 'escaner-ar' | 'asistente-ia' | 'recompensas';

export type TacticalSpecialty = 'cazador' | 'cripto' | 'explorador';

export interface ParticipantProfile {
  id: string;
  nickname: string;
  email?: string;
  specialty: TacticalSpecialty;
  registered: boolean;
  score: number;
}

export interface LiveTelemetry {
  boothId: string;
  boothName: string;
  activeAgents: number;
  latencyMs: number;
  fps: number;
  fov: string;
  lidarStatus: string;
  depthCalibration: string;
  nodeSync: string;
  serverRackLoad: string;
  totemState: string;
  topScore: number;
  accumulatedPoints: number;
  cluesDiscovered: number;
  totalClues: number;
  beaconScan: string;
  neuralSync: string;
  timestamp: string;
}

export interface MissionItem {
  id: string;
  tag: string;
  tagType: 'primary' | 'success' | 'danger';
  points: number;
  title: string;
  description: string;
  location: string;
  synchrony: string;
  duration: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  unlocked: boolean;
  imageUrl: string;
}

export interface ClueEvidence {
  id: string;
  confidence: string;
  title: string;
  subTitle: string;
  fileName: string;
  status: string;
  hexCode: string;
  sequence: string;
  chipTag: string;
  description: string;
  locationTag: string;
  rewardPoints: number;
  accumulatedPoints: number;
  cluesDiscovered: number;
  totalClues: number;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isPenalty?: boolean;
  penaltyAmount?: number;
}

export interface RewardPassData {
  hash: string;
  node: string;
  verified: boolean;
  rank: string;
  netPoints: number;
  tier: string;
  timeFormatted: string;
  timeRating: string;
  cluesCount: string;
  cluesSuccess: string;
  penaltyPoints: number;
  penaltyReason: string;
  prizeTitle: string;
  prizeDescription: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  isNetworkError: boolean;
}
