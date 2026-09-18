import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // State store in memory
  let activeAgents = 3;
  let accumulatedPoints = 1450;
  let cluesDiscovered = 2;
  const totalClues = 5;

  // Real-time live status API
  app.get('/api/stand/live-status', (req: Request, res: Response) => {
    // Check if error simulation requested
    if (req.query.simulate_error === 'true') {
      return res.status(503).json({
        error: 'NETWORK_CALIBRATION_ERROR',
        message: 'Fallo temporal en el transceptor de telemetría de StandHunter.',
        timestamp: new Date().toISOString(),
      });
    }

    // Slightly fluctuate active agents to simulate live physical booth attendance
    const agentDelta = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    activeAgents = Math.min(8, Math.max(2, activeAgents + agentDelta));

    res.json({
      success: true,
      data: {
        boothId: 'STAND-142',
        boothName: 'StandHunter Lab',
        activeAgents,
        latencyMs: Math.floor(Math.random() * 8) + 10,
        fps: 60.0,
        fov: '84.6°',
        lidarStatus: 'STAND_B4_ACTIVO',
        depthCalibration: 'CALIBRADO',
        nodeSync: 'NODE #04 // REF_LOCK',
        serverRackLoad: `${Math.floor(Math.random() * 5) + 85}%`,
        totemState: 'ACTIVO',
        topScore: 2450,
        accumulatedPoints,
        cluesDiscovered,
        totalClues,
        beaconScan: 'OK',
        neuralSync: 'DONE',
        timestamp: new Date().toISOString(),
      },
    });
  });

  // Missions list API
  app.get('/api/missions', (req: Request, res: Response) => {
    if (req.query.simulate_error === 'true') {
      return res.status(500).json({
        error: 'DATABASE_SYNC_FAILURE',
        message: 'No se pudo sincronizar el radar de misiones con el nodo central.',
      });
    }

    res.json({
      success: true,
      missions: [
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
            'Acerca tu terminal a 3 puntos baliza distribuidos en las columnas del stand y triangula el paquete de datos cifrado.',
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
            'Supera el escaneo de expresión facial computarizada y responde las 3 preguntas de seguridad ante el avatar holográfico del stand.',
          location: 'CÁMARA DE VALIDACIÓN C-01',
          synchrony: 'ENCRIPTADO',
          duration: '15 min',
          difficulty: 'Difícil',
          unlocked: false,
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDRzWKtT2RKfedzlp1ThYAIu0D9za1cHEjTBjGU1BSbhWCzDjZdf8bk_4QRt1-8nb599P1709Ke3iBw-qsUrQoWIQlLBhu1xy6YfUhmlLVntqwKJH7o1YhGJdtq01y0MFEezQFpZHuCC9GV87TP6rcnptZaWxZ0fcyQ6iedEDi5yJpWELNHGyUPR6yKJpQDkDLK27p6uhdy0V_TLe_yMPLSf1iM9cILPN80HgYOC6evB4SZpoOr0H6h',
        },
      ],
    });
  });

  // Evidence Registration / AR Object Identification
  app.post('/api/scan/identify', (req: Request, res: Response) => {
    accumulatedPoints += 350;
    cluesDiscovered = Math.min(totalClues, cluesDiscovered + 1);

    res.json({
      success: true,
      detection: {
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
        accumulatedPoints,
        cluesDiscovered,
        totalClues,
      },
    });
  });

  // Assistant Chat with live context & penalty mechanics
  app.post('/api/assistant/chat', (req: Request, res: Response) => {
    const { message, currentScore } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje inválido' });
    }

    const lower = message.toLowerCase();
    let isPenalty = false;
    let reply = '';

    if (lower.includes('pista') || lower.includes('color') || lower.includes('cable') || lower.includes('polaridad')) {
      isPenalty = true;
      reply =
        'El patrón sigue la secuencia Magenta - Cian - Violeta. Conecta los terminales en sentido horario para estabilizar el flujo.';
    } else if (lower.includes('tiempo') || lower.includes('cronometro') || lower.includes('cuanto queda')) {
      reply = 'El cronómetro del tótem indica 02:44 restantes antes del ciclo de recalibración térmica.';
    } else if (lower.includes('siguiente') || lower.includes('donde') || lower.includes('totem') || lower.includes('tótem')) {
      reply =
        'El siguiente punto de interés es el Tótem de Reactancia en el Stand #142 (Pasillo Central, Nodo B-04).';
    } else if (lower.includes('hola') || lower.includes('ayuda')) {
      reply =
        '¡Saludos, Agente! Estoy enlazado a los sensores del stand. Pregúntame sobre enigmas, secuencias o coordenadas físicas.';
    } else {
      reply =
        'Telemetría analizada. Dirige el escáner AR a unos 50 cm del panel central para alinear los nodos cuánticos.';
    }

    const newScore = isPenalty ? Math.max(0, (currentScore || accumulatedPoints) - 50) : (currentScore || accumulatedPoints);
    accumulatedPoints = newScore;

    res.json({
      success: true,
      reply,
      isPenalty,
      penaltyAmount: isPenalty ? 50 : 0,
      newScore,
      timestamp: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });
  });

  // Reward Pass Verification
  app.get('/api/rewards/pass', (req: Request, res: Response) => {
    res.json({
      success: true,
      pass: {
        hash: 'SHA256: 8F2A-94B1-SH-2025',
        node: 'NODO #04',
        verified: true,
        rank: 'Agente Rango Oro • StandHunter Lab',
        netPoints: accumulatedPoints > 1450 ? accumulatedPoints : 2450,
        tier: 'TOP 3% DEL EVENTO',
        timeFormatted: '06:18',
        timeRating: 'Muy rápido',
        cluesCount: '5 / 5',
        cluesSuccess: '100% éxito',
        penaltyPoints: -100,
        penaltyReason: '1 Asistencia IA',
        prizeTitle: 'Kit StandHunter Cyberpack V1',
        prizeDescription: 'Incluye Camiseta Edición Limitada + Hardware Tag NFC',
      },
    });
  });

  // Participant Registration API
  app.post('/api/participant/register', (req: Request, res: Response) => {
    const { nickname, email, specialty } = req.body;
    if (!nickname) {
      return res.status(400).json({ error: 'El nombre o nickname es obligatorio.' });
    }

    res.json({
      success: true,
      participant: {
        id: `SH-${Math.floor(1000 + Math.random() * 9000)}`,
        nickname,
        email: email || '',
        specialty: specialty || 'cazador',
        initialBonus: 50,
        registeredAt: new Date().toISOString(),
      },
    });
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StandHunter server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
