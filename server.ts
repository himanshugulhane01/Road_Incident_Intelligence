import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  MockAlertRepository,
  MockCameraRepository,
  MockDetectionRepository,
  MockIncidentRepository,
  MockPersonRepository,
  MockVehicleRepository,
} from './src/repositories';
import { DEMO_SCENARIO_EVENTS } from './src/detection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use('/VP', express.static(path.join(__dirname, 'VP')));
  app.use('/VP', express.static(path.join(__dirname, 'public/VP')));
  app.use('/public', express.static(path.join(__dirname, 'public')));

  // Initialize Repositories (Mock implementations ready for MongoDB / PostgreSQL)
  const detectionRepo = new MockDetectionRepository();
  const incidentRepo = new MockIncidentRepository();
  const alertRepo = new MockAlertRepository();
  const vehicleRepo = new MockVehicleRepository();
  const personRepo = new MockPersonRepository();
  const cameraRepo = new MockCameraRepository();

  // Populate initial detection events
  DEMO_SCENARIO_EVENTS.forEach((evt) => detectionRepo.add(evt));

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ONLINE',
      platform: 'RoadGuard AI Intelligence Backend',
      version: '2.6.0-SIM',
      timestamp: new Date().toISOString(),
      engineMode: 'SIMULATION MODE',
    });
  });

  // Dashboard Telemetry Stats
  app.get('/api/dashboard/stats', async (_req: Request, res: Response) => {
    const alerts = await alertRepo.getAll();
    const incidents = await incidentRepo.getAll();
    const vehicles = await vehicleRepo.getAll();
    const cameras = await cameraRepo.getAll();
    const detections = await detectionRepo.getAll();

    res.json({
      totalDetections: 1284 + detections.length,
      activeIncidents: incidents.filter((i) => i.status === 'NEW' || i.status === 'REVIEWING').length,
      numberPlatesDetected: 426,
      alertsGenerated: alerts.length,
      vehiclesTracked: vehicles.length * 36,
      highPriorityIncidents: incidents.filter((i) => i.severity === 'HIGH' || i.severity === 'CRITICAL').length,
      camerasOnline: cameras.filter((c) => c.status === 'ONLINE').length,
      totalCameras: cameras.length,
      averageConfidence: 94.8,
      systemStatus: 'ONLINE',
      aiEngineStatus: 'ACTIVE',
      detectionEngineMode: 'SIMULATION MODE',
    });
  });

  // Detections API
  app.get('/api/detections', async (req: Request, res: Response) => {
    const { type, minConfidence } = req.query;
    let list = await detectionRepo.getAll();

    if (type && type !== 'ALL') {
      list = list.filter((d) => d.type === type);
    }
    if (minConfidence) {
      list = list.filter((d) => d.confidence >= Number(minConfidence));
    }

    res.json({ count: list.length, data: list });
  });

  app.get('/api/detections/:id', async (req: Request, res: Response) => {
    const item = await detectionRepo.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Detection event not found' });
    }
    res.json(item);
  });

  // Incidents API
  app.get('/api/incidents', async (_req: Request, res: Response) => {
    const list = await incidentRepo.getAll();
    res.json({ count: list.length, data: list });
  });

  app.get('/api/incidents/:id', async (req: Request, res: Response) => {
    const item = await incidentRepo.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(item);
  });

  app.patch('/api/incidents/:id/status', async (req: Request, res: Response) => {
    const { status } = req.body;
    const updated = await incidentRepo.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(updated);
  });

  // Alerts API
  app.get('/api/alerts', async (_req: Request, res: Response) => {
    const list = await alertRepo.getAll();
    res.json({ count: list.length, data: list });
  });

  app.post('/api/alerts/:id/acknowledge', async (req: Request, res: Response) => {
    const updated = await alertRepo.acknowledge(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(updated);
  });

  app.post('/api/alerts/:id/dismiss', async (req: Request, res: Response) => {
    const updated = await alertRepo.dismiss(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(updated);
  });

  // Vehicles API (Simulated Demo Records)
  app.get('/api/vehicles', async (_req: Request, res: Response) => {
    const list = await vehicleRepo.getAll();
    res.json({ count: list.length, data: list, note: 'DEMO DATA ONLY' });
  });

  app.get('/api/vehicles/:id', async (req: Request, res: Response) => {
    const item = (await vehicleRepo.getById(req.params.id)) || (await vehicleRepo.getByPlate(req.params.id));
    if (!item) {
      return res.status(404).json({ error: 'Vehicle record not found' });
    }
    res.json(item);
  });

  // Persons API (Simulated Demo Records)
  app.get('/api/persons', async (_req: Request, res: Response) => {
    const list = await personRepo.getAll();
    res.json({ count: list.length, data: list, note: 'DEMO DATA ONLY' });
  });

  app.get('/api/persons/:id', async (req: Request, res: Response) => {
    const item = await personRepo.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Person record not found' });
    }
    res.json(item);
  });

  // Cameras API
  app.get('/api/cameras', async (_req: Request, res: Response) => {
    const list = await cameraRepo.getAll();
    res.json({ count: list.length, data: list });
  });

  // Video and AI Analysis Control APIs
  app.post('/api/video/upload', (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Video uploaded and indexed for neural perception pipeline.',
      status: 'READY_FOR_ANALYSIS',
    });
  });

  app.post('/api/analysis/start', (_req: Request, res: Response) => {
    res.json({
      success: true,
      status: 'ANALYSIS_RUNNING',
      engine: 'RoadGuard-MockEngine-v2.6',
      mode: 'SIMULATION',
    });
  });

  app.post('/api/analysis/stop', (_req: Request, res: Response) => {
    res.json({
      success: true,
      status: 'ANALYSIS_STOPPED',
    });
  });

  // ==========================================
  // VITE MIDDLEWARE SETUP
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RoadGuard AI] Server running on http://localhost:${PORT}`);
  });
}

startServer();
