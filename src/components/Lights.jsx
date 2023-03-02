import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { DirectionalLightHelper } from "three";
import { PointLightHelper } from "three";

export default function Lights() {
  const ref = useRef();
  const refP = useRef();

   useHelper(ref, DirectionalLightHelper);
   useHelper(refP, PointLightHelper);

  return (
    <group>
      
        <ambientLight intensity={0.24} position={[0, 10, 10]} />
        <ambientLight intensity={0.24} />
        <pointLight
            ref={refP}
            position={[40, 30, -20]}
            intensity={1}
            color={"#FFE0BB"}
        />

        {/* <ambientLight intensity={0.25} />
        <spotLight intensity={1} angle={0.2} penumbra={1} position={[30, 30, 30]} castShadow shadow-mapSize={[512, 512]} />
        <directionalLight intensity={5} position={[-10, -10, -10]} color="purple" /> */}

    </group>
  );
}
