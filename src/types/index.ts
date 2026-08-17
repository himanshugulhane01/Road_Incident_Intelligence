export type DetectionType =
  | 'ALL'
  | 'NUMBER_PLATE'
  | 'HELMET'
  | 'NO_HELMET'
  | 'TRIPLE_RIDING'
  | 'OVERSPEED'
  | 'WRONG_SIDE'
  | 'RED_LIGHT_VIOLATION'
  | 'ACCIDENT'
  | 'SUSPICIOUS_VEHICLE'
  | 'VEHICLE'
  | 'PERSON';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'NEW' | 'REVIEWING' | 'CONFIRMED' | 'RESOLVED';

export type AlertStatus = 'UNREAD' | 'ACKNOWLEDGED' | 'DISMISSED';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface DetectionEvent {
  id: string;
  timestamp: number; // in seconds from video start
  timeFormatted: string;
  type: DetectionType;
  label: string;
  confidence: number; // 0-100
  trackingId?: string;
  vehicleId?: string;
  numberPlate?: string;
  cameraId: string;
  cameraName?: string;
  severity: Severity;
  bbox?: BoundingBox;
  speedKmh?: number;
  ocrConfidence?: number;
  vehicleType?: string;
  details?: string;
  isSimulated?: boolean;
}

export interface Incident {
  id: string;
  type: DetectionType;
  title: string;
  severity: Severity;
  timestamp: string;
  videoTimestampSec: number;
  camera: string;
  location: string;
  vehicleId?: string;
  numberPlate?: string;
  trackingId?: string;
  confidence: number;
  status: IncidentStatus;
  description: string;
  reviewedBy?: string;
  isSimulated: boolean;
}

export interface Alert {
  id: string;
  priority: Severity;
  title: string;
  message: string;
  timestamp: string;
  videoTimestampSec: number;
  sourceCamera: string;
  detectionType: DetectionType;
  confidence: number;
  status: AlertStatus;
  vehicleId?: string;
  numberPlate?: string;
  trackingId?: string;
  incidentId?: string;
  isSimulated: boolean;
}

export interface VehicleRecord {
  vehicleId: string;
  numberPlate: string;
  vehicleType: 'Motorcycle' | 'Sedan' | 'SUV' | 'Truck' | 'Bus' | 'Auto-Rickshaw';
  makeModel: string;
  color: string;
  firstDetected: string;
  lastSeen: string;
  totalDetections: number;
  associatedIncidents: number;
  status: 'Clean' | 'Under Review' | 'Flagged' | 'Blacklisted';
  trackingId: string;
  recentSpeed: number;
  isSimulated: true;
}

export interface PersonRecord {
  personId: string;
  name: string;
  role: 'Pedestrian' | 'Rider' | 'Pillion Passenger' | 'Driver';
  gender: string;
  estimatedAge: string;
  firstSeen: string;
  lastSeen: string;
  associatedVehicles: string[];
  totalDetections: number;
  status: 'Normal' | 'Flagged Violation' | 'Under Review';
  isSimulated: true;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  fps: number;
  resolution: string;
  totalDetectionsToday: number;
  violationsDetectedToday: number;
  streamUrl?: string;
}

export interface SystemStats {
  totalDetections: number;
  activeIncidents: number;
  numberPlatesDetected: number;
  alertsGenerated: number;
  vehiclesTracked: number;
  highPriorityIncidents: number;
  camerasOnline: number;
  totalCameras: number;
  averageConfidence: number;
  systemStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  aiEngineStatus: 'ACTIVE' | 'STANDBY' | 'ERROR';
  detectionEngineMode: 'SIMULATION MODE' | 'MANUAL REPORTING' | 'YOLO-V8' | 'YOLO-V11';
}

export interface AppSettings {
  detectionToggles: Record<DetectionType, boolean>;
  confidenceThreshold: number;
  alertThreshold: Severity;
  simulationMode: boolean;
  autoCreateIncident: boolean;
  autoGenerateAlerts: boolean;
  playbackSpeed: number;
  soundAlerts: boolean;
  showBoundingBoxes: boolean;
  showConfidence: boolean;
  showTrackingId: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  agency?: string;
  badgeNumber?: string;
  avatarUrl?: string;
}

