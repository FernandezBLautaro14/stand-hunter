import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  ApiError,
  ClueEvidence,
  LiveTelemetry,
  MissionItem,
  RewardPassData,
} from '../types';

// Create configured Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'X-StandHunter-Client': 'web-pwa-v2.4',
  },
});

// Interceptor for outgoing requests (e.g. logging latency start)
apiClient.interceptors.request.use(
  (config) => {
    // Attach request timestamp for accurate network timing
    (config as any).metadata = { startTime: Date.now() };
    return config;
  },
  (error) => Promise.reject(handleAxiosError(error))
);

// Interceptor for incoming responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(handleAxiosError(error));
  }
);

// Consistent, robust error normalizer
export function handleAxiosError(error: any): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data as any;

    if (!error.response) {
      // Network error / offline / timeout
      if (error.code === 'ECONNABORTED') {
        return {
          message: 'Tiempo de espera agotado (Timeout). El nodo del stand tarda en responder.',
          code: 'TIMEOUT',
          isNetworkError: true,
        };
      }
      return {
        message: 'Sin conexión con el servidor del stand. Verificando canal WebRTC/Wi-Fi...',
        code: 'NETWORK_OFFLINE',
        isNetworkError: true,
      };
    }

    if (status === 503) {
      return {
        message: responseData?.message || 'Servicio de telemetría temporalmente no disponible.',
        status: 503,
        code: 'SERVICE_UNAVAILABLE',
        isNetworkError: false,
      };
    }

    if (status === 500) {
      return {
        message: responseData?.message || 'Error interno en la base de datos del stand.',
        status: 500,
        code: 'SERVER_ERROR',
        isNetworkError: false,
      };
    }

    return {
      message: responseData?.message || responseData?.error || error.message || 'Error en la solicitud.',
      status,
      code: error.code,
      isNetworkError: false,
    };
  }

  return {
    message: error?.message || 'Ocurrió un error inesperado al procesar la telemetría.',
    isNetworkError: false,
  };
}

// API Services
export async function fetchLiveTelemetry(simulateError: boolean = false): Promise<LiveTelemetry> {
  const url = simulateError ? '/stand/live-status?simulate_error=true' : '/stand/live-status';
  const response = await apiClient.get<{ success: boolean; data: LiveTelemetry }>(url);
  return response.data.data;
}

export async function fetchMissions(simulateError: boolean = false): Promise<MissionItem[]> {
  const url = simulateError ? '/missions?simulate_error=true' : '/missions';
  const response = await apiClient.get<{ success: boolean; missions: MissionItem[] }>(url);
  return response.data.missions;
}

export async function identifyObject(markerId: string = 'marker-totem-b4'): Promise<ClueEvidence> {
  const response = await apiClient.post<{ success: boolean; detection: ClueEvidence }>(
    '/scan/identify',
    { markerId }
  );
  return response.data.detection;
}

export async function sendAssistantMessage(
  message: string,
  currentScore: number
): Promise<{
  reply: string;
  isPenalty: boolean;
  penaltyAmount: number;
  newScore: number;
  timestamp: string;
}> {
  const response = await apiClient.post('/assistant/chat', {
    message,
    currentScore,
  });
  return response.data;
}

export async function fetchRewardPass(): Promise<RewardPassData> {
  const response = await apiClient.get<{ success: boolean; pass: RewardPassData }>('/rewards/pass');
  return response.data.pass;
}

export async function registerParticipant(data: {
  nickname: string;
  email?: string;
  specialty: string;
}): Promise<any> {
  const response = await apiClient.post('/participant/register', data);
  return response.data.participant;
}
