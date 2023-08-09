import { Environment, Sphere } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";
import * as THREE from "three";

export const Background = () => {
    const colorA = "#357ca1";
    const colorB = "white";
    const start = 0;
    const end = -0.5;
    return (
        <>
            <Sphere scale={[800, 800, 800]} rotation-y={Math.PI / 2}>
                <LayerMaterial color={"white"} side={THREE.BackSide}>
                    <Gradient
                        colorA={colorA}
                        colorB={colorB}
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
            >
                <Sphere
                    scale={[800, 800, 800]}
                    rotation-y={Math.PI / 2}
                    rotation-x={Math.PI}
                >
                    <LayerMaterial color={"white"} side={THREE.BackSide}>
                        <Gradient
                            colorA={colorA}
                            colorB={colorB}
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
