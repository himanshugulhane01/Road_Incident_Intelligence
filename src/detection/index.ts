import { DetectionEvent, DetectionType, Severity } from '../types';

// =========================================================================
// AI DETECTION ENGINE INTERFACES
// (Architecture allows dropping in YOLODetectionEngine, RealOCRService,
// DeepSORT tracking engine, or OpenCV Python inference servers without UI changes)
// =========================================================================

export interface DetectionEngine {
  readonly name: string;
  readonly version: string;
  readonly isSimulation: boolean;
  start(): Promise<void>;
  stop(): Promise<void>;
  processFrame(frame: unknown): Promise<DetectionEvent[]>;
  getEventsForTimestamp(seconds: number, activeFilters?: DetectionType[]): DetectionEvent[];
  getAllScenarioEvents(): DetectionEvent[];
}

export interface OCRService {
  readonly engineName: string;
  recognize(image: unknown): Promise<{
    text: string;
    confidence: number;
    charBoxes?: Array<{ char: string; confidence: number }>;
  }>;
}

export interface TrackingEngine {
  readonly trackerName: string;
  update(detections: DetectionEvent[]): Promise<DetectionEvent[]>;
}

// =========================================================================
// MOCK OCR SERVICE
// =========================================================================
export class MockOCRService implements OCRService {
  readonly engineName = 'Mock-Tesseract-CRNN-Engine (Simulation)';

  async recognize(image: unknown): Promise<{ text: string; confidence: number }> {
    // In real implementation: invoke PaddleOCR / Tesseract.js / OpenCV plate crop
    return {
      text: 'MH27AB1234',
      confidence: 97.4,
    };
  }
}

// =========================================================================
// MOCK TRACKING ENGINE
// =========================================================================
export class MockTrackingEngine implements TrackingEngine {
  readonly trackerName = 'Mock-ByteTrack-Kalman (Simulation)';

  async update(detections: DetectionEvent[]): Promise<DetectionEvent[]> {
    return detections.map((d, index) => ({
      ...d,
      trackingId: d.trackingId || `TRK-${(index + 100).toString().padStart(5, '0')}`,
    }));
  }
}

// =========================================================================
// DEMO SCENARIO SCRIPT (Timestamp-linked computer vision events)
// =========================================================================
export const DEMO_SCENARIO_EVENTS: DetectionEvent[] = [
  {
    id: 'DET-001',
    timestamp: 2,
    timeFormatted: '00:02',
    type: 'VEHICLE',
    label: 'VEHICLE: MOTORCYCLE',
    confidence: 94.2,
    trackingId: 'TRK-00821',
    vehicleId: 'VH-00281',
    numberPlate: 'MH27AB1234',
    vehicleType: 'Motorcycle',
    cameraId: 'CAM-02',
    cameraName: 'City Square Flyover',
    severity: 'LOW',
    bbox: { x: 38, y: 44, width: 22, height: 38 },
    details: 'Two-wheeler entering detection zone at 45 km/h.',
    isSimulated: true,
  },
  {
    id: 'DET-002',
    timestamp: 4,
    timeFormatted: '00:04',
    type: 'NUMBER_PLATE',
    label: 'NUMBER_PLATE: MH27AB1234',
    confidence: 97.4,
    trackingId: 'TRK-00821',
    vehicleId: 'VH-00281',
    numberPlate: 'MH27AB1234',
    vehicleType: 'Motorcycle',
    cameraId: 'CAM-02',
    cameraName: 'City Square Flyover',
    severity: 'LOW',
    ocrConfidence: 98.1,
    bbox: { x: 42, y: 64, width: 14, height: 8 },
    details: 'High-clarity license plate capture with optical recognition match.',
    isSimulated: true,
  },
  {
    id: 'DET-003',
    timestamp: 7,
    timeFormatted: '00:07',
    type: 'NO_HELMET',
    label: 'VIOLATION: NO HELMET',
    confidence: 96.8,
    trackingId: 'TRK-00821',
    vehicleId: 'VH-00281',
    numberPlate: 'MH27AB1234',
    vehicleType: 'Motorcycle',
    cameraId: 'CAM-02',
    cameraName: 'City Square Flyover',
    severity: 'HIGH',
    bbox: { x: 44, y: 42, width: 10, height: 14 },
    details: 'Head pose classifier detected missing safety helmet on rider.',
    isSimulated: true,
  },
  {
    id: 'DET-004',
    timestamp: 10,
    timeFormatted: '00:10',
    type: 'NUMBER_PLATE',
    label: 'OCR CONFIRMED: MH27AB1234',
    confidence: 98.6,
    trackingId: 'TRK-00821',
    vehicleId: 'VH-00281',
    numberPlate: 'MH27AB1234',
    vehicleType: 'Motorcycle',
    cameraId: 'CAM-02',
    cameraName: 'City Square Flyover',
    severity: 'LOW',
    ocrConfidence: 99.2,
    bbox: { x: 43, y: 62, width: 12, height: 9 },
    details: 'OCR multi-frame temporal voting confirmed plate sequence.',
    isSimulated: true,
  },
  {
    id: 'DET-005',
    timestamp: 13,
    timeFormatted: '00:13',
    type: 'OVERSPEED',
    label: 'OVERSPEED: 82 KM/H (LIMIT 50)',
    confidence: 93.8,
    trackingId: 'TRK-00633',
    vehicleId: 'VH-00509',
    numberPlate: 'MH40EF4521',
    vehicleType: 'SUV',
    cameraId: 'CAM-01',
    cameraName: 'Sector 4 Junction',
    severity: 'HIGH',
    speedKmh: 82,
    bbox: { x: 18, y: 35, width: 34, height: 32 },
    details: 'Optical flow & optical speed calibration recorded +32 km/h over limit.',
    isSimulated: true,
  },
  {
    id: 'DET-006',
    timestamp: 17,
    timeFormatted: '00:17',
    type: 'VEHICLE',
    label: 'VEHICLE: SEDAN',
    confidence: 91.5,
    trackingId: 'TRK-00914',
    vehicleId: 'VH-00412',
    numberPlate: 'MH31CD7788',
    vehicleType: 'Sedan',
    cameraId: 'CAM-01',
    cameraName: 'Sector 4 Junction',
    severity: 'LOW',
    speedKmh: 44,
    bbox: { x: 55, y: 40, width: 30, height: 28 },
    details: 'Standard trajectory tracking active.',
    isSimulated: true,
  },
  {
    id: 'DET-007',
    timestamp: 21,
    timeFormatted: '00:21',
    type: 'TRIPLE_RIDING',
    label: 'VIOLATION: TRIPLE RIDING',
    confidence: 91.2,
    trackingId: 'TRK-00744',
    vehicleId: 'VH-00673',
    numberPlate: 'MH12KL9901',
    vehicleType: 'Motorcycle',
    cameraId: 'CAM-02',
    cameraName: 'City Square Flyover',
    severity: 'HIGH',
    bbox: { x: 30, y: 38, width: 26, height: 42 },
    details: 'Pose keypoint estimation detected 3 seated occupants on 2-wheeler.',
    isSimulated: true,
  },
  {
    id: 'DET-008',
    timestamp: 25,
    timeFormatted: '00:25',
    type: 'NUMBER_PLATE',
    label: 'NUMBER_PLATE: MH31CD7788',
    confidence: 98.1,
    trackingId: 'TRK-00914',
    vehicleId: 'VH-00412',
    numberPlate: 'MH31CD7788',
    vehicleType: 'Sedan',
    cameraId: 'CAM-01',
    cameraName: 'Sector 4 Junction',
    severity: 'LOW',
    ocrConfidence: 97.9,
    bbox: { x: 62, y: 58, width: 14, height: 8 },
    details: 'Clean license plate recognition on rear bumper.',
    isSimulated: true,
  },
  {
    id: 'DET-009',
    timestamp: 29,
    timeFormatted: '00:29',
    type: 'WRONG_SIDE',
    label: 'CRITICAL: WRONG SIDE INGRESS',
    confidence: 97.1,
    trackingId: 'TRK-00301',
    vehicleId: 'VH-00788',
    numberPlate: 'MH14XY6543',
    vehicleType: 'Truck',
    cameraId: 'CAM-03',
    cameraName: 'Highway Outer Ring Road',
    severity: 'CRITICAL',
    bbox: { x: 12, y: 28, width: 38, height: 48 },
    details: 'Trajectory vector is 180 degrees counter to highway lane mandate.',
    isSimulated: true,
  },
  {
    id: 'DET-010',
    timestamp: 34,
    timeFormatted: '00:34',
    type: 'SUSPICIOUS_VEHICLE',
    label: 'WARNING: STATIONARY SUSPICIOUS VEHICLE',
    confidence: 89.4,
    trackingId: 'TRK-00512',
    vehicleId: 'VH-00845',
    numberPlate: 'MH02QZ8811',
    vehicleType: 'Auto-Rickshaw',
    cameraId: 'CAM-04',
    cameraName: 'University Campus Road',
    severity: 'MEDIUM',
    bbox: { x: 68, y: 50, width: 24, height: 32 },
    details: 'Unattended vehicle idle in yellow box clearance zone > 120s.',
    isSimulated: true,
  },
  {
    id: 'DET-011',
    timestamp: 39,
    timeFormatted: '00:39',
    type: 'RED_LIGHT_VIOLATION',
    label: 'VIOLATION: RED LIGHT CROSSED',
    confidence: 95.3,
    trackingId: 'TRK-00633',
    vehicleId: 'VH-00509',
    numberPlate: 'MH40EF4521',
    vehicleType: 'SUV',
    cameraId: 'CAM-01',
    cameraName: 'Sector 4 Junction',
    severity: 'HIGH',
    bbox: { x: 32, y: 30, width: 36, height: 34 },
    details: 'Vehicle crossed stop bar 2.4 seconds after signal phase switched to RED.',
    isSimulated: true,
  },
  {
    id: 'DET-012',
    timestamp: 44,
    timeFormatted: '00:44',
    type: 'HELMET',
    label: 'COMPLIANCE: HELMET VERIFIED',
    confidence: 98.9,
    trackingId: 'TRK-00988',
    vehicleId: 'VH-00281',
    numberPlate: 'MH27AB1234',
    vehicleType: 'Motorcycle',
    cameraId: 'CAM-02',
    cameraName: 'City Square Flyover',
    severity: 'LOW',
    bbox: { x: 46, y: 36, width: 10, height: 12 },
    details: 'Compliant certified protective headgear confirmed on secondary rider.',
    isSimulated: true,
  },
  {
    id: 'DET-013',
    timestamp: 48,
    timeFormatted: '00:48',
    type: 'PERSON',
    label: 'PEDESTRIAN IN CROSSWALK',
    confidence: 92.1,
    trackingId: 'TRK-01021',
    cameraId: 'CAM-04',
    cameraName: 'University Campus Road',
    severity: 'LOW',
    bbox: { x: 75, y: 45, width: 10, height: 28 },
    details: 'Pedestrian detected safely traversing designated zebra crossing.',
    isSimulated: true,
  },
  {
    id: 'DET-014',
    timestamp: 54,
    timeFormatted: '00:54',
    type: 'ACCIDENT',
    label: 'CRITICAL: COLLISION HAZARD DETECTED',
    confidence: 88.5,
    trackingId: 'TRK-00821',
    vehicleId: 'VH-00281',
    numberPlate: 'MH27AB1234',
    cameraId: 'CAM-02',
    cameraName: 'City Square Flyover',
    severity: 'CRITICAL',
    bbox: { x: 35, y: 40, width: 35, height: 40 },
    details: 'Sudden deceleration anomaly and multi-object boundary intersection.',
    isSimulated: true,
  },
];

// =========================================================================
// MOCK DETECTION ENGINE (Standard Simulation Implementation)
// =========================================================================
export class MockDetectionEngine implements DetectionEngine {
  readonly name = 'RoadGuard-MockEngine-v2.6';
  readonly version = '2.6.0-SIM';
  readonly isSimulation = true;

  private isRunning = false;
  private ocrService: OCRService;
  private tracker: TrackingEngine;

  constructor() {
    this.ocrService = new MockOCRService();
    this.tracker = new MockTrackingEngine();
  }

  async start(): Promise<void> {
    this.isRunning = true;
  }

  async stop(): Promise<void> {
    this.isRunning = false;
  }

  async processFrame(_frame: unknown): Promise<DetectionEvent[]> {
    // In future YOLO: send RGB tensor to YOLOv8 / YOLOv11 ONNX runtime
    return [];
  }

  getAllScenarioEvents(): DetectionEvent[] {
    return [...DEMO_SCENARIO_EVENTS];
  }

  /**
   * Retrieves detection events that are visible within the active time window of the video.
   * A detection is considered "active" on screen for ~3 seconds around its trigger timestamp.
   */
  getEventsForTimestamp(seconds: number, activeFilters?: DetectionType[]): DetectionEvent[] {
    const rounded = Math.floor(seconds);
    const visibleEvents = DEMO_SCENARIO_EVENTS.filter((event) => {
      // Show if the event's timestamp is within [timestamp, timestamp + 2.8] seconds
      return seconds >= event.timestamp && seconds <= event.timestamp + 2.8;
    });

    if (!activeFilters || activeFilters.length === 0 || activeFilters.includes('ALL')) {
      return visibleEvents;
    }

    return visibleEvents.filter((event) => activeFilters.includes(event.type));
  }
}

// Singleton instance for app-wide use
export const globalDetectionEngine = new MockDetectionEngine();
