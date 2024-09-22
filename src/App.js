import earthmap1k from './earthmap1k.jpg';
import earthbump1k from './earthbump1k.jpg';
import earthcloudmap from './earthcloudmap.jpg';
import moonmap1k from './moonmap1k.jpg';
import moonbump1k from './moonbump1k.jpg';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars,Text } from '@react-three/drei';
import * as THREE from 'three';
import "./App.css";

async function fetchSatellites() {
  const response = await fetch('https://celestrak.com/NORAD/elements/gp.php?GROUP=active&FORMAT=json');
  const data = await response.json();
  console.log("Satellite data:", data); 
  return data;
}

function SpinningGlobe() {
  const globeRef = useRef();
  const cloudRef = useRef();
  const moonRef = useRef();
  const textRef = useRef();
  const [satellites, setSatellites] = useState([]);

  useEffect(() => {
    fetchSatellites().then(data => setSatellites(data)).catch(err => console.error("Failed to fetch satellites:", err));
  }, []);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.01;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.015;
    }
    if (moonRef.current) {
      moonRef.current.position.x = Math.sin(Date.now() / 1000) * 12;
      moonRef.current.position.z = Math.cos(Date.now() / 1000) * 12;
    }
  });

  const earthTexture = new THREE.TextureLoader().load(earthmap1k);
  const bumpMap = new THREE.TextureLoader().load(earthbump1k);
  const cloudMap = new THREE.TextureLoader().load(earthcloudmap);
  const moonTexture = new THREE.TextureLoader().load(moonmap1k);
  const moonBumpMap = new THREE.TextureLoader().load(moonbump1k);

  function getSatellitePositions() {
    return satellites.map((sat, index) => {
      const latitude = Math.random() * Math.PI - Math.PI / 2;
      const longitude = Math.random() * 2 * Math.PI; 

      const radius = 3.5; 
      const x = radius * Math.cos(latitude) * Math.cos(longitude);
      const y = radius * Math.sin(latitude);
      const z = radius * Math.cos(latitude) * Math.sin(longitude);
      
      return { x, y, z };
    });
  }

  const satellitePositions = getSatellitePositions();

  return (
    <>
      <Sphere ref={globeRef} args={[2, 32, 32]} scale={1}>
        <meshStandardMaterial
          attach="material"
          map={earthTexture}
          bumpMap={bumpMap}
          bumpScale={0.05}
          metalness={0.5}
          roughness={0.7}
        />
      </Sphere>
      <Sphere ref={cloudRef} args={[2.05, 32, 32]} scale={1}>
        <meshBasicMaterial
          attach="material"
          map={cloudMap}
          transparent
          opacity={0.3}
        />
      </Sphere>
      <Sphere ref={moonRef} args={[1, 32, 32]} position={[12, 0, 0]} scale={1}>
        <meshStandardMaterial
          attach="material"
          map={moonTexture}
          bumpMap={moonBumpMap}
          bumpScale={0.02}
        />
      </Sphere>
      {satellitePositions.map((pos, index) => (
        <Sphere key={index} args={[0.05, 2, 2]} position={[pos.x, pos.y, pos.z]}>
          <meshBasicMaterial attach="material" color="red" />
        </Sphere>
      ))}
       <Text ref={textRef} position={[5, 10, 26]} fontSize={1} color="white" anchorX="right" fontWeight="bold">
          AstroTrack
        </Text>
    </>
  );
}

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={7} saturation={0} fade />
      <OrbitControls />
      <SpinningGlobe />
    </Canvas>
  );
}

export default App;
