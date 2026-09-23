import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildProceduralSuitModel, createAtmosphericParticles } from './threeUtils';
import { ProductColor, FabricOption, ModelType } from '../../types';
import { 
  Rotate3d, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Sparkles, 
  Waves, 
  Focus, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  RefreshCcw,
  Check
} from 'lucide-react';

interface ProductSuitViewerProps {
  color: ProductColor;
  fabric: FabricOption;
  modelType: ModelType;
  productName: string;
  onOpenVirtualTryOn?: () => void;
}

export const ProductSuitViewer: React.FC<ProductSuitViewerProps> = ({
  color,
  fabric,
  modelType,
  productName,
  onOpenVirtualTryOn,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'natural' | 'dramatic' | 'neon'>('neon');
  const [activeCameraView, setActiveCameraView] = useState<'front' | 'lapel' | 'side' | 'back' | 'full'>('front');
  const [clothPhysicsActive, setClothPhysicsActive] = useState(true);
  const [slowMotionFlow, setSlowMotionFlow] = useState(false);
  const [stitchingGlow, setStitchingGlow] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Three.js refs
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    suitGroup: THREE.Group | null;
    clothMesh?: THREE.Mesh;
    particles?: THREE.Points;
    keyLight: THREE.DirectionalLight | null;
    fillLight: THREE.DirectionalLight | null;
    rimLight: THREE.PointLight | null;
    ambientLight: THREE.AmbientLight | null;
    isDragging: boolean;
    prevMousePos: { x: number; y: number };
    currentRotation: { x: number; y: number };
    targetRotation: { x: number; y: number };
    targetCameraPos: THREE.Vector3;
    clock: THREE.Clock;
    animFrameId: number | null;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    suitGroup: null,
    keyLight: null,
    fillLight: null,
    rimLight: null,
    ambientLight: null,
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    currentRotation: { x: 0, y: 0 },
    targetRotation: { x: 0, y: 0 },
    targetCameraPos: new THREE.Vector3(0, 0.4, 3.4),
    clock: new THREE.Clock(),
    animFrameId: null,
  });

  // Hotspots definition for tailored suit
  const HOTSPOTS = [
    {
      id: 'lapel',
      title: 'Hand-basted Pick Lapel',
      desc: 'Silk buttonhole thread hand-stitched by Baruipur master artisans.',
      coords: { x: -0.22, y: 0.85, z: 0.22 },
    },
    {
      id: 'chest',
      title: 'Floating Horsehair Canvas',
      desc: 'Free-floating internal horsehair canvas conforms naturally to your body over time.',
      coords: { x: 0.0, y: 0.65, z: 0.24 },
    },
    {
      id: 'buttons',
      title: 'Genuine Horn Buttons',
      desc: 'Carved natural horn with criss-cross security anchor stitching.',
      coords: { x: 0.01, y: 0.48, z: 0.24 },
    },
    {
      id: 'cuff',
      title: 'Working Surgeon Cuffs',
      desc: 'Four overlapping kissing buttons with functional buttonholes for authentic bespoke tailoring.',
      coords: { x: -0.58, y: 0.25, z: 0.05 },
    },
  ];

  // Initialize Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0d13, 0.06);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 3.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.replaceChildren(renderer.domElement);

    // Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.5);
    keyLight.position.set(3, 4, 3.5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x0064E0, 1.8);
    fillLight.position.set(-3.5, 1.5, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00D2FF, 3.5, 8);
    rimLight.position.set(0, 1.5, -2.5);
    scene.add(rimLight);

    // Particles
    const particles = createAtmosphericParticles(100);
    scene.add(particles);

    stateRef.current.renderer = renderer;
    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.particles = particles;
    stateRef.current.keyLight = keyLight;
    stateRef.current.fillLight = fillLight;
    stateRef.current.rimLight = rimLight;
    stateRef.current.ambientLight = ambientLight;

    // Mouse drag controls
    const onMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      const deltaX = e.clientX - stateRef.current.prevMousePos.x;
      const deltaY = e.clientY - stateRef.current.prevMousePos.y;
      stateRef.current.targetRotation.y += deltaX * 0.008;
      stateRef.current.targetRotation.x = Math.max(-0.4, Math.min(0.4, stateRef.current.targetRotation.x + deltaY * 0.005));
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = stateRef.current.camera;
      if (!cam) return;
      const newZ = Math.max(1.5, Math.min(5.0, cam.position.z + e.deltaY * 0.002));
      stateRef.current.targetCameraPos.z = newZ;
    };

    // Touch support for mobile 3D interaction
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        stateRef.current.isDragging = true;
        stateRef.current.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!stateRef.current.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - stateRef.current.prevMousePos.x;
      const deltaY = e.touches[0].clientY - stateRef.current.prevMousePos.y;
      stateRef.current.targetRotation.y += deltaX * 0.01;
      stateRef.current.targetRotation.x = Math.max(-0.4, Math.min(0.4, stateRef.current.targetRotation.x + deltaY * 0.006));
      stateRef.current.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      stateRef.current.isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize
    const handleResize = () => {
      if (!containerRef.current || !stateRef.current.renderer || !stateRef.current.camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      stateRef.current.camera.aspect = w / h;
      stateRef.current.camera.updateProjectionMatrix();
      stateRef.current.renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const state = stateRef.current;
      const delta = state.clock.getDelta();
      const timeMultiplier = slowMotionFlow ? 0.35 : 1.0;
      const time = state.clock.getElapsedTime() * timeMultiplier;

      // Smooth rotation damping
      state.currentRotation.x = THREE.MathUtils.lerp(state.currentRotation.x, state.targetRotation.x, 0.08);
      state.currentRotation.y = THREE.MathUtils.lerp(state.currentRotation.y, state.targetRotation.y, 0.08);

      if (state.suitGroup) {
        state.suitGroup.rotation.x = state.currentRotation.x;
        state.suitGroup.rotation.y = state.currentRotation.y;
      }

      // Smooth camera position interpolation
      if (state.camera) {
        state.camera.position.lerp(state.targetCameraPos, 0.06);
      }

      // Dynamic Cloth Physics Simulation on the Fabric Swatch
      if (clothPhysicsActive && state.clothMesh && state.clothMesh.geometry) {
        const pos = state.clothMesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);
          const v = pos.getY(i);
          // Realistic wave equation with multi-frequency ripples
          const wave = Math.sin(u * 6 + time * 3) * 0.05 + 
                       Math.cos(v * 5 + time * 2.2) * 0.04 + 
                       Math.sin((u + v) * 3 + time * 4) * 0.02;
          pos.setZ(i, wave);
        }
        pos.needsUpdate = true;
        state.clothMesh.geometry.computeVertexNormals();
      }

      if (state.particles) {
        state.particles.rotation.y = time * 0.05;
      }

      if (state.renderer && state.scene && state.camera) {
        state.renderer.render(state.scene, state.camera);
      }
    };

    animate();
    stateRef.current.animFrameId = animId;

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update 3D model when color, fabric, or modelType changes
  useEffect(() => {
    const state = stateRef.current;
    if (!state.scene) return;

    if (state.suitGroup) {
      state.scene.remove(state.suitGroup);
    }

    const { rootGroup, clothSimulationMesh, lapelMeshes } = buildProceduralSuitModel({
      suitColorHex: color.hex,
      secondaryHex: color.secondaryHex || '#0064E0',
      roughness: color.roughness,
      metalness: color.metalness,
      fabricPattern: fabric.patternType,
      modelType,
      includeClothSimulation: true,
    });

    // If stitching glow active, add subtle wireframe/glow
    if (stitchingGlow) {
      lapelMeshes.forEach(m => {
        if (m.material instanceof THREE.MeshStandardMaterial) {
          m.material.emissive = new THREE.Color(0x0064E0);
          m.material.emissiveIntensity = 0.35;
        }
      });
    }

    state.suitGroup = rootGroup;
    state.clothMesh = clothSimulationMesh;
    state.scene.add(rootGroup);
  }, [color, fabric, modelType, stitchingGlow]);

  // Adjust Camera View Preset
  const handleViewPreset = (view: 'front' | 'lapel' | 'side' | 'back' | 'full') => {
    setActiveCameraView(view);
    const state = stateRef.current;
    if (!state.camera) return;

    switch (view) {
      case 'front':
        state.targetRotation = { x: 0, y: 0 };
        state.targetCameraPos.set(0, 0.4, 3.4);
        break;
      case 'lapel':
        state.targetRotation = { x: -0.05, y: 0.15 };
        state.targetCameraPos.set(0, 0.85, 1.8);
        break;
      case 'side':
        state.targetRotation = { x: 0, y: Math.PI / 2 };
        state.targetCameraPos.set(0, 0.3, 3.3);
        break;
      case 'back':
        state.targetRotation = { x: 0, y: Math.PI };
        state.targetCameraPos.set(0, 0.3, 3.5);
        break;
      case 'full':
        state.targetRotation = { x: 0, y: 0 };
        state.targetCameraPos.set(0, 0.0, 4.2);
        break;
    }
  };

  // Adjust Lighting Preset
  useEffect(() => {
    const state = stateRef.current;
    if (!state.keyLight || !state.rimLight || !state.fillLight || !state.ambientLight) return;

    if (lightingPreset === 'neon') {
      state.keyLight.color.set(0xf0f5ff);
      state.keyLight.intensity = 2.4;
      state.fillLight.color.set(0x0064E0);
      state.fillLight.intensity = 2.2;
      state.rimLight.color.set(0x00D2FF);
      state.rimLight.intensity = 4.2;
    } else if (lightingPreset === 'studio') {
      state.keyLight.color.set(0xffffff);
      state.keyLight.intensity = 2.8;
      state.fillLight.color.set(0xf1f5f9);
      state.fillLight.intensity = 1.4;
      state.rimLight.color.set(0xffedd5);
      state.rimLight.intensity = 2.0;
    } else if (lightingPreset === 'natural') {
      state.keyLight.color.set(0xfffaf0);
      state.keyLight.intensity = 2.0;
      state.fillLight.color.set(0xcfd8dc);
      state.fillLight.intensity = 1.0;
      state.rimLight.color.set(0xffffff);
      state.rimLight.intensity = 1.5;
    } else {
      // Dramatic
      state.keyLight.color.set(0xffffff);
      state.keyLight.intensity = 4.5;
      state.fillLight.color.set(0x0f172a);
      state.fillLight.intensity = 0.5;
      state.rimLight.color.set(0x0064E0);
      state.rimLight.intensity = 5.5;
    }
  }, [lightingPreset]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      className={`relative w-full rounded-3xl overflow-hidden glass-panel border border-white/10 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-[#0B0D13]' : 'h-[520px] md:h-[640px]'
      }`}
    >
      {/* 3D WebGL Canvas */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating Header: Live Specs and Meta Tag */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0064E0] animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-wide">{productName}</span>
          <span className="text-[10px] text-[#00D2FF] bg-[#0064E0]/20 px-2 py-0.5 rounded font-mono">
            360° INTERACTIVE
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          {fabric.name} · {color.name}
        </p>
      </div>

      {/* Top Right Tool Bar: Lighting, Fullscreen, Reset */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Dynamic Lighting Selector */}
        <div className="glass-panel p-1 rounded-xl flex items-center gap-1">
          {(['neon', 'studio', 'natural', 'dramatic'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setLightingPreset(mode)}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium capitalize transition-all ${
                lightingPreset === mode ? 'bg-[#0064E0] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl glass-button text-slate-300 hover:text-white"
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand 3D Viewport'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Left Vertical Hotspot Toggles */}
      <div className="absolute left-4 top-20 z-10 hidden sm:flex flex-col gap-2">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono pl-1">Bespoke Details</span>
        {HOTSPOTS.map((h) => (
          <button
            key={h.id}
            onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
            className={`px-2.5 py-1.5 rounded-lg text-left text-xs transition-all flex items-center gap-2 ${
              activeHotspot === h.id
                ? 'bg-[#0064E0] text-white shadow-md'
                : 'glass-panel text-slate-300 hover:bg-white/10'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
            <span className="truncate max-w-[140px]">{h.title}</span>
          </button>
        ))}
      </div>

      {/* Hotspot Info Popup Card */}
      {activeHotspot && (
        <div className="absolute left-4 bottom-24 z-20 max-w-xs glass-panel p-3.5 rounded-xl border border-[#0064E0]/40 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          {(() => {
            const h = HOTSPOTS.find((item) => item.id === activeHotspot);
            if (!h) return null;
            return (
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-white">{h.title}</span>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{h.desc}</p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Interactive 3D Video Effects: Slow-Mo, Cloth Physics & Stitching */}
      <div className="absolute right-4 top-20 z-10 flex flex-col gap-2">
        <button
          onClick={() => setClothPhysicsActive(!clothPhysicsActive)}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            clothPhysicsActive ? 'bg-[#0064E0]/30 text-[#00D2FF] border border-[#0064E0]' : 'glass-button text-slate-400'
          }`}
          title="Toggle Cloth Waving Physics"
        >
          <Waves className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden md:inline">Cloth Physics</span>
        </button>

        <button
          onClick={() => setSlowMotionFlow(!slowMotionFlow)}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            slowMotionFlow ? 'bg-[#0064E0]/30 text-[#00D2FF] border border-[#0064E0]' : 'glass-button text-slate-400'
          }`}
          title="Slow-Motion Fabric Simulation"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden md:inline">Slow-Mo Flow</span>
        </button>

        <button
          onClick={() => setStitchingGlow(!stitchingGlow)}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            stitchingGlow ? 'bg-[#0064E0] text-white' : 'glass-button text-slate-400'
          }`}
          title="Highlight Sartorial Seams"
        >
          <Focus className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden md:inline">Seam Trace</span>
        </button>

        {onOpenVirtualTryOn && (
          <button
            onClick={onOpenVirtualTryOn}
            className="p-2 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#00D2FF] text-white text-xs font-semibold shadow-lg hover:brightness-110 flex items-center gap-1.5 transition-all mt-2"
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden md:inline">Virtual Try-On</span>
          </button>
        )}
      </div>

      {/* Bottom Camera Angle Presets & Instruction Helper */}
      <div className="absolute bottom-4 inset-x-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-10 pointer-events-none">
        {/* Instruction label */}
        <div className="glass-panel px-3 py-1.5 rounded-xl text-[11px] text-slate-400 flex items-center gap-1.5 pointer-events-auto">
          <Rotate3d className="w-3.5 h-3.5 text-[#00D2FF]" />
          <span>Click & Drag to rotate · Scroll to zoom</span>
        </div>

        {/* Viewport Camera Buttons */}
        <div className="glass-panel p-1 rounded-2xl flex items-center gap-1 pointer-events-auto shadow-xl">
          {[
            { id: 'front', label: 'Front Stance' },
            { id: 'lapel', label: 'Lapel Focus' },
            { id: 'side', label: 'Profile' },
            { id: 'back', label: 'Back Cut' },
            { id: 'full', label: 'Full View' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => handleViewPreset(v.id as any)}
              className={`px-2.5 py-1 text-xs rounded-xl transition-all whitespace-nowrap ${
                activeCameraView === v.id
                  ? 'bg-[#0064E0] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {v.label}
            </button>
          ))}
          <button
            onClick={() => handleViewPreset('front')}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            title="Reset View"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
