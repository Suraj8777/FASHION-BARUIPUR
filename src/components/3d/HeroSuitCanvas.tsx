import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildProceduralSuitModel, createAtmosphericParticles } from './threeUtils';
import { RotateCw, Sun, Compass, Sparkles, Layers, Eye } from 'lucide-react';

interface HeroSuitCanvasProps {
  initialColor?: string;
  initialType?: 'two_piece' | 'three_piece' | 'tuxedo' | 'blazer' | 'bandhgala';
  onExploreCatalog?: () => void;
  onOpenCustomizer?: () => void;
}

export const HeroSuitCanvas: React.FC<HeroSuitCanvasProps> = ({
  initialColor = '#0a1d37', // Royal Meta Navy
  initialType = 'two_piece',
  onExploreCatalog,
  onOpenCustomizer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [currentModelType, setCurrentModelType] = useState(initialType);
  const [currentLighting, setCurrentLighting] = useState<'meta' | 'studio' | 'dramatic'>('meta');
  const [isRotating, setIsRotating] = useState(true);
  const [isInspectingLapel, setIsInspectingLapel] = useState(false);
  const [fabricWeave, setFabricWeave] = useState<'solid' | 'herringbone' | 'pinstripe' | 'velvet-matte'>('solid');

  // Three.js instances ref
  const threeState = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    suitGroup: THREE.Group | null;
    particles: THREE.Points | null;
    keyLight: THREE.DirectionalLight | null;
    fillLight: THREE.DirectionalLight | null;
    rimLight: THREE.PointLight | null;
    ambientLight: THREE.AmbientLight | null;
    targetRotationY: number;
    mouseTargetX: number;
    mouseTargetY: number;
    animFrameId: number | null;
    clothMesh?: THREE.Mesh;
    clock: THREE.Clock;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    suitGroup: null,
    particles: null,
    keyLight: null,
    fillLight: null,
    rimLight: null,
    ambientLight: null,
    targetRotationY: 0,
    mouseTargetX: 0,
    mouseTargetY: 0,
    animFrameId: null,
    clock: new THREE.Clock(),
  });

  // Initialize Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0d13, 0.08);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 3.8);

    // Renderer
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
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    // Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
    keyLight.position.set(3, 4, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7da4ff, 1.2);
    fillLight.position.set(-3.5, 1.5, 2);
    scene.add(fillLight);

    // Meta Blue Rim Light behind suit
    const rimLight = new THREE.PointLight(0x0064E0, 3.5, 10);
    rimLight.position.set(0, 1.2, -2.2);
    scene.add(rimLight);

    // Cyan accent light
    const cyanLight = new THREE.PointLight(0x00D2FF, 2.0, 8);
    cyanLight.position.set(2, -0.5, 1.5);
    scene.add(cyanLight);

    // Particles
    const particles = createAtmosphericParticles(160);
    scene.add(particles);

    threeState.current.renderer = renderer;
    threeState.current.scene = scene;
    threeState.current.camera = camera;
    threeState.current.particles = particles;
    threeState.current.keyLight = keyLight;
    threeState.current.fillLight = fillLight;
    threeState.current.rimLight = rimLight;
    threeState.current.ambientLight = ambientLight;

    // Mouse tilt listener
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      threeState.current.mouseTargetX = x * 0.3;
      threeState.current.mouseTargetY = y * 0.15;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !threeState.current.renderer || !threeState.current.camera) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      threeState.current.camera.aspect = newWidth / newHeight;
      threeState.current.camera.updateProjectionMatrix();
      threeState.current.renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const state = threeState.current;
      const delta = state.clock.getDelta();
      const time = state.clock.getElapsedTime();

      // Continual auto rotation
      if (state.suitGroup) {
        if (isRotating) {
          state.suitGroup.rotation.y += delta * 0.45;
        }

        // Smooth mouse tilt parallax
        state.suitGroup.rotation.x = THREE.MathUtils.lerp(state.suitGroup.rotation.x, state.mouseTargetY, 0.05);
        state.suitGroup.rotation.z = THREE.MathUtils.lerp(state.suitGroup.rotation.z, -state.mouseTargetX * 0.2, 0.05);

        // Subtle floating breathing motion
        state.suitGroup.position.y = Math.sin(time * 1.5) * 0.04;
      }

      // Rotate particle nebula
      if (state.particles) {
        state.particles.rotation.y = time * 0.08;
      }

      // Cloth waving physics simulation on swatch (if present)
      if (state.clothMesh && state.clothMesh.geometry) {
        const pos = state.clothMesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);
          const v = pos.getY(i);
          const wave = Math.sin(u * 5 + time * 3.5) * 0.04 + Math.cos(v * 4 + time * 2.8) * 0.03;
          pos.setZ(i, wave);
        }
        pos.needsUpdate = true;
        state.clothMesh.geometry.computeVertexNormals();
      }

      // Smooth camera interpolation for Lapel Close-up inspection
      if (state.camera) {
        const targetCamY = isInspectingLapel ? 0.8 : 0.4;
        const targetCamZ = isInspectingLapel ? 2.1 : 3.8;
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, 0.06);
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.06);
      }

      if (state.renderer && state.scene && state.camera) {
        state.renderer.render(state.scene, state.camera);
      }
    };

    animate();
    threeState.current.animFrameId = animId;

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isRotating, isInspectingLapel]);

  // Rebuild 3D Suit model on color/fabric/model change
  useEffect(() => {
    const state = threeState.current;
    if (!state.scene) return;

    if (state.suitGroup) {
      state.scene.remove(state.suitGroup);
    }

    const { rootGroup, clothSimulationMesh } = buildProceduralSuitModel({
      suitColorHex: currentColor,
      secondaryHex: currentColor === '#0a1d37' ? '#0064E0' : '#d4af37',
      roughness: fabricWeave === 'velvet-matte' ? 0.75 : 0.5,
      metalness: 0.08,
      fabricPattern: fabricWeave,
      modelType: currentModelType,
      includeClothSimulation: true,
    });

    state.suitGroup = rootGroup;
    state.clothMesh = clothSimulationMesh;
    state.scene.add(rootGroup);
  }, [currentColor, currentModelType, fabricWeave]);

  // Adjust Dynamic Lighting
  useEffect(() => {
    const state = threeState.current;
    if (!state.keyLight || !state.rimLight || !state.fillLight || !state.ambientLight) return;

    if (currentLighting === 'meta') {
      state.keyLight.color.set(0xf5f8ff);
      state.keyLight.intensity = 2.4;
      state.fillLight.color.set(0x0064E0);
      state.fillLight.intensity = 2.0;
      state.rimLight.color.set(0x00D2FF);
      state.rimLight.intensity = 4.0;
    } else if (currentLighting === 'studio') {
      state.keyLight.color.set(0xffffff);
      state.keyLight.intensity = 2.8;
      state.fillLight.color.set(0xe0e7ff);
      state.fillLight.intensity = 1.2;
      state.rimLight.color.set(0xffeedd);
      state.rimLight.intensity = 2.0;
    } else {
      // Dramatic Runway
      state.keyLight.color.set(0xffffff);
      state.keyLight.intensity = 4.2;
      state.fillLight.color.set(0x1e293b);
      state.fillLight.intensity = 0.4;
      state.rimLight.color.set(0x0064E0);
      state.rimLight.intensity = 5.0;
    }
  }, [currentLighting]);

  return (
    <div className="relative w-full h-[620px] md:h-[760px] lg:h-[840px] overflow-hidden flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(0,100,224,0.15),transparent_65%)]" />

      {/* 3D Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Meta-Style HUD Overlays */}
      <div className="absolute top-6 left-6 z-10 hidden sm:flex flex-col gap-2">
        <div className="glass-panel px-3.5 py-2 rounded-xl text-xs text-slate-300 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#0064E0] animate-pulse" />
          <span className="font-medium tracking-wide">3D Metaverse Atelier</span>
          <span className="text-slate-500 font-mono text-[10px]">WEBGL 2.0</span>
        </div>
      </div>

      {/* Right Controls HUD: Lighting & Inspection */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
        {/* Dynamic Lighting Switcher */}
        <div className="glass-panel p-1.5 rounded-xl flex items-center gap-1">
          <button
            onClick={() => setCurrentLighting('meta')}
            title="Meta Blue Lighting"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentLighting === 'meta'
                ? 'bg-[#0064E0] text-white shadow-[0_0_12px_rgba(0,100,224,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Metaverse
          </button>
          <button
            onClick={() => setCurrentLighting('studio')}
            title="Warm Studio Lighting"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentLighting === 'studio'
                ? 'bg-[#0064E0] text-white shadow-[0_0_12px_rgba(0,100,224,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setCurrentLighting('dramatic')}
            title="Dramatic Runway Lighting"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentLighting === 'dramatic'
                ? 'bg-[#0064E0] text-white shadow-[0_0_12px_rgba(0,100,224,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dramatic
          </button>
        </div>

        {/* Rotation & Inspection Mode Toggles */}
        <div className="glass-panel p-1.5 rounded-xl flex items-center justify-end gap-1.5">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              isRotating ? 'text-[#00D2FF] bg-white/5' : 'text-slate-400 hover:text-white'
            }`}
            title={isRotating ? 'Pause 360° Rotation' : 'Resume 360° Rotation'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span className="text-[11px] hidden md:inline">{isRotating ? 'Auto-Orbit On' : 'Orbit Paused'}</span>
          </button>

          <button
            onClick={() => setIsInspectingLapel(!isInspectingLapel)}
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              isInspectingLapel ? 'text-[#0064E0] bg-white/10' : 'text-slate-400 hover:text-white'
            }`}
            title="Inspect Pick Lapel Stitching"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden md:inline">{isInspectingLapel ? 'Zoom Out' : 'Lapel Zoom'}</span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Showroom Selector: Colors, Silhouette & Weaves */}
      <div className="absolute bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-10">
        <div className="glass-panel px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between sm:justify-center gap-3 sm:gap-6 shadow-2xl border border-white/10 max-w-2xl mx-auto">
          {/* Color Swatches */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider hidden lg:inline">Shade</span>
            {[
              { id: 'navy', color: '#0a1d37', name: 'Meta Royal Navy' },
              { id: 'black', color: '#111318', name: 'Midnight Charcoal' },
              { id: 'emerald', color: '#0a1d17', name: 'Imperial Emerald' },
              { id: 'crimson', color: '#260e16', name: 'Bengal Crimson' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCurrentColor(c.color)}
                className={`w-6 h-6 rounded-full transition-transform border ${
                  currentColor === c.color ? 'scale-125 border-white ring-2 ring-[#0064E0]' : 'border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c.color }}
                title={c.name}
              />
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Model Type Selector */}
          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl">
            <button
              onClick={() => setCurrentModelType('two_piece')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                currentModelType === 'two_piece' ? 'bg-[#0064E0] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              2-Piece Business
            </button>
            <button
              onClick={() => setCurrentModelType('tuxedo')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                currentModelType === 'tuxedo' ? 'bg-[#0064E0] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Black-Tie Tuxedo
            </button>
            <button
              onClick={() => setCurrentModelType('three_piece')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                currentModelType === 'three_piece' ? 'bg-[#0064E0] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Master 3-Piece
            </button>
          </div>

          <div className="h-4 w-px bg-white/10 hidden md:block" />

          {/* Weave Switcher */}
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Weave:</span>
            <button
              onClick={() => setFabricWeave(fabricWeave === 'solid' ? 'herringbone' : 'solid')}
              className="text-xs text-[#00D2FF] hover:underline"
            >
              {fabricWeave === 'solid' ? 'Fine Twill' : 'Herringbone'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
