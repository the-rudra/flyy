import { Environment, Sphere } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";
import * as THREE from "three";

export const Background = () => {
    return (
        <>
            <Environment
                files="https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/venice_sunset_1k.hdr"
                background
                blur={0.5}
            />
            <Sphere scale={[800, 800, 800]} rotation-y={Math.PI / 2}>
                <LayerMaterial
                    lighting="physical"
                    transmission={1}
                    side={THREE.BackSide}
                >
                    <Gradient
                        colorA={"#357ca1"}
                        colorB={"white"}
                        axes={"y"}
                        start={0}
                        end={-0.5}
                    />
                </LayerMaterial>
            </Sphere>
        </>
    );
};
