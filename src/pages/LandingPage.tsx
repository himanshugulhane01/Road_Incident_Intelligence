import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  Sparkles,
  Lock,
  Play,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Send,
  Radio,
  Sliders,
  FileText,
  UserCheck,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GradientWaves } from '../components/ui/GradientWaves';

export const LandingPage: React.FC = () => {
  const {
    setCurrentRoute,
    setIsAuthModalOpen,
    setAuthMode,
    runDemoScenario,
    stats,
    isAuthenticated,
    logout,
    login,
    signup,
  } = useApp();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAgency, setContactAgency] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Inline Auth section state
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [loginEmail, setLoginEmail] = useState('alex.vance@traffic.gov.in');
  const [loginPass, setLoginPass] = useState('password123');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupAgency, setSignupAgency] = useState('');
  const [signupBadge, setSignupBadge] = useState('');

  // Animated canvas preview for traffic simulation
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [detectedPlate, setDetectedPlate] = useState('MH-12-AB-9842');
  const [speedReading, setSpeedReading] = useState(84);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const plates = ['MH-12-AB-9842', 'KA-01-EQ-4091', 'DL-03-[#]-7721', 'GJ-06-XX-1102'];

    const render = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      // Road background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Road perspective lanes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.2, 0); ctx.lineTo(w * 0.05, h);
      ctx.moveTo(w * 0.5, 0); ctx.lineTo(w * 0.5, h);
      ctx.moveTo(w * 0.8, 0); ctx.lineTo(w * 0.95, h);
      ctx.stroke();

      // Dashed lane marks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.setLineDash([15, 15]);
      ctx.lineDashOffset = -t * 40;
      ctx.beginPath();
      ctx.moveTo(w * 0.35, 0); ctx.lineTo(w * 0.27, h);
      ctx.moveTo(w * 0.65, 0); ctx.lineTo(w * 0.73, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Vehicle 1: Car moving forward
      const car1Y = ((t * 120) % (h + 80)) - 40;
      const car1X = w * 0.32;

      ctx.fillStyle = '#ff5722';
      ctx.beginPath();
      ctx.roundRect(car1X - 25, car1Y - 45, 50, 90, 8);
      ctx.fill();

      // Vehicle Windshield
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(car1X - 20, car1Y - 25, 40, 20);

      // Bounding Box 1 (Overspeed Violation)
      ctx.strokeStyle = '#ff3838';
      ctx.lineWidth = 2;
      ctx.strokeRect(car1X - 32, car1Y - 52, 64, 104);

      // Bounding Box Tag
      ctx.fillStyle = '#ff3838';
      ctx.fillRect(car1X - 32, car1Y - 72, 100, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillText('OVERSPEED 84 km/h', car1X - 28, car1Y - 58);

      // Vehicle 2: Motorcycle
      const bikeY = (((t + 1.2) * 140) % (h + 80)) - 40;
      const bikeX = w * 0.68;

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(bikeX - 12, bikeY - 25, 24, 50, 6);
      ctx.fill();

      // Bounding box 2 (OCR Plate)
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.strokeRect(bikeX - 18, bikeY - 32, 36, 64);

      ctx.fillStyle = '#22c55e';
      ctx.fillRect(bikeX - 18, bikeY - 50, 90, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillText('OCR MATCH 99%', bikeX - 14, bikeY - 37);

      // Scanning radar beam effect
      const scanY = ((t * 80) % h);
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY);
      grad.addColorStop(0, 'rgba(255, 87, 34, 0)');
      grad.addColorStop(1, 'rgba(255, 87, 34, 0.25)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 30, w, 30);
      ctx.strokeStyle = 'rgba(255, 87, 34, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY); ctx.lineTo(w, scanY);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    // Rotate simulated speed and plate
    const plateInterval = setInterval(() => {
      setDetectedPlate(plates[Math.floor(Math.random() * plates.length)]);
      setSpeedReading(Math.floor(75 + Math.random() * 25));
    }, 2500);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(plateInterval);
    };
  }, []);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginEmail, loginPass);
    setCurrentRoute('dashboard');
  };

  const handleInlineSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signup(
      signupName || 'Officer Sarah Connor',
      signupEmail || 'sarah.c@traffic.gov.in',
      signupPass || 'password123',
      signupAgency || 'Traffic Enforcement'
    );
    setCurrentRoute('dashboard');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactName('');
      setContactEmail('');
      setContactAgency('');
      setContactMsg('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#B3B3B3] text-[#1C1917] select-none font-sans overflow-x-hidden">
      {/* Top Floating Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/5 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentRoute('landing')}>
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #FF7043, #FF5722)' }}
            >
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-xl text-[#1C1917]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ROADGUARD <span style={{ color: '#FF5722' }}>AI</span>
              </span>
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FFF0E6] text-[#FF5722] border border-[#FF5722]/20">
                v2.6 PLATFORM
              </span>
            </div>
          </div>

          {/* Section Jump Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-extrabold text-[#57534E]">
            <a href="#features" className="hover:text-[#FF5722] transition-colors">Features</a>
            <a href="#neural-ocr" className="hover:text-[#FF5722] transition-colors">Neural OCR</a>
            <a href="#agency-control" className="hover:text-[#FF5722] transition-colors">Agency Control</a>
            <a href="#contact" className="hover:text-[#FF5722] transition-colors">Contact Us</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenAuth('login')}
              className="btn-ghost flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>LOG IN</span>
            </button>

            <button
              onClick={() => handleOpenAuth('signup')}
              className="btn-ghost flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold bg-[#1C1917]/5 hover:bg-[#FF5722] hover:text-white border border-black/10 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>CREATE ACCOUNT</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden grid-bg">
        {/* Ambient WebGL 3D Wave Layer */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <GradientWaves
            horizonColor="#FF7043"
            waveColor="#FF5722"
            crestColor="#FFFFFF"
            speed={0.35}
            amplitude={2.2}
            waveScale={0.5}
            waveRatio={0.8}
            swell={30}
            turbulence={18}
            tilt={1.05}
            zoom={1.0}
            height={5.0}
            fogDepth={14}
            detail="medium"
            brightness={1.0}
            opacity={0.7}
            mouseInteraction={true}
            parallaxStrength={0.4}
            grain={true}
            grainIntensity={0.03}
          />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FFF0E6] border border-[#FF5722]/30 text-[#FF5722] text-xs font-extrabold shadow-xs">
              <Zap className="w-4 h-4 fill-[#FF5722]" />
              <span>NEXT-GEN AI TRAFFIC PERCEPTION & ENFORCEMENT</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-[#1C1917] leading-[1.1] tracking-tight">
              AI-Powered <span className="bg-gradient-to-r from-[#FF7043] to-[#FF5722] bg-clip-text text-transparent">Road Incident Intelligence</span>
            </h1>

            <p className="text-base md:text-lg text-[#57534E] font-medium leading-relaxed max-w-2xl">
              Automated computer vision pipeline detecting helmet violations, triple riding, overspeeding, red-light runs, and OCR plate extraction in real-time across urban CCTV camera networks.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  runDemoScenario();
                  setCurrentRoute('dashboard');
                }}
                className="btn-primary px-8 py-4 rounded-2xl text-sm font-extrabold flex items-center gap-3 shadow-xl hover:scale-105"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>EXPLORE COMMAND CENTER</span>
              </button>

              <button
                onClick={() => setCurrentRoute('live-monitoring')}
                className="btn-ghost px-7 py-4 rounded-2xl text-sm font-extrabold flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-[#FF5722]" />
                <span>LIVE PERCEPTION MONITOR</span>
              </button>
            </div>

            {/* Micro Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-extrabold text-[#78716C]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                <span>YOLO-v11 Neural Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                <span>98.4% OCR License Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                <span>&lt;45ms Latency</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Traffic Video & AI Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 bg-white rounded-3xl p-5 shadow-2xl border border-white/90 space-y-4">
              {/* Header & Source Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E3DD]">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#0284C7] animate-pulse" />
                  <span className="text-xs font-extrabold uppercase text-[#1C1917]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Live CCTV Perception Feed (CAM-02)
                  </span>
                </div>
                <span className="badge-ok font-bold">LIVE HD VIDEO</span>
              </div>

              {/* Real Traffic Video Container */}
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-inner border border-slate-700 bg-slate-900 group">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  preload="auto"
                  className="w-full h-full object-cover"
                >
                  <source src="/VP/Video%20Project%20rii.mp4" type="video/mp4" />
                  <source src="/VP/Video Project rii.mp4" type="video/mp4" />
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-daytime-traffic-on-a-busy-city-street-40918-large.mp4" type="video/mp4" />
                </video>

                {/* AI Neural Bounding Box Overlay 1: Overspeed */}
                <div className="absolute top-12 left-16 border-2 border-[#E53935] bg-[#E53935]/20 p-2.5 rounded-xl backdrop-blur-xs text-white shadow-lg animate-pulse">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono bg-[#E53935] px-2 py-0.5 rounded text-white mb-1">
                    <span>OVERSPEED</span>
                    <span>84 KM/H</span>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-white">MH-12-AB-9842</div>
                </div>

                {/* AI Neural Bounding Box Overlay 2: OCR Plate */}
                <div className="absolute bottom-12 right-12 border-2 border-[#0284C7] bg-[#0284C7]/20 p-2.5 rounded-xl backdrop-blur-xs text-white shadow-lg">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono bg-[#0284C7] px-2 py-0.5 rounded text-white mb-1">
                    <span>OCR MATCH</span>
                    <span>99.2%</span>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-white">KA-01-EQ-4091</div>
                </div>

                {/* Top Live Stats Badges */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-[10px] font-mono font-bold flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span>SPEED SENSOR: ACTIVE</span>
                </div>

                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-[10px] font-mono font-bold">
                  30 FPS · H.264 ENCODED
                </div>
              </div>

              {/* Live Telemetry Bar */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-[#FFF0E6] border border-[#FF5722]/25">
                  <div className="text-[10px] font-extrabold text-[#78716C] uppercase">Active Incidents</div>
                  <div className="text-xl font-black text-[#FF5722] mt-0.5">0{stats.activeIncidents} Required</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#F6F4F0] border border-[#E6E3DD]">
                  <div className="text-[10px] font-extrabold text-[#78716C] uppercase">Plates Logged</div>
                  <div className="text-xl font-black text-[#1C1917] mt-0.5">{stats.numberPlatesDetected} Extracted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC STATS FLOATING CLAY CARD */}
      <section className="py-6 max-w-[1440px] mx-auto px-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-black/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#FF5722]">1,280+</div>
            <div className="text-xs font-extrabold text-[#78716C] mt-1.5 uppercase tracking-wider">Total Detections Logged</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#1C1917]">98.4%</div>
            <div className="text-xs font-extrabold text-[#78716C] mt-1.5 uppercase tracking-wider">OCR License Accuracy</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#FF5722]">&lt;45 ms</div>
            <div className="text-xs font-extrabold text-[#78716C] mt-1.5 uppercase tracking-wider">Perception Latency</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#0284C7]">24 / 7</div>
            <div className="text-xs font-extrabold text-[#78716C] mt-1.5 uppercase tracking-wider">Continuous Monitoring</div>
          </div>
        </div>
      </section>

      {/* 1. FEATURES INFO SECTION */}
      <section id="features" className="py-16 max-w-[1440px] mx-auto px-6">
        <div className="flex justify-start mb-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#0F172A] text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Back to top"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Back to Top</span>
          </button>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="badge-info font-bold">CORE CAPABILITIES</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1C1917]">
            Intelligent Traffic Enforcement Features
          </h2>
          <p className="text-sm font-semibold text-[#78716C]">
            Comprehensive multi-modal perception suite engineered for municipal traffic police and smart city control rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-black/5 hover:scale-[1.02] transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] border border-[#FF5722]/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#FF5722]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1C1917]">Automated Speed Violation Tracking</h3>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium">
              Calculates real-time vehicle pixel displacement vectors against calibrated lane distances to identify overspeeding vehicles with precise km/h telemetry.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-black/5 hover:scale-[1.02] transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEBEE] border border-[#E53935]/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#E53935]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1C1917]">Helmet & Triple Riding Detection</h3>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium">
              Detects two-wheeler riders without safety helmets and flags dangerous triple-riding violations with multi-person bounding box association.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-black/5 hover:scale-[1.02] transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3E0] border border-[#E65100]/30 flex items-center justify-center">
              <Radio className="w-6 h-6 text-[#E65100]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1C1917]">Red Light & Wrong-Side Sensors</h3>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium">
              Monitors virtual stop line boundaries and directional lane flow to immediately catch red light signal jumpers and wrong-side driving.
            </p>
          </div>
        </div>
      </section>

      {/* 2. NEURAL OCR INFO SECTION */}
      <section id="neural-ocr" className="py-12 max-w-[1440px] mx-auto px-6">
        <div className="flex justify-start mb-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#0F172A] text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Back to top"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Back to Top</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-black/5 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="badge-warning font-bold">NEURAL PERCEPTION</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1C1917] leading-tight">
              High-Precision Optical Character Recognition (OCR) Engine
            </h2>
            <p className="text-sm text-[#57534E] font-medium leading-relaxed">
              Our neural OCR system pipeline combines deep convolutional detection (YOLO-v11) with adaptive CLAHE image enhancement and CRNN sequence modeling to read standard and non-standard license plates even in low light, rain, or motion blur.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F6F4F0] border border-[#E6E3DD]">
                <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#FF5722] font-black flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1917]">Plate Bounding Box Isolation</h4>
                  <p className="text-xs text-[#78716C] mt-0.5">Isolates vehicle license plate sub-rectangles across multi-lane streams in real-time.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F6F4F0] border border-[#E6E3DD]">
                <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#FF5722] font-black flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1917]">Contrast & Dewarp Enhancement</h4>
                  <p className="text-xs text-[#78716C] mt-0.5">Applies histogram equalization and perspective correction to fix angled or dirty plates.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F6F4F0] border border-[#E6E3DD]">
                <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#FF5722] font-black flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1917]">Blacklist & Stolen Database Lookup</h4>
                  <p className="text-xs text-[#78716C] mt-0.5">Instantly checks extracted alphanumeric strings against hotlists and triggers priority alerts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[#F6F4F0] p-6 rounded-3xl border border-[#E6E3DD] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#1C1917]">OCR Inspection Feed</span>
                <span className="badge-ok">98.4% ACCURACY</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E6E3DD] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#78716C]">Extracted Text:</span>
                  <span className="font-mono text-sm text-[#FF5722]">MH-12-AB-9842</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#78716C]">Vehicle Type:</span>
                  <span className="text-[#1C1917]">Sedan (Black)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#78716C]">Blacklist Status:</span>
                  <span className="text-[#E53935] font-extrabold">FLAGGED (Unpaid Fines)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF0E6] border border-[#FF5722]/30 text-xs font-bold text-[#FF5722] flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Automatic e-Challan dispatch queued for MH-12-AB-9842</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AGENCY CONTROL INFO SECTION */}
      <section id="agency-control" className="py-12 max-w-[1440px] mx-auto px-6">
        <div className="flex justify-start mb-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#0F172A] text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Back to top"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Back to Top</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-black/5 text-center space-y-6">
          <span className="badge-warning font-bold">SMART CITY INTEGRATION</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1C1917] max-w-3xl mx-auto">
            Built for Traffic Police & Command Control Rooms
          </h2>
          <p className="text-sm md:text-base text-[#57534E] max-w-2xl mx-auto font-medium">
            Deploy on-premise edge servers or cloud infrastructure. Connects seamlessly with existing IP CCTV camera networks via RTSP.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 text-left">
            <div className="p-6 rounded-3xl bg-[#F6F4F0] border border-[#E6E3DD] space-y-2">
              <div className="text-sm font-extrabold text-[#FF5722]">RTSP Stream Support</div>
              <p className="text-xs text-[#78716C] font-medium">Connects up to 256 concurrent H.264/H.265 CCTV feeds.</p>
            </div>
            <div className="p-6 rounded-3xl bg-[#F6F4F0] border border-[#E6E3DD] space-y-2">
              <div className="text-sm font-extrabold text-[#FF5722]">Role-Based Access</div>
              <p className="text-xs text-[#78716C] font-medium">Distinct permissions for Commanders, Analysts, and Field Officers.</p>
            </div>
            <div className="p-6 rounded-3xl bg-[#F6F4F0] border border-[#E6E3DD] space-y-2">
              <div className="text-sm font-extrabold text-[#FF5722]">Instant Push Alerts</div>
              <p className="text-xs text-[#78716C] font-medium">Sub-second WebSocket alert dispatch to field officer devices.</p>
            </div>
            <div className="p-6 rounded-3xl bg-[#F6F4F0] border border-[#E6E3DD] space-y-2">
              <div className="text-sm font-extrabold text-[#FF5722]">e-Challan API</div>
              <p className="text-xs text-[#78716C] font-medium">Direct REST integration with national traffic fine portals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT DETAILS & EMAIL IDS SECTION */}
      <section id="contact" className="py-16 max-w-[1440px] mx-auto px-6">
        <div className="flex justify-start mb-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#0F172A] text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Back to top"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Back to Top</span>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-[#FFF0E6] border border-[#FF5722]/30 text-[#FF5722] text-xs font-extrabold">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#1C1917]">
                Contact Our Agency Deployment Team
              </h2>
              <p className="text-xs md:text-sm text-[#57534E] font-medium leading-relaxed">
                Have questions about municipal deployment, RTSP camera integration, or pilot trials? Reach out directly to our enforcement coordinators.
              </p>
            </div>

            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] border border-[#FF5722]/30 flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5 text-[#FF5722]" />
                </div>
                <div>
                  <div className="font-extrabold text-[#78716C] text-xs uppercase tracking-wider">Emergency & Control Helpline</div>
                  <div className="font-mono text-base font-black text-[#1C1917] mt-0.5">1800-ROADS-AI (Toll Free)</div>
                  <div className="font-mono text-xs font-semibold text-[#57534E]">+91 (020) 2790-8842</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] border border-[#FF5722]/30 flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-5 h-5 text-[#FF5722]" />
                </div>
                <div>
                  <div className="font-extrabold text-[#78716C] text-xs uppercase tracking-wider">Official Department Email Addresses</div>
                  <div className="font-mono text-xs font-semibold text-[#1C1917] mt-1">General Inquiries: <a href="mailto:contact@roadguard.ai" className="text-[#FF5722] underline font-bold">contact@roadguard.ai</a></div>
                  <div className="font-mono text-xs font-semibold text-[#1C1917] mt-0.5">Police & Agency Sales: <a href="mailto:enforcement@roadguard.ai" className="text-[#FF5722] underline font-bold">enforcement@roadguard.ai</a></div>
                  <div className="font-mono text-xs font-semibold text-[#1C1917] mt-0.5">Technical Support: <a href="mailto:support@roadguard.ai" className="text-[#FF5722] underline font-bold">support@roadguard.ai</a></div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] border border-[#FF5722]/30 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5 text-[#FF5722]" />
                </div>
                <div>
                  <div className="font-extrabold text-[#78716C] text-xs uppercase tracking-wider">Headquarters Address</div>
                  <div className="text-xs font-semibold text-[#57534E] mt-1 leading-relaxed">
                    RoadGuard AI Control Center, Sector 4,<br />
                    Smart City Technology Park, Pune, Maharashtra 411057
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-black/5 space-y-6 shadow-xl">
              <h3 className="text-xl font-extrabold text-[#1C1917]">Send Direct Message to Control Room</h3>

              {contactSuccess && (
                <div className="p-4 rounded-2xl bg-[#E0F2FE] border border-[#0284C7]/30 text-[#0284C7] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#0284C7]" />
                  <span>Message sent successfully! Our officer team will contact you shortly.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-[#1C1917] mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Director Rajiv Sharma"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-[#1C1917] mb-1">Official Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="r.sharma@traffic.gov.in"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1C1917] mb-1">Department / Agency Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune Municipal Traffic Police"
                    value={contactAgency}
                    onChange={(e) => setContactAgency(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1C1917] mb-1">Inquiry Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your CCTV camera network or deployment requirements..."
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-extrabold shadow-lg hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>SUBMIT INQUIRY TO DEPLOYMENT TEAM</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="pt-12 mt-12 border-t border-black/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#78716C] font-semibold">
          <div>
            © 2026 RoadGuard AI Urban Intelligence. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-[#1C1917] transition-colors">Privacy Policy</a>
            <a href="#features" className="hover:text-[#1C1917] transition-colors">Terms of Enforcement</a>
            <a href="#contact" className="hover:text-[#1C1917] transition-colors">Security Compliance</a>
          </div>
        </div>
      </section>

      {/* Floating Back to Top Button */}
      <button
        id="floating-back-to-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-[#0F172A] text-white hover:bg-[#EA580C] border border-white/20 shadow-xl transition-all cursor-pointer flex items-center gap-2 group"
        title="Scroll back to top"
      >
        <ArrowUp className="w-4 h-4 text-[#EA580C] group-hover:text-white transition-colors" />
        <span className="text-xs font-bold font-mono-tech hidden sm:inline">Back to Top</span>
      </button>
    </div>
  );
};
