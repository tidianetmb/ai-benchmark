"use client";
import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage } from '@react-three/drei';

function Model({ config }) {
  const { scene } = useGLTF('/stichless_mannequin.glb');

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          const name = child.name.toLowerCase();

          // 1. GESTION DE LA PEAU
          if (name.includes('skin') || name.includes('body')) {
            // On peut ici changer la couleur de peau si besoin
            child.visible = true; 
          }

          // 2. LOGIQUE D'HABILLAGE RÉEL
          // On cache tout par défaut, puis on affiche uniquement ce qui est sélectionné
          if (config.clothes && config.clothes.length > 0) {
            // Si le nom du mesh (dans le GLB) correspond à un ID sélectionné dans ton front
            const isSelected = config.clothes.some(clothingId => name.includes(clothingId));
            
            // On affiche le vêtement s'il est dans la liste, sinon on le cache
            // Note: Si le mesh fait partie du corps de base, on le laisse visible
            if (name.includes('top') || name.includes('pants') || name.includes('shoe') || name.includes('dress')) {
               child.visible = isSelected;
            }
          } else {
            // Si rien n'est sélectionné, on cache tous les vêtements optionnels
            if (name.includes('top') || name.includes('pants') || name.includes('shoe')) {
              child.visible = false;
            }
          }
        }
      });
    }
  }, [config.clothes, scene]);

  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />;
}

export default function MannequinViewer({ config }) {
  return (
    <div className="h-full w-full">
      <Canvas shadows camera={{ position: [0, 1.5, 4.5], fov: 35 }}>
        <Suspense fallback={null}>
          <Stage intensity={0.6} environment="city" adjustCamera={true}>
            <Model config={config} />
          </Stage>
        </Suspense>
        <OrbitControls enablePan={false} target={[0, 1, 0]} makeDefault />
      </Canvas>
    </div>
  );
}