import * as THREE from 'three'
import { useSphere, useSpring } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import { forwardRef, useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { FlakesTexture } from 'three-stdlib'

const Mine = forwardRef((props, fwdRef) => {

  const { scene } = useGLTF('/Mine.glb');
  const stripe = useRef()

  useEffect(() => {
    stripe.current.color.setRGB(8, 0, 0);
  },[])

  const args = [.1, .1, .1]
  const [ref] = useSphere(
    () => ({
      args,
      linearDamping: 0.7,
      mass: 1,
      ...props,
    }),
    fwdRef,
  )
  return (
    <mesh ref={ref}>
      <mesh geometry={scene.children[0].children[0].geometry} scale={1.4} castShadow receiveShadow >
        <meshStandardMaterial
          color={'#444444'}
          roughness={0.6}
          normalMap= {new THREE.CanvasTexture(new FlakesTexture(), THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping)}
          normalMap-repeat={[12, 12]}
          normalScale={[0.5, 0.5]}
        />
      </mesh>
      <mesh geometry={scene.children[0].children[1].geometry} scale={1.4} castShadow receiveShadow >
        <meshStandardMaterial
          color={'#444444'}
          roughness={0.6}
          normalMap= {new THREE.CanvasTexture(new FlakesTexture(), THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping)}
          normalMap-repeat={[24, 24]}
          normalScale={[0.5, 0.5]}
        />
      </mesh>
      <mesh geometry={scene.children[0].children[2].geometry} scale={1.4} castShadow receiveShadow >
        <meshBasicMaterial
          color={'red'}
          toneMapped={false}
          ref={stripe}
        />
      </mesh>
    </mesh>
  )
})

const Pointer = forwardRef((props, fwdRef) => {
  const viewport = useThree((state) => state.viewport)
  const [, api] = useSphere(() => ({ type: "Kinematic", args: [.1], position: [0, 0, 0] }), fwdRef)
  return useFrame((state) => api.position.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0))
})

const MineAndPointer = () => {
  const [box, cursor] = useSpring(useRef(null), useRef(null), {
    damping: 8,
    restLength: 0,
    stiffness: 120,
  })

  return (
    <>
      <Mine ref={box} position={[0, 0, 0]} />
      <Pointer ref={cursor} />
    </>
  )
}

export default function Constraints() {
  return (
    <MineAndPointer />
  )
}
