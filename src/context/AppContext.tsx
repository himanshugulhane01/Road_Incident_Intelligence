import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import {
  Alert,
  AppSettings,
  Camera,
  DetectionEvent,
  DetectionType,
  Incident,
  IncidentStatus,
  PersonRecord,
  Severity,
  SystemStats,
  User,
  VehicleRecord,
} from '../types';
import {
  INITIAL_CAMERAS,
  INITIAL_VEHICLES,
  INITIAL_PERSONS,
  INITIAL_INCIDENTS,
  INITIAL_ALERTS,
} from '../repositories';
import { DEMO_SCENARIO_EVENTS, globalDetectionEngine } from '../detection';
import { playAlertTone } from '../utils/helpers';

interface AppContextType {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  login: (email: string, pass: string, name?: string) => void;
  signup: (name: string, email: string, pass: string, agency?: string) => void;
  logout: () => void;
  updateUserProfile: (updated: Partial<User>) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Navigation
  currentRoute: string;
  setCurrentRoute: (route: string) => void;

  // Video State
  videoCurrentTime: number;
  setVideoCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  seekVideo: (time: number) => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  videoDuration: number;
  setVideoDuration: React.Dispatch<React.SetStateAction<number>>;
  playbackSpeed: number;
  setPlaybackSpeed: React.Dispatch<React.SetStateAction<number>>;
  videoSourceType: 'SAMPLE_CANVAS' | 'UPLOADED' | 'PRESET_CAMERA';
  uploadedVideoUrl: string | null;
  activeVideoName: string;
  activeCameraId: string;
  setUploadedVideo: (file: File) => void;
  loadSamplePreset: (presetId: string) => void;

  // AI Detection State
  isAnalysisActive: boolean;
  startAnalysis: () => void;
  pauseAnalysis: () => void;
  stopAnalysis: () => void;
  restartAnalysis: () => void;
  activeFilters: DetectionType[];
  toggleFilter: (filter: DetectionType) => void;
  clearFilters: () => void;
  setFilterExclusive: (filter: DetectionType) => void;

  // Live Streams & Events
  activeDetections: DetectionEvent[];
  detectionHistory: DetectionEvent[];
  latestOcrDetection: DetectionEvent | null;
  filteredTimelineEvents: DetectionEvent[];

  // Incidents, Alerts & Data
  incidents: Incident[];
  alerts: Alert[];
  unreadAlertCount: number;
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;

  // Entities
  vehicles: VehicleRecord[];
  persons: PersonRecord[];
  cameras: Camera[];
  toggleCameraStatus: (id: string) => void;

  // Modals & Details
  selectedVehicle: VehicleRecord | null;
  setSelectedVehicle: (vehicle: VehicleRecord | null) => void;
  selectedPerson: PersonRecord | null;
  setSelectedPerson: (person: PersonRecord | null) => void;
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;

  // Search & Global Search
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  globalSearchQuery: string;
  setGlobalSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  // Settings & Stats
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  stats: SystemStats;

  // Actions
  runDemoScenario: () => void;
  addManualIncident: (data: {
    type: DetectionType;
    title: string;
    severity: Severity;
    location: string;
    camera: string;
    numberPlate?: string;
    description: string;
    confidence: number;
  }) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  detectionToggles: {
    ALL: true,
    NUMBER_PLATE: true,
    HELMET: true,
    NO_HELMET: true,
    TRIPLE_RIDING: true,
    OVERSPEED: true,
    WRONG_SIDE: true,
    RED_LIGHT_VIOLATION: true,
    ACCIDENT: true,
    SUSPICIOUS_VEHICLE: true,
    VEHICLE: true,
    PERSON: true,
  },
  confidenceThreshold: 75,
  alertThreshold: 'MEDIUM',
  simulationMode: true,
  autoCreateIncident: false,
  autoGenerateAlerts: false,
  playbackSpeed: 1,
  soundAlerts: false,
  showBoundingBoxes: true,
  showConfidence: true,
  showTrackingId: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth State
  const [user, setUser] = useState<User | null>({
    id: 'USR-8842',
    name: 'Cmdr. Alex Vance',
    email: 'alex.vance@traffic.gov.in',
    role: 'Central Control Officer',
    agency: 'Central Command',
    badgeNumber: 'TP-8842',
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  const login = useCallback((email: string, _pass: string, name?: string) => {
    setUser({
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || 'Cmdr. Alex Vance',
      email: email || 'alex.vance@traffic.gov.in',
      role: 'Traffic Control Officer',
      agency: 'Central Command',
      badgeNumber: 'TP-8842',
    });
  }, []);

  const signup = useCallback((name: string, email: string, _pass: string, agency?: string) => {
    setUser({
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || 'Officer Sarah Connor',
      email: email || 'sarah.c@traffic.gov.in',
      role: 'Registered Enforcement Officer',
      agency: agency || 'Traffic Enforcement',
      badgeNumber: 'TP-9921',
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentRoute('landing');
  }, []);

  const updateUserProfile = useCallback((updatedData: Partial<User>) => {
    setUser((prev) => {
      const current = prev || {
        id: 'USR-8842',
        name: 'Cmdr. Alex Vance',
        email: 'alex.vance@traffic.gov.in',
        role: 'Central Control Officer',
        agency: 'Central Command',
        badgeNumber: 'TP-8842',
      };
      return { ...current, ...updatedData };
    });
  }, []);

  // Navigation
  const [currentRoute, setCurrentRoute] = useState<string>('landing');

  // Video State
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(60);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeCameraId, setActiveCameraId] = useState<string>('CAM-01');
  const [videoSourceType, setVideoSourceType] = useState<'SAMPLE_CANVAS' | 'UPLOADED' | 'PRESET_CAMERA'>('PRESET_CAMERA');
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>('/VP/Video Project rii.mp4');
  const [activeVideoName, setActiveVideoName] = useState<string>('CAM-01: Sector 4 Junction - Main Arterial Road');

  // AI Detection State
  const [isAnalysisActive, setIsAnalysisActive] = useState<boolean>(true);
  const [activeFilters, setActiveFilters] = useState<DetectionType[]>(['ALL']);

  // Repositories State
  const [detectionHistory, setDetectionHistory] = useState<DetectionEvent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(INITIAL_VEHICLES);
  const [persons, setPersons] = useState<PersonRecord[]>(INITIAL_PERSONS);
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Detail Modals
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<PersonRecord | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Processed timestamps tracked to prevent duplicate alert spam during playback
  const processedEventIds = useRef<Set<string>>(new Set());
  const seekTargetRef = useRef<number | null>(null);

  // Active detections matching current video timestamp
  const [activeDetections, setActiveDetections] = useState<DetectionEvent[]>([]);
  const [latestOcrDetection, setLatestOcrDetection] = useState<DetectionEvent | null>(
    DEMO_SCENARIO_EVENTS.find((e) => e.type === 'NUMBER_PLATE') || null
  );

  // Filter handler
  const toggleFilter = useCallback((filter: DetectionType) => {
    if (filter === 'ALL') {
      setActiveFilters(['ALL']);
      return;
    }

    setActiveFilters((prev) => {
      const withoutAll = prev.filter((f) => f !== 'ALL');
      if (withoutAll.includes(filter)) {
        const next = withoutAll.filter((f) => f !== filter);
        return next.length === 0 ? ['ALL'] : next;
      } else {
        return [...withoutAll, filter];
      }
    });
  }, []);

  const setFilterExclusive = useCallback((filter: DetectionType) => {
    setActiveFilters([filter]);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters(['ALL']);
  }, []);

  // Video Upload
  const setUploadedVideo = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setUploadedVideoUrl(url);
    setVideoSourceType('UPLOADED');
    setActiveVideoName(file.name);
    setVideoCurrentTime(0);
    processedEventIds.current.clear();
    setIsVideoPlaying(true);
    setIsAnalysisActive(true);
  }, []);

  const loadSamplePreset = useCallback((presetId: string) => {
    const cam = INITIAL_CAMERAS.find((c) => c.id === presetId) || INITIAL_CAMERAS[0];
    setActiveCameraId(cam.id);
    setUploadedVideoUrl('/VP/Video Project rii.mp4');
    setVideoSourceType('PRESET_CAMERA');
    setActiveVideoName(`${cam.id}: ${cam.name}`);

    // Set distinct initial camera video timestamp offsets for CAM-01, CAM-02, CAM-03, CAM-04
    const offsets: Record<string, number> = {
      'CAM-01': 0,
      'CAM-02': 14,
      'CAM-03': 28,
      'CAM-04': 42,
    };
    const targetOffset = offsets[cam.id] !== undefined ? offsets[cam.id] : 0;
    setVideoCurrentTime(targetOffset);
    seekTargetRef.current = targetOffset;
    processedEventIds.current.clear();
    setIsVideoPlaying(true);
    setIsAnalysisActive(true);
  }, []);

  // Analysis Controls
  const startAnalysis = useCallback(() => {
    setIsAnalysisActive(true);
    setIsVideoPlaying(true);
  }, []);

  const pauseAnalysis = useCallback(() => {
    setIsVideoPlaying(false);
  }, []);

  const stopAnalysis = useCallback(() => {
    setIsAnalysisActive(false);
    setIsVideoPlaying(false);
    setActiveDetections([]);
  }, []);

  const restartAnalysis = useCallback(() => {
    setVideoCurrentTime(0);
    processedEventIds.current.clear();
    setIsAnalysisActive(true);
    setIsVideoPlaying(true);
  }, []);

  const seekVideo = useCallback((time: number) => {
    setVideoCurrentTime(time);
    seekTargetRef.current = time;
  }, []);

  // Triggered dynamically as playback advances — shows bounding boxes only (no auto alerts)
  useEffect(() => {
    if (!isAnalysisActive) {
      setActiveDetections([]);
      return;
    }

    // Get visible bounding boxes from Detection Engine
    const currentEvents = globalDetectionEngine.getEventsForTimestamp(
      videoCurrentTime,
      activeFilters.includes('ALL') ? undefined : activeFilters
    );
    setActiveDetections(currentEvents);

    // Update OCR view if a plate event is active
    const plateEvent = currentEvents.find((e) => e.type === 'NUMBER_PLATE');
    if (plateEvent) {
      setLatestOcrDetection(plateEvent);
    }
  }, [videoCurrentTime, isAnalysisActive, activeFilters]);

  // Alert Actions
  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'DISMISSED' } : a))
    );
  }, []);

  const updateIncidentStatus = useCallback((id: string, status: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status } : inc))
    );
  }, []);

  const toggleCameraStatus = useCallback((id: string) => {
    setCameras((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE' }
          : c
      )
    );
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const addManualIncident = useCallback((data: {
    type: DetectionType;
    title: string;
    severity: Severity;
    location: string;
    camera: string;
    numberPlate?: string;
    description: string;
    confidence: number;
  }) => {
    const newIncidentId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAlertId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const newIncident: Incident = {
      id: newIncidentId,
      type: data.type,
      title: data.title,
      severity: data.severity,
      timestamp: now,
      videoTimestampSec: 0,
      camera: data.camera,
      location: data.location,
      numberPlate: data.numberPlate || undefined,
      confidence: data.confidence,
      status: 'NEW',
      description: data.description,
      isSimulated: false,
    };

    const newAlert: Alert = {
      id: newAlertId,
      priority: data.severity,
      title: data.title,
      message: `${data.description} Camera: ${data.camera}`,
      timestamp: now,
      videoTimestampSec: 0,
      sourceCamera: data.camera,
      detectionType: data.type,
      confidence: data.confidence,
      status: 'UNREAD',
      numberPlate: data.numberPlate || undefined,
      incidentId: newIncidentId,
      isSimulated: false,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setAlerts((prev) => [newAlert, ...prev]);

    if (settings.soundAlerts) {
      playAlertTone(data.severity);
    }
  }, [settings.soundAlerts]);

  const runDemoScenario = useCallback(() => {
    setVideoCurrentTime(0);
    processedEventIds.current.clear();
    setIsVideoPlaying(true);
    setIsAnalysisActive(true);
    setCurrentRoute('live-monitoring');
  }, []);

  // Filtered timeline events
  const filteredTimelineEvents = DEMO_SCENARIO_EVENTS.filter((evt) => {
    if (activeFilters.includes('ALL') || activeFilters.length === 0) return true;
    return activeFilters.includes(evt.type);
  });

  const unreadAlertCount = alerts.filter((a) => a.status === 'UNREAD').length;

  // Calculated Dynamic Statistics
  const stats: SystemStats = {
    totalDetections: detectionHistory.length,
    activeIncidents: incidents.filter((i) => i.status === 'NEW' || i.status === 'REVIEWING').length,
    numberPlatesDetected: incidents.filter((i) => i.numberPlate).length,
    alertsGenerated: alerts.length,
    vehiclesTracked: vehicles.length,
    highPriorityIncidents: incidents.filter((i) => i.severity === 'HIGH' || i.severity === 'CRITICAL').length,
    camerasOnline: cameras.filter((c) => c.status === 'ONLINE').length,
    totalCameras: cameras.length,
    averageConfidence: incidents.length > 0
      ? Math.round(incidents.reduce((sum, i) => sum + i.confidence, 0) / incidents.length * 10) / 10
      : 0,
    systemStatus: 'ONLINE',
    aiEngineStatus: isAnalysisActive ? 'ACTIVE' : 'STANDBY',
    detectionEngineMode: 'MANUAL REPORTING',
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        signup,
        logout,
        updateUserProfile,
        isEditProfileOpen,
        setIsEditProfileOpen,
        currentRoute,
        setCurrentRoute,
        videoCurrentTime,
        setVideoCurrentTime,
        seekVideo,
        isVideoPlaying,
        setIsVideoPlaying,
        videoDuration,
        setVideoDuration,
        playbackSpeed,
        setPlaybackSpeed,
        videoSourceType,
        uploadedVideoUrl,
        activeVideoName,
        activeCameraId,
        setUploadedVideo,
        loadSamplePreset,
        isAnalysisActive,
        startAnalysis,
        pauseAnalysis,
        stopAnalysis,
        restartAnalysis,
        activeFilters,
        toggleFilter,
        clearFilters,
        setFilterExclusive,
        activeDetections,
        detectionHistory,
        latestOcrDetection,
        filteredTimelineEvents,
        incidents,
        alerts,
        unreadAlertCount,
        acknowledgeAlert,
        dismissAlert,
        updateIncidentStatus,
        vehicles,
        persons,
        cameras,
        toggleCameraStatus,
        selectedVehicle,
        setSelectedVehicle,
        selectedPerson,
        setSelectedPerson,
        selectedIncident,
        setSelectedIncident,
        isSearchOpen,
        setIsSearchOpen,
        globalSearchQuery,
        setGlobalSearchQuery,
        settings,
        updateSettings,
        stats,
        runDemoScenario,
        addManualIncident,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
