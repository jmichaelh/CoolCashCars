// src/pages/ARTestDrivePage.tsx
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import './ARTestDrivePage.css';

const ARTestDrivePage: React.FC = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(ARButton.createButton(renderer));

    // Load simple car model (placeholder)
    const geometry = new THREE.BoxGeometry(1, 0.5, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x007BFF });
    const car = new THREE.Mesh(geometry, material);
    scene.add(car);
    car.position.set(0, 0, -2);

    const animate = () => {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };
    animate();

    return () => {
      renderer.setAnimationLoop(null);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="ar-container">AR Test Drive Loading...</div>;
};

export default ARTestDrivePage;
