import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Floating3DElements: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.replaceChildren(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const blueLight = new THREE.PointLight(0x0064E0, 4, 10);
    blueLight.position.set(2, 2, 2);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x00D2FF, 3, 10);
    cyanLight.position.set(-2, -2, 2);
    scene.add(cyanLight);

    // 1. Meta Floating Ring
    const torusGeo = new THREE.TorusGeometry(1.2, 0.08, 16, 64);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x0064E0,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: false,
    });
    const ring = new THREE.Mesh(torusGeo, torusMat);
    scene.add(ring);

    // 2. Floating Luxury Cufflink Diamond Prisms
    const octaGeo = new THREE.OctahedronGeometry(0.35, 0);
    const octaMat = new THREE.MeshStandardMaterial({
      color: 0xe0e7ff,
      metalness: 0.95,
      roughness: 0.1,
    });
    const cufflink = new THREE.Mesh(octaGeo, octaMat);
    cufflink.position.set(0.9, 0.6, 0.2);
    scene.add(cufflink);

    // 3. Second accent ring
    const innerTorus = new THREE.TorusGeometry(0.7, 0.04, 16, 48);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x00D2FF,
      metalness: 0.8,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(innerTorus, innerMat);
    scene.add(ring2);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      ring.rotation.x = time * 0.4;
      ring.rotation.y = time * 0.6;

      ring2.rotation.x = -time * 0.5;
      ring2.rotation.z = time * 0.4;

      cufflink.rotation.y = time * 0.8;
      cufflink.rotation.z = time * 0.5;
      cufflink.position.y = 0.6 + Math.sin(time * 2) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={`w-full h-full pointer-events-none select-none ${className}`} />;
};
