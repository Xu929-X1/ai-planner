'use client'

import { Button } from '@/components/UI/button'
import React, { useRef, useEffect, useState, useMemo } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRouter } from 'next/navigation'

function GrayToColorPlane({ colorful }: { colorful: boolean }) {
    const meshRef = useRef<{ uTime: { value: number } }>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColorful: { value: 0 },
    }), []);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    useEffect(() => {
        uniforms.uColorful.value = colorful ? 1.0 : 0.0;
    }, [colorful, uniforms]);

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[5, 5, 128, 128]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={`
          precision highp float;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
                fragmentShader={`
          precision highp float;
          uniform float uTime;
          uniform float uColorful;
          varying vec2 vUv;

          void main() {
            vec2 st = vUv;
            st.x += sin(uTime * 0.2 + st.y * 4.0) * 0.5;
            st.y += cos(uTime * 0.15 + st.x * 4.0) * 0.5;

            vec3 color1 = vec3(0.0, 0.6, 1.0);
            vec3 color2 = vec3(0.4, 0.0, 1.0);
            vec3 color3 = vec3(0.0, 1.0, 0.8);

            vec3 color = mix(color1, color2, st.x);
            color = mix(color, color3, st.y);

            float gray = dot(color, vec3(0.299, 0.587, 0.114));
            vec3 finalColor = mix(vec3(gray), color, uColorful);

            gl_FragColor = vec4(finalColor, 0.3);
          }
        `}
                transparent
            />
        </mesh>
    );
}

export default function Page() {
    const [colorful, setColorful] = useState(false);
    const router = useRouter();

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full -z-10">
                <Canvas camera={{ position: [0, 0, 1.5] }} gl={{ antialias: true }}>
                    <GrayToColorPlane colorful={colorful} />
                </Canvas>
            </div>
            <div className='items-center justify-center w-full'>
                <div className="mb-8 transition-colors duration-500">
                    <h1
                        className={`text-4xl font-bold ${colorful
                            ? 'text-slate-600 drop-shadow-[0_0_6px_rgba(0,255,255,0.4)]'
                            : 'text-gray-600'
                            } transition-colors duration-500`}
                    >
                        Welcome to AI Planner
                    </h1>
                    <p
                        className={`mt-2 ${colorful
                            ? 'text-slate-500 drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]'
                            : 'text-gray-500'
                            } transition-colors duration-500`}
                    >
                        Making plans has never been so easy.
                    </p>
                </div>
                <Button
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:brightness-125 transition duration-300"
                    onMouseEnter={() => setColorful(true)}
                    onMouseLeave={() => setColorful(false)}
                    onClick={() => router.push('/dashboard')}
                >
                    Get Started <ArrowForwardIcon />
                </Button>
            </div>
        </>
    );
}
