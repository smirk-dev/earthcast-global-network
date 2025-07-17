
import { useRef } from 'react';
import { Html, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';

interface BroadcastNodeProps {
  location: {
    id: string;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    description: string;
    viewers: number;
    category: string;
    isLive: boolean;
  };
  onClick: () => void;
  isSelected: boolean;
}

const BroadcastNode = ({ location, onClick, isSelected }: BroadcastNodeProps) => {
  const nodeRef = useRef<Group>(null);
  const earthRadius = 2.2;

  // Convert lat/lng to 3D coordinates
  const lat = (location.latitude * Math.PI) / 180;
  const lng = (location.longitude * Math.PI) / 180;
  
  const x = earthRadius * Math.cos(lat) * Math.cos(lng);
  const y = earthRadius * Math.sin(lat);
  const z = earthRadius * Math.cos(lat) * Math.sin(lng);

  const position = new Vector3(x, y, z);

  useFrame((state) => {
    if (nodeRef.current) {
      // Gentle floating animation
      const time = state.clock.getElapsedTime();
      nodeRef.current.position.y = y + Math.sin(time * 2 + location.id.length) * 0.05;
      
      // Rotate with Earth
      const earthRotation = time * 0.1;
      const rotatedX = x * Math.cos(earthRotation) - z * Math.sin(earthRotation);
      const rotatedZ = x * Math.sin(earthRotation) + z * Math.cos(earthRotation);
      
      nodeRef.current.position.x = rotatedX;
      nodeRef.current.position.z = rotatedZ;
    }
  });

  return (
    <group ref={nodeRef} position={[x, y, z]} onClick={onClick}>
      {/* Main broadcast node */}
      <Sphere args={[0.08, 16, 16]}>
        <meshPhongMaterial
          color={isSelected ? "#00FFFF" : (location.isLive ? "#FF4444" : "#888888")}
          emissive={isSelected ? "#00AAAA" : (location.isLive ? "#AA0000" : "#444444")}
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Pulsing ring for live broadcasts */}
      {location.isLive && (
        <Sphere args={[0.12, 16, 16]}>
          <meshPhongMaterial
            color="#FF4444"
            transparent
            opacity={0.2}
            emissive="#FF4444"
            emissiveIntensity={0.3}
          />
        </Sphere>
      )}

      {/* Selection glow */}
      {isSelected && (
        <Sphere args={[0.15, 16, 16]}>
          <meshPhongMaterial
            color="#00FFFF"
            transparent
            opacity={0.1}
            emissive="#00FFFF"
            emissiveIntensity={0.2}
          />
        </Sphere>
      )}

      {/* HTML overlay for location name */}
      <Html
        position={[0, 0.15, 0]}
        center
        className="pointer-events-none"
        style={{
          transform: 'translate3d(-50%, -50%, 0)',
        }}
      >
        <div className="bg-black bg-opacity-60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs whitespace-nowrap border border-cyan-400 border-opacity-50">
          <div className="font-semibold">{location.name}</div>
          {location.isLive && (
            <div className="text-red-400 text-xs flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
              LIVE
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

export default BroadcastNode;
