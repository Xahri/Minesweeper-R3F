import { Suspense, useState } from 'react'
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Sky, Stats, OrbitControls, Environment, Stars, Loader } from "@react-three/drei";
import { useControls } from 'leva'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Constraints from "./components/Constraints";
import Board from "./components/Board";
import Lights from './components/Lights';
import MineField from './components/MineField';
import { Overlay } from './components/Overlay';

export default function App() {

  const [selectedBackground, setSelectedBackground] = useState("None");
  const backgrounds = ["None", "Day", "Night"];

  const { cursor } = useControls({ cursor: true });
  const { postprocessing } = useControls({ postprocessing: false });

  const { cameraControls } = useControls({ cameraControls: false });
  useControls({
    Backgrounds: {
      options: [...backgrounds],
      onChange: (value) => {
        setSelectedBackground(value);
      },
    }
  });

  const { centerBoard } = useControls({ centerBoard: false });
  const { boardOpacity } = useControls({ boardOpacity: { value: 100, min: 0, max: 100, step: 25 } });

  const Background = () => {
    if (selectedBackground === "Day") return <Sky />
    else if (selectedBackground === "Night") return <Environment background preset="night" blur={.6} />
    else return <></>
  }

  const Cursor = () => {
    if (cursor) {
      return (
        <Physics gravity={[0, 2, 0]} iterations={10}>
          <Constraints />
        </Physics>
      )
    }
    return <></>
  }

  const Postprocessing = () => {
    if (postprocessing) {
      return (
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur />
        </EffectComposer>
      )
    }
    return <></>
  }

  return (
    <>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 48], fov: 35, near: 1, far: 480 }}>

        <Lights />
        <Cursor />
        <Stats />
        <MineField color={'purple'} />

        <Postprocessing />
        
        <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
        <Suspense fallback={null}>
          <Background />
        </Suspense>
        {cameraControls ? <OrbitControls enableDamping autoRotate={false} autoRotateSpeed={0.4} /> : <></>}

      </Canvas>

      <Loader />

      <div style={{
        display: centerBoard ? 'flex' : 'block',
        position: 'absolute',
        pointerEvents: 'none',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        padding: '0px',
        opacity: `${boardOpacity}%`
      }}>
        <Board height={16} width={16} mines={40} />
      </div>
      <Overlay />
    </>
  );
}
