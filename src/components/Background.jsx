import { Environment, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Gradient, LayerMaterial } from "lamina";
import { useRef } from "react";
import * as THREE from "three";

export const Background = ({ backgroundColors }) => {
    // const colorA = "#357ca1";
    // const colorB = "white";
    const start = 0;
    const end = -0.5;
    //using ref because we dont need many high level re-renders
    const gradientRef = useRef();
    const gradientEnvRef = useRef();

    useFrame(() => {
        gradientRef.current.colorA = new THREE.Color(
            backgroundColors.current.colorA
        );
        gradientRef.current.colorB = new THREE.Color(
            backgroundColors.current.colorB
        );
        gradientEnvRef.current.colorA = new THREE.Color(
            backgroundColors.current.colorA
        );
        gradientEnvRef.current.colorB = new THREE.Color(
            backgroundColors.current.colorB
        );
    });
    return (
        <>
            <Sphere scale={[800, 800, 800]} rotation-y={Math.PI / 2}>
                <LayerMaterial color={"white"} side={THREE.BackSide}>
                    <Gradient
                        ref={gradientRef}
                        axes={"y"}
                        start={start}
                        end={end}
                    />
                </LayerMaterial>
            </Sphere>
            <Environment
                // files="https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/venice_sunset_1k.hdr"
                // background
                // blur={0.5}
                resolution={256}
                frames={Infinity} //without this the env does not change if colors change
            >
                <Sphere
                    scale={[800, 800, 800]}
                    rotation-y={Math.PI / 2}
                    rotation-x={Math.PI}
                >
                    <LayerMaterial color={"white"} side={THREE.BackSide}>
                        <Gradient
                            ref={gradientEnvRef}
                            axes={"y"}
                            start={start}
                            end={end}
                        />
                    </LayerMaterial>
                </Sphere>
            </Environment>
        </>
    );
};
