import { MathUtils } from 'three'
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Mine from './Mine'

const MineField = React.memo(({ color }) => {

    const particles = Array.from({ length: 24 }, () => ({
        factor: MathUtils.randInt(12, 24),
        speed: MathUtils.randFloat(.01, .8),
        xFactor: MathUtils.randFloatSpread(96),
        yFactor: MathUtils.randFloatSpread(40),
        zFactor: MathUtils.randFloatSpread(36)
    }))

    const ref = useRef()
    useFrame((state, delta) => void (ref.current.rotation.y = MathUtils.damp(ref.current.rotation.y, (-state.mouse.x * Math.PI) / 36, 2.75, delta)))
    return (
        <group ref={ref} castShadow receiveShadow position={[0, 0, -36]}>
            {particles.map((data, i) => (
                <Mine key={i} {...data} color={color} />
            ))}
        </group>
    )
})
export default MineField;
