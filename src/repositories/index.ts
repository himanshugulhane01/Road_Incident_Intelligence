import {
  Alert,
  Camera,
  DetectionEvent,
  Incident,
  PersonRecord,
  SystemStats,
  VehicleRecord,
  AppSettings,
} from '../types';

// ==========================================
// REPOSITORY INTERFACES
// (Easily swappable with MongoVehicleRepository, MongoIncidentRepository, etc.)
// ==========================================

export interface IDetectionRepository {
  getAll(): Promise<DetectionEvent[]>;
  getById(id: string): Promise<DetectionEvent | null>;
  add(event: DetectionEvent): Promise<DetectionEvent>;
  filter(predicate: (event: DetectionEvent) => boolean): Promise<DetectionEvent[]>;
  clear(): Promise<void>;
}

export interface IIncidentRepository {
  getAll(): Promise<Incident[]>;
  getById(id: string): Promise<Incident | null>;
  add(incident: Incident): Promise<Incident>;
  updateStatus(id: string, status: Incident['status']): Promise<Incident | null>;
  clear(): Promise<void>;
}

export interface IAlertRepository {
  getAll(): Promise<Alert[]>;
  getById(id: string): Promise<Alert | null>;
  add(alert: Alert): Promise<Alert>;
  acknowledge(id: string): Promise<Alert | null>;
  dismiss(id: string): Promise<Alert | null>;
  getUnreadCount(): Promise<number>;
  clear(): Promise<void>;
}

export interface IVehicleRepository {
  getAll(): Promise<VehicleRecord[]>;
  getById(id: string): Promise<VehicleRecord | null>;
  getByPlate(plate: string): Promise<VehicleRecord | null>;
  addOrUpdate(vehicle: VehicleRecord): Promise<VehicleRecord>;
}

export interface IPersonRepository {
  getAll(): Promise<PersonRecord[]>;
  getById(id: string): Promise<PersonRecord | null>;
  add(person: PersonRecord): Promise<PersonRecord>;
}

export interface ICameraRepository {
  getAll(): Promise<Camera[]>;
  getById(id: string): Promise<Camera | null>;
  updateStatus(id: string, status: Camera['status']): Promise<Camera | null>;
}

// ==========================================
// INITIAL SEED DATA (MOCK / DEMO DATA ONLY)
// ==========================================

export const INITIAL_CAMERAS: Camera[] = [
  {
    id: 'CAM-01',
    name: 'Sector 4 Junction - Main Arterial Road',
    location: 'North Intersection (Gate A)',
    status: 'ONLINE',
    fps: 30,
    resolution: '1920x1080 (1080p)',
    totalDetectionsToday: 482,
    violationsDetectedToday: 14,
  },
  {
    id: 'CAM-02',
    name: 'City Square Flyover - South Approach',
    location: 'Central Plaza Express Lane',
    status: 'ONLINE',
    fps: 30,
    resolution: '1920x1080 (1080p)',
    totalDetectionsToday: 620,
    violationsDetectedToday: 21,
  },
  {
    id: 'CAM-03',
    name: 'Highway Outer Ring Road - Mile 14',
    location: 'East Highway Corridor',
    status: 'ONLINE',
    fps: 25,
    resolution: '2560x1440 (2K)',
    totalDetectionsToday: 310,
    violationsDetectedToday: 8,
  },
  {
    id: 'CAM-04',
    name: 'University Campus Road - West Gate',
    location: 'West Pedestrian & Transit Crossing',
    status: 'ONLINE',
    fps: 30,
    resolution: '1920x1080 (1080p)',
    totalDetectionsToday: 198,
    violationsDetectedToday: 5,
  },
];

export const INITIAL_VEHICLES: VehicleRecord[] = [
  {
    vehicleId: 'VH-00281',
    numberPlate: 'MH27AB1234',
    vehicleType: 'Motorcycle',
    makeModel: 'Hero Splendor Plus',
    color: 'Midnight Black',
    firstDetected: '16 Aug 2026 08:10:14',
    lastSeen: '16 Aug 2026 09:42:18',
    totalDetections: 14,
    associatedIncidents: 2,
    status: 'Under Review',
    trackingId: 'TRK-00821',
    recentSpeed: 58,
    isSimulated: true,
  },
  {
    vehicleId: 'VH-00412',
    numberPlate: 'MH31CD7788',
    vehicleType: 'Sedan',
    makeModel: 'Honda City V',
    color: 'Platinum White',
    firstDetected: '16 Aug 2026 07:30:22',
    lastSeen: '16 Aug 2026 09:38:05',
    totalDetections: 9,
    associatedIncidents: 0,
    status: 'Clean',
    trackingId: 'TRK-00914',
    recentSpeed: 44,
    isSimulated: true,
  },
  {
    vehicleId: 'VH-00509',
    numberPlate: 'MH40EF4521',
    vehicleType: 'SUV',
    makeModel: 'Mahindra Scorpio-N',
    color: 'Deep Forest Green',
    firstDetected: '16 Aug 2026 06:45:00',
    lastSeen: '16 Aug 2026 09:20:41',
    totalDetections: 22,
    associatedIncidents: 1,
    status: 'Flagged',
    trackingId: 'TRK-00633',
    recentSpeed: 82,
    isSimulated: true,
  },
  {
    vehicleId: 'VH-00673',
    numberPlate: 'MH12KL9901',
    vehicleType: 'Motorcycle',
    makeModel: 'Bajaj Pulsar 220',
    color: 'Crimson Red',
    firstDetected: '16 Aug 2026 08:55:12',
    lastSeen: '16 Aug 2026 09:48:30',
    totalDetections: 7,
    associatedIncidents: 1,
    status: 'Under Review',
    trackingId: 'TRK-00744',
    recentSpeed: 64,
    isSimulated: true,
  },
  {
    vehicleId: 'VH-00788',
    numberPlate: 'MH14XY6543',
    vehicleType: 'Truck',
    makeModel: 'Tata Ultra T.7',
    color: 'Industrial Yellow',
    firstDetected: '16 Aug 2026 05:12:10',
    lastSeen: '16 Aug 2026 09:15:20',
    totalDetections: 18,
    associatedIncidents: 1,
    status: 'Clean',
    trackingId: 'TRK-00301',
    recentSpeed: 38,
    isSimulated: true,
  },
  {
    vehicleId: 'VH-00845',
    numberPlate: 'MH02QZ8811',
    vehicleType: 'Auto-Rickshaw',
    makeModel: 'Bajaj Compact 4S',
    color: 'Yellow & Black',
    firstDetected: '16 Aug 2026 08:00:30',
    lastSeen: '16 Aug 2026 09:50:11',
    totalDetections: 31,
    associatedIncidents: 0,
    status: 'Clean',
    trackingId: 'TRK-00512',
    recentSpeed: 32,
    isSimulated: true,
  },
];

export const INITIAL_PERSONS: PersonRecord[] = [
  {
    personId: 'DEMO-P-1021',
    name: 'Demo Rider Alpha (Simulated Record)',
    role: 'Rider',
    gender: 'Male (Est.)',
    estimatedAge: '24-30',
    firstSeen: '16 Aug 2026 08:10:14',
    lastSeen: '16 Aug 2026 09:42:18',
    associatedVehicles: ['VH-00281 (MH27AB1234)'],
    totalDetections: 8,
    status: 'Flagged Violation',
    isSimulated: true,
  },
  {
    personId: 'DEMO-P-1044',
    name: 'Demo Passenger Beta (Simulated Record)',
    role: 'Pillion Passenger',
    gender: 'Female (Est.)',
    estimatedAge: '20-26',
    firstSeen: '16 Aug 2026 08:55:12',
    lastSeen: '16 Aug 2026 09:48:30',
    associatedVehicles: ['VH-00673 (MH12KL9901)'],
    totalDetections: 5,
    status: 'Under Review',
    isSimulated: true,
  },
  {
    personId: 'DEMO-P-1089',
    name: 'Demo Pedestrian Gamma (Simulated Record)',
    role: 'Pedestrian',
    gender: 'Male (Est.)',
    estimatedAge: '35-45',
    firstSeen: '16 Aug 2026 09:05:00',
    lastSeen: '16 Aug 2026 09:45:10',
    associatedVehicles: [],
    totalDetections: 12,
    status: 'Normal',
    isSimulated: true,
  },
];

export const INITIAL_INCIDENTS: Incident[] = [];

export const INITIAL_ALERTS: Alert[] = [];

// ==========================================
// MOCK REPOSITORIES IMPLEMENTATION
// (Ready for MongoDB replacement)
// ==========================================

export class MockDetectionRepository implements IDetectionRepository {
  private events: DetectionEvent[] = [];

  async getAll(): Promise<DetectionEvent[]> {
    return [...this.events];
  }

  async getById(id: string): Promise<DetectionEvent | null> {
    return this.events.find((e) => e.id === id) || null;
  }

  async add(event: DetectionEvent): Promise<DetectionEvent> {
    this.events.unshift(event);
    return event;
  }

  async filter(predicate: (event: DetectionEvent) => boolean): Promise<DetectionEvent[]> {
    return this.events.filter(predicate);
  }

  async clear(): Promise<void> {
    this.events = [];
  }
}

export class MockIncidentRepository implements IIncidentRepository {
  private incidents: Incident[] = [...INITIAL_INCIDENTS];

  async getAll(): Promise<Incident[]> {
    return [...this.incidents];
  }

  async getById(id: string): Promise<Incident | null> {
    return this.incidents.find((inc) => inc.id === id) || null;
  }

  async add(incident: Incident): Promise<Incident> {
    this.incidents.unshift(incident);
    return incident;
  }

  async updateStatus(id: string, status: Incident['status']): Promise<Incident | null> {
    const inc = this.incidents.find((i) => i.id === id);
    if (inc) {
      inc.status = status;
      return inc;
    }
    return null;
  }

  async clear(): Promise<void> {
    this.incidents = [];
  }
}

export class MockAlertRepository implements IAlertRepository {
  private alerts: Alert[] = [...INITIAL_ALERTS];

  async getAll(): Promise<Alert[]> {
    return [...this.alerts];
  }

  async getById(id: string): Promise<Alert | null> {
    return this.alerts.find((a) => a.id === id) || null;
  }

  async add(alert: Alert): Promise<Alert> {
    this.alerts.unshift(alert);
    return alert;
  }

  async acknowledge(id: string): Promise<Alert | null> {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.status = 'ACKNOWLEDGED';
      return alert;
    }
    return null;
  }

  async dismiss(id: string): Promise<Alert | null> {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.status = 'DISMISSED';
      return alert;
    }
    return null;
  }

  async getUnreadCount(): Promise<number> {
    return this.alerts.filter((a) => a.status === 'UNREAD').length;
  }

  async clear(): Promise<void> {
    this.alerts = [];
  }
}

export class MockVehicleRepository implements IVehicleRepository {
  private vehicles: VehicleRecord[] = [...INITIAL_VEHICLES];

  async getAll(): Promise<VehicleRecord[]> {
    return [...this.vehicles];
  }

  async getById(id: string): Promise<VehicleRecord | null> {
    return this.vehicles.find((v) => v.vehicleId === id) || null;
  }

  async getByPlate(plate: string): Promise<VehicleRecord | null> {
    return (
      this.vehicles.find(
        (v) => v.numberPlate.replace(/\s+/g, '').toUpperCase() === plate.replace(/\s+/g, '').toUpperCase()
      ) || null
    );
  }

  async addOrUpdate(vehicle: VehicleRecord): Promise<VehicleRecord> {
    const idx = this.vehicles.findIndex((v) => v.vehicleId === vehicle.vehicleId || v.numberPlate === vehicle.numberPlate);
    if (idx >= 0) {
      this.vehicles[idx] = { ...this.vehicles[idx], ...vehicle };
      return this.vehicles[idx];
    } else {
      this.vehicles.unshift(vehicle);
      return vehicle;
    }
  }
}

export class MockPersonRepository implements IPersonRepository {
  private persons: PersonRecord[] = [...INITIAL_PERSONS];

  async getAll(): Promise<PersonRecord[]> {
    return [...this.persons];
  }

  async getById(id: string): Promise<PersonRecord | null> {
    return this.persons.find((p) => p.personId === id) || null;
  }

  async add(person: PersonRecord): Promise<PersonRecord> {
    this.persons.unshift(person);
    return person;
  }
}

export class MockCameraRepository implements ICameraRepository {
  private cameras: Camera[] = [...INITIAL_CAMERAS];

  async getAll(): Promise<Camera[]> {
    return [...this.cameras];
  }

  async getById(id: string): Promise<Camera | null> {
    return this.cameras.find((c) => c.id === id) || null;
  }

  async updateStatus(id: string, status: Camera['status']): Promise<Camera | null> {
    const cam = this.cameras.find((c) => c.id === id);
    if (cam) {
      cam.status = status;
      return cam;
    }
    return null;
  }
}
