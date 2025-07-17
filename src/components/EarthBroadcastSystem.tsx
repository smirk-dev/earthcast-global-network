
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Sphere, Html } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { Vector3, Group } from 'three';
import { useFrame } from '@react-three/fiber';
import BroadcastNode from './BroadcastNode';
import BroadcastPanel from './BroadcastPanel';
import { broadcastLocations } from '../data/broadcastData';

const Earth = () => {
  const earthRef = useRef<Group>(null);
  
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={earthRef}>
      <Sphere args={[2, 64, 64]}>
        <meshPhongMaterial
          color="#4169E1"
          transparent
          opacity={0.8}
          emissive="#001122"
          emissiveIntensity={0.2}
        />
      </Sphere>
      
      {/* Earth atmosphere glow */}
      <Sphere args={[2.05, 32, 32]}>
        <meshPhongMaterial
          color="#87CEEB"
          transparent
          opacity={0.1}
          emissive="#87CEEB"
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Continents - simplified representation */}
      <Sphere args={[2.01, 32, 32]}>
        <meshPhongMaterial
          color="#228B22"
          transparent
          opacity={0.3}
        />
      </Sphere>
    </group>
  );
};

const EarthBroadcastSystem = () => {
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 8]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Global Broadcast Network
            </h1>
            <p className="text-blue-200 mt-1">Live streams from around the world</p>
          </div>
          <div className="text-right text-blue-200">
            <div className="text-sm">Active Broadcasts</div>
            <div className="text-2xl font-bold text-cyan-400">{broadcastLocations.length}</div>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        className="absolute inset-0"
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4169E1" />

        {/* Stars background */}
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />

        {/* Earth */}
        <Earth />

        {/* Broadcast Nodes */}
        {broadcastLocations.map((location, index) => (
          <BroadcastNode
            key={index}
            location={location}
            onClick={() => setSelectedBroadcast(location)}
            isSelected={selectedBroadcast?.id === location.id}
          />
        ))}

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={4}
          maxDistance={20}
          autoRotate={false}
        />
      </Canvas>

      {/* Broadcast Details Panel */}
      {selectedBroadcast && (
        <BroadcastPanel
          broadcast={selectedBroadcast}
          onClose={() => setSelectedBroadcast(null)}
        />
      )}

      {/* Controls Help */}
      <div className="absolute bottom-6 left-6 text-blue-200 text-sm">
        <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 border border-blue-500 border-opacity-30">
          <div className="font-semibold mb-2">Controls:</div>
          <div>• Drag to rotate view</div>
          <div>• Scroll to zoom</div>
          <div>• Click nodes to view broadcasts</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 text-blue-200 text-sm">
        <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 border border-blue-500 border-opacity-30">
          <div className="font-semibold mb-2">Legend:</div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            <span>Live Broadcast</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-cyan-400 rounded-full mr-2"></div>
            <span>Selected Node</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthBroadcastSystem;
