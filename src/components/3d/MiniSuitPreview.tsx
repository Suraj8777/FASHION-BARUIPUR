import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { buildProceduralSuitModel } from './threeUtils';
import { ModelType } from '../../types';

interface MiniSuitPreviewProps {
  colorHex: string;
  modelType?: ModelType;
  width?: number;
  height?: number;
  interactive?: boolean;
}

export const MiniSuitPreview: React.FC<MiniSuitPreviewProps> = ({
  colorHex,
  modelType = 'two_piece',
  width = 120,
  height = 140,
  interactive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 20);
    camera.position.set(0, 0.5, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.replaceChildren(renderer.domElement);

    // Light
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(2, 3, 3);
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0x0064E0, 3.0, 6);
    rimLight.position.set(0, 1, -2);
    scene.add(rimLight);

    const { rootGroup } = buildProceduralSuitModel({
      suitColorHex: colorHex,
      roughness: 0.5,
      metalness: 0.08,
      fabricPattern: 'solid',
      modelType,
      includeClothSimulation: false,
    });

    scene.add(rootGroup);

    let isHovered = false;
    if (interactive) {
      container.addEventListener('mouseenter', () => (isHovered = true));
      container.addEventListener('mouseleave', () => (isHovered = false));
    }

    const clock = new THREE.Clock();
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      // Rotate slowly or speed up on hover
      const speed = isHovered ? 1.5 : 0.4;
      rootGroup.rotation.y += delta * speed;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      renderer.dispose();
    };
  }, [colorHex, modelType, width, height, interactive]);

  return (
    <div 
      ref={containerRef} 
      className="relative flex items-center justify-center rounded-xl overflow-hidden pointer-events-auto"
      style={{ width, height }}
    />
  );
};
