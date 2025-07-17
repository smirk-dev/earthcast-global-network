
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

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

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <group ref={nodeRef} position={[x, y, z]} onClick={handleClick}>
      {/* Main broadcast node */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhongMaterial
          color={isSelected ? "#00FFFF" : (location.isLive ? "#FF4444" : "#888888")}
          emissive={isSelected ? "#00AAAA" : (location.isLive ? "#AA0000" : "#444444")}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Pulsing ring for live broadcasts */}
      {location.isLive && (
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshPhongMaterial
            color="#FF4444"
            opacity={0.2}
            emissive="#FF4444"
            emissiveIntensity={0.3}
            transparent
          />
        </mesh>
      )}

      {/* Selection glow */}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshPhongMaterial
            color="#00FFFF"
            opacity={0.1}
            emissive="#00FFFF"
            emissiveIntensity={0.2}
            transparent
          />
        </mesh>
      )}
    </group>
  );
};

export default BroadcastNode;
