import React, { useEffect, useRef, useState } from 'react';
import { Shield, Radio, Activity, Eye, Zap, Layers } from 'lucide-react';

interface Node3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  label: string;
  type: 'camera' | 'incident' | 'vehicle' | 'radar';
  size: number;
  color: string;
  pulseOffset: number;
}

export const ThreeDNeuralRadar: React.FC<{
  height?: number;
  className?: string;
}> = ({ height = 360, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeNode, setActiveNode] = useState<string>('CAM-NORTH-01');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  // Mouse tilt tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rotationRef = useRef({ angleY: 0, angleX: 0.2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Generate 3D Nodes around a sphere/grid
    const nodes: Node3D[] = [];
    const labels = [
      { name: 'CAM-NORTH-01', type: 'camera', color: '#38BDF8' },
      { name: 'INCIDENT-884', type: 'incident', color: '#EF4444' },
      { name: 'VEH-MH12-99', type: 'vehicle', color: '#F59E0B' },
      { name: 'RADAR-GRID-02', type: 'radar', color: '#10B981' },
      { name: 'CAM-EAST-04', type: 'camera', color: '#38BDF8' },
      { name: 'INCIDENT-902', type: 'incident', color: '#DC2626' },
      { name: 'VEH-KA04-77', type: 'vehicle', color: '#F59E0B' },
      { name: 'CAM-WEST-09', type: 'camera', color: '#38BDF8' },
      { name: 'ANALYTICS-NODE', type: 'radar', color: '#8B5CF6' },
      { name: 'CAM-SOUTH-12', type: 'camera', color: '#38BDF8' },
    ];

    const radius = 130;
    const count = labels.length;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const bx = radius * Math.cos(theta) * Math.sin(phi);
      const by = radius * Math.sin(theta) * Math.sin(phi);
      const bz = radius * Math.cos(phi);

      nodes.push({
        x: bx,
        y: by,
        z: bz,
        baseX: bx,
        baseY: by,
        baseZ: bz,
        label: labels[i].name,
        type: labels[i].type as any,
        size: labels[i].type === 'incident' ? 6 : 4,
        color: labels[i].color,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Outer floating particle ring
    const particles: { x: number; y: number; z: number; speed: number }[] = [];
    for (let p = 0; p < 60; p++) {
      const pRad = radius * (1.1 + Math.random() * 0.4);
      const pAngle = Math.random() * Math.PI * 2;
      particles.push({
        x: pRad * Math.cos(pAngle),
        y: (Math.random() - 0.5) * 160,
        z: pRad * Math.sin(pAngle),
        speed: 0.005 + Math.random() * 0.01,
      });
    }

    let time = 0;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const heightVal = containerRef.current.clientHeight;
      const cx = width / 2;
      const cy = heightVal / 2;

      ctx.clearRect(0, 0, width, heightVal);

      time += 0.02;

      // Smooth mouse inertia
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (isRotating) {
        rotationRef.current.angleY += 0.006;
      }

      const rotY = rotationRef.current.angleY + mouseRef.current.x * 0.8;
      const rotX = rotationRef.current.angleX + mouseRef.current.y * 0.5;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // 1. Draw 3D Grid Rings / Orbitals
      const ringRadii = [80, 130, 170];
      ringRadii.forEach((r, idx) => {
        ctx.beginPath();
        const steps = 60;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          let rx = r * Math.cos(theta);
          let ry = 0;
          let rz = r * Math.sin(theta);

          // Rotate X
          const y1 = ry * cosX - rz * sinX;
          const z1 = ry * sinX + rz * cosX;
          // Rotate Y
          const x2 = rx * cosY + z1 * sinY;
          const z2 = -rx * sinY + z1 * cosY;

          const fov = 400;
          const scale = fov / (fov + z2);
          const px = cx + x2 * scale;
          const py = cy + y1 * scale;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = idx === 1 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(148, 163, 184, 0.12)';
        ctx.lineWidth = idx === 1 ? 1.5 : 1;
        ctx.setLineDash(idx === 1 ? [4, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 2. Project & Sort 3D Nodes by depth (Z)
      const projectedNodes = nodes.map((node) => {
        // Rotate around X axis
        const y1 = node.baseY * cosX - node.baseZ * sinX;
        const z1 = node.baseY * sinX + node.baseZ * cosX;
        // Rotate around Y axis
        const x2 = node.baseX * cosY + z1 * sinY;
        const z2 = -node.baseX * sinY + z1 * cosY;

        const fov = 400;
        const scale = fov / (fov + z2);
        const px = cx + x2 * scale;
        const py = cy + y1 * scale;

        return { ...node, px, py, scale, z: z2 };
      });

      projectedNodes.sort((a, b) => b.z - a.z);

      // 3. Draw Connecting Neural Lasers / Edges
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          const dist = Math.hypot(n1.px - n2.px, n1.py - n2.py);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25 * Math.min(n1.scale, n2.scale);
            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 4. Draw Floating Particles
      particles.forEach((pt) => {
        pt.z += Math.sin(time + pt.x) * 0.2;
        const y1 = pt.y * cosX - pt.z * sinX;
        const z1 = pt.y * sinX + pt.z * cosX;
        const x2 = pt.x * cosY + z1 * sinY;
        const z2 = -pt.x * sinY + z1 * cosY;

        const scale = 400 / (400 + z2);
        const px = cx + x2 * scale;
        const py = cy + y1 * scale;

        ctx.beginPath();
        ctx.arc(px, py, 1.2 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 88, 12, ${0.4 * scale})`;
        ctx.fill();
      });

      // 5. Draw 3D Scanning Radar Line
      const sweepAngle = time * 1.5;
      const sweepX = cx + Math.cos(sweepAngle) * 160;
      const sweepY = cy + Math.sin(sweepAngle) * 70;
      const grad = ctx.createLinearGradient(cx, cy, sweepX, sweepY);
      grad.addColorStop(0, 'rgba(234, 88, 12, 0.4)');
      grad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 6. Draw 3D Nodes with Glow & Pulsing Rings
      projectedNodes.forEach((n) => {
        const pulse = Math.sin(time * 3 + n.pulseOffset) * 0.5 + 0.5;
        const rSize = n.size * n.scale;

        // Glowing outer pulse
        ctx.beginPath();
        ctx.arc(n.px, n.py, rSize + pulse * 6, 0, Math.PI * 2);
        ctx.fillStyle = n.color.replace('rgb', 'rgba').replace(')', `, ${0.15 * n.scale})`);
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(n.px, n.py, Math.max(2, rSize), 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 10 * n.scale;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label tag
        if (n.scale > 0.85) {
          ctx.font = `${Math.round(10 * n.scale)}px "JetBrains Mono", monospace`;
          ctx.fillStyle = n.z < 0 ? '#0F172A' : '#475569';
          ctx.fillText(n.label, n.px + 8, n.py + 3);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isRotating]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-2xl text-white select-none ${className}`}
      style={{ height }}
    >
      {/* 3D Canvas Context */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Futuristic HUD Overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-3 bg-[#0F172A]/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#334155]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
        <span className="text-xs font-mono-tech font-bold text-[#F8FAFC] tracking-wider flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
          3D NEURAL PERCEPTION RADAR
        </span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech font-semibold transition-all border ${
            isRotating
              ? 'bg-[#EA580C] text-white border-[#C2410C]'
              : 'bg-[#1E293B] text-[#CBD5E1] border-[#334155] hover:bg-[#334155]'
          }`}
        >
          {isRotating ? '⏸ 3D ROTATE' : '▶ RESUME'}
        </button>
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 bg-[#0F172A]/85 backdrop-blur-md p-3 rounded-xl border border-[#334155]">
        <div className="flex items-center gap-4 text-xs font-mono-tech">
          <div className="flex items-center gap-1.5 text-[#38BDF8]">
            <Eye className="w-3.5 h-3.5" />
            <span>NODES: 10 ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#EF4444]">
            <Activity className="w-3.5 h-3.5" />
            <span>LATENCY: 12ms</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-tech text-[#CBD5E1]">
          <Zap className="w-3.5 h-3.5 text-[#EA580C]" />
          <span>INTERACTIVE 3D ROTATE & TILT</span>
        </div>
      </div>
    </div>
  );
};
