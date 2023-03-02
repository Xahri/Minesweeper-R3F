import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { FlakesTexture } from 'three-stdlib'
import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

const Mine = React.memo(({ factor, speed, xFactor, yFactor, zFactor, color = 'white' }) => {

  useEffect (() => {
    useGLTF.preload('/Mine.glb')
  },[])

  const { scene } = useGLTF('/Mine.glb');
  const ref = useRef();

  console.log("YOO");

  const stripe = useRef()

  useFrame((state) => {
    const t = factor + state.clock.elapsedTime * (speed / 2)
    ref.current.scale.setScalar(Math.max(1, Math.cos(t/2) * 1.2))
    ref.current.position.set(
      Math.cos(t) + Math.sin(t * 1) / 24 + xFactor + Math.cos((t / 24) * factor) + (Math.sin(t * 1) * factor) / 24,
      Math.sin(t) + Math.cos(t * 2) / 24 + yFactor + Math.sin((t / 24) * factor) + (Math.cos(t * 2) * factor) / 24,
      Math.sin(t) + Math.cos(t * 2) / 24 + zFactor + Math.cos((t / 24) * factor) + (Math.sin(t * 3) * factor) / 24
    )
    ref.current.rotation.set(
      Math.cos(t) + Math.sin(t * 1) / 36 + xFactor + Math.cos((t / 36) * factor) + (Math.sin(t * 1) * factor) / 36,
      Math.sin(t) + Math.cos(t * 2) / 36 + yFactor + Math.sin((t / 36) * factor) + (Math.cos(t * 2) * factor) / 36,
      Math.sin(t) + Math.cos(t * 2) / 36 + zFactor + Math.cos((t / 36) * factor) + (Math.sin(t * 3) * factor) / 36
    )
    stripe.current.color.setRGB(Math.sin(t * 4) + 1, Math.cos(t * 8) + 2, Math.sin(t * 12) + 4)
  })

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
          color={color}
          toneMapped={false}
          ref={stripe}
        />
      </mesh>
    </mesh>
  )
})

export default Mine;
