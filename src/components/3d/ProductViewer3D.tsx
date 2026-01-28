import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, PresentationControls, Float, Html } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { Maximize2, RotateCcw, Move3D } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductViewer3DProps {
  imageUrl: string;
  productName: string;
}

function ProductMesh({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Load the product image as texture
  const texture = useLoader(TextureLoader, imageUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.3}
    >
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        {/* Curved panel to display the product image */}
        <planeGeometry args={[3, 4, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Decorative frame */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[3.2, 4.2, 0.08]} />
        <meshStandardMaterial
          color="#D4AC0D"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground font-sans">Loading 3D View...</span>
      </div>
    </Html>
  );
}

export default function ProductViewer3D({ imageUrl, productName }: ProductViewer3DProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const ViewerContent = () => (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} intensity={0.3} />
      
      <Suspense fallback={<LoadingSpinner />}>
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 300 }}
        >
          <ProductMesh imageUrl={imageUrl} />
        </PresentationControls>
        <Environment preset="studio" />
      </Suspense>
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );

  return (
    <>
      {/* Inline Viewer */}
      <div className="relative bg-gradient-to-br from-muted to-secondary rounded-2xl overflow-hidden shadow-luxury">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              autoRotate 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background/80 text-foreground hover:bg-background'
            }`}
            title={autoRotate ? 'Stop rotation' : 'Auto rotate'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3D Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-sans font-semibold">
          <Move3D className="w-3.5 h-3.5" />
          3D View
        </div>

        {/* Canvas Container */}
        <div className="aspect-[3/4] w-full">
          <ViewerContent />
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-xs text-muted-foreground font-sans">
          Drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-background to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-sans font-semibold">
                  <Move3D className="w-4 h-4" />
                  3D View
                </div>
                <h3 className="font-serif text-lg text-foreground">{productName}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-3 rounded-full transition-all ${
                    autoRotate 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-4 py-2 rounded-full bg-muted text-foreground hover:bg-muted/80 font-sans font-medium transition-all"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Full Canvas */}
            <div className="w-full h-full">
              <ViewerContent />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-card/90 backdrop-blur-sm text-sm text-muted-foreground font-sans shadow-luxury">
              Drag to rotate • Scroll to zoom • Double-tap to reset
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
