import {
    Float,
    Line,
    OrbitControls,
    PerspectiveCamera,
    Text,
    useScroll,
} from "@react-three/drei";
import { Background } from "./Background";
import { Airplane } from "./Airplane";
import { Cloud } from "./Cloud";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Vintage_Airplane } from "./Vintage_airplane";
import { TextSection } from "./TextSection";

const LINE_NB_POINTS = 2000;
const CURVE_DISTANCE = 80;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;
const FRICTION_DISTANCE = 42;

export const Experience = () => {
    const curvePoints = useMemo(
        () => [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, 0, -1 * CURVE_DISTANCE),
            new THREE.Vector3(-20, 0, -3 * CURVE_DISTANCE),
            new THREE.Vector3(0, 0, -4 * CURVE_DISTANCE),
            new THREE.Vector3(2, 0, -5 * CURVE_DISTANCE),
            new THREE.Vector3(20, 0, -6 * CURVE_DISTANCE),
            new THREE.Vector3(5, 0, -7 * CURVE_DISTANCE),
            new THREE.Vector3(0, 0, -8 * CURVE_DISTANCE),
        ],
        []
    );

    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(
            curvePoints,
            false,
            "catmullrom",
            0.5
        );
    }, []);

    const linePoints = useMemo(() => {
        return curve.getPoints(LINE_NB_POINTS);
    }, [curve]);

    const shape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, -0.1);
        shape.lineTo(0, 0.1);

        return shape;
    }, [curve]);

    const cameraGroup = useRef();
    const cameraRail = useRef();
    const scroll = useScroll();
    const lastScroll = useRef(0);

    const textSections = useMemo(() => {
        return [
            {
                cameraRailDist: -1,
                position: new THREE.Vector3(
                    curvePoints[2].x - 3,
                    curvePoints[2].y,
                    curvePoints[2].z
                ),
                title: "What is Molog",
                subtitle:
                    "\nWe offer the unique blend of 'the power of design' and technology to build digital & everlasting experiences.",
            },
            {
                cameraRailDist: 1,
                position: new THREE.Vector3(
                    curvePoints[3].x + 1.5,
                    curvePoints[3].y + 1,
                    curvePoints[3].z
                ),
                title: "About Us",
                subtitle:
                    "\nWe are a team of conceptual designers, curious problem solvers, and passionate collaborators focused on the belief that great ideas come about when strategy and creativity work together. ",
            },
            {
                cameraRailDist: -1,
                position: new THREE.Vector3(
                    curvePoints[4].x - 4,
                    curvePoints[4].y + 2,
                    curvePoints[4].z
                ),
                title: "Our Philosophy",
                subtitle:
                    "\nWe know that Strategy can't stand alone. Creative needs a companion.\n\nThat's why, at MoLog, we bring them together. Strategy and creative. Science and emotion. One and the same. Through this convergence, brands across all industries can stir emotions and inspire action. No matter who they target. Driving sales and generating revenue.\n\nAt MoLog, we speak to the heart, and the mind follows.",
            },
        ];
    }, []);

    useFrame((_state, delta) => {
        const scrollOffset = Math.max(0, scroll.offset);

        let friction = 1;
        //pan camera close to texts
        let resetCameraRail = true;
        textSections.forEach((textSection) => {
            const distance = textSection.position.distanceTo(
                cameraGroup.current.position
            );
            if (distance < FRICTION_DISTANCE) {
                friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
                const targetCameraRailPosition = new THREE.Vector3(
                    (1 - distance / FRICTION_DISTANCE) *
                        textSection.cameraRailDist,
                    0,
                    0
                );
                cameraRail.current.position.lerp(
                    targetCameraRailPosition,
                    delta
                );
                resetCameraRail = false;
            }
        });
        if (resetCameraRail) {
            const targetCameraRailPosition = new THREE.Vector3(0, 0, 0);
            cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        }

        const currPointIndex = Math.min(
            Math.round(scroll.offset * linePoints.length),
            linePoints.length - 1
        );

        //slow scroll effect
        let lerpedScrollOffset = THREE.MathUtils.lerp(
            lastScroll.current,
            scrollOffset,
            delta * friction
        );
        //prevent going below zero and above one
        lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
        lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

        lastScroll.current = lerpedScrollOffset;

        const currPoint = curve.getPoint(lerpedScrollOffset);

        //follow the curve points
        cameraGroup.current.position.lerp(currPoint, delta * 24);

        //to rotate the perspective camera
        const lookAtPoint = curve.getPoint(
            Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
        );

        const currentLookAt = cameraGroup.current.getWorldDirection(
            new THREE.Vector3()
        );
        const targetLookAt = new THREE.Vector3()
            .subVectors(currPoint, lookAtPoint)
            .normalize();

        const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
        cameraGroup.current.lookAt(
            cameraGroup.current.position.clone().add(lookAt)
        );

        //airplane rotation
        const tangent = curve.getTangent(
            lerpedScrollOffset + CURVE_AHEAD_AIRPLANE
        );
        //calculate this to avoid rotation being affected by the smooth effect
        const nonLerpLookAt = new THREE.Group();
        nonLerpLookAt.position.copy(currPoint);
        nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

        tangent.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            -nonLerpLookAt.rotation.y
        );
        //as the camera follows the curve, we need to apply the inverse of the lookAt rotation to calculate the correct angle wherever the direction is
        let angle = Math.atan2(-tangent.z, tangent.x);
        angle = -Math.PI / 2 + angle; //without this the plane was rotated left

        let angleDegrees = (angle * 180) / Math.PI;
        angleDegrees *= 2.4; //strong rotation of plane

        //limit plane angle
        if (angleDegrees < 0) {
            angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
        }
        if (angleDegrees > 0) {
            angleDegrees = Math.max(angleDegrees, AIRPLANE_MAX_ANGLE);
        }

        //convert angle back to radian
        angle = (angleDegrees * Math.PI) / 180;

        const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
                airplane.current.rotation.x,
                airplane.current.rotation.y,
                angle
            )
        );
        airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);
    });
    const airplane = useRef();

    return (
        <>
            <directionalLight intensity={0.1} position={[0, 3, 1]} />
            {/* <OrbitControls enableZoom={false} /> */}
            <group ref={cameraGroup}>
                <Background />
                <group ref={cameraRail}>
                    <PerspectiveCamera
                        position={[0, 0.4, 5]}
                        fov={30}
                        makeDefault
                    />
                </group>
                <group ref={airplane}>
                    <Float
                        floatIntensity={1}
                        speed={1.5}
                        rotationIntensity={0.5}
                    >
                        {/* <Airplane
                            rotation-y={Math.PI}
                            scale={[0.2, 0.2, 0.2]}
                            position-y={0.1}
                        /> */}
                        <Vintage_Airplane
                            rotation-y={Math.PI}
                            scale={[0.1, 0.1, 0.1]}
                            position-y={-0.2}
                        />
                    </Float>
                </group>
            </group>
            {/* TEXT */}
            <group position={[-2, 0.1, -2]}>
                <Text
                    color={"white"}
                    anchorX={"left"}
                    anchorY={"middle"}
                    fontSize={0.15}
                    maxWidth={2}
                    font={"./fonts/PlayfairDisplay-Bold.ttf"}
                >
                    Welcome to Molog!{"\n"}
                    Come with us on this journey to explore our universe!
                </Text>
            </group>
            {textSections.map((textSection, index) => (
                <TextSection {...textSection} key={index} />
            ))}

            {/* LINE */}
            <group position-y={-2}>
                {/* <Line
                    points={linePoints}
                    color={"white"}
                    opacity={0.7}
                    transparent
                    linewidth={2}
                /> */}
                <mesh>
                    <extrudeGeometry
                        args={[
                            shape,
                            {
                                steps: LINE_NB_POINTS,
                                bevelEnabled: false,
                                extrudePath: curve,
                            },
                        ]}
                    />
                    <meshStandardMaterial
                        color={"white"}
                        opacity={0.7}
                        transparent
                        envMapIntensity={2}
                    />
                </mesh>
            </group>
            <group>
                <Cloud
                    opacity={0.5}
                    scale={[0.2, 0.3, 0.4]}
                    position={[1.5, -0.5, -2]}
                />
                <Cloud
                    opacity={0.5}
                    scale={[0.3, 0.3, 0.3]}
                    position={[-2, 1, -3]}
                />
                <Cloud
                    opacity={0.7}
                    scale={[0.3, 0.3, 0.4]}
                    position={[20, -0.2, -2]}
                    rotation-y={Math.PI / 9}
                />
                <Cloud
                    opacity={0.4}
                    scale={[0.4, 0.4, 0.4]}
                    position={[6, -0.2, -12]}
                    rotation-y={Math.PI / 9}
                />
                <Cloud
                    opacity={0.4}
                    scale={[0.4, 0.4, 0.4]}
                    position={[9, -0.2, -28]}
                />
                <Cloud
                    opacity={0.4}
                    scale={[0.8, 0.8, 0.8]}
                    position={[-12, -1, -32]}
                />
                <Cloud
                    opacity={0.4}
                    scale={[0.4, 0.4, 0.4]}
                    position={[6, 5, -48]}
                />
                <Cloud
                    opacity={0.4}
                    scale={[0.5, 0.5, 0.4]}
                    position={[1, -4, -42]}
                />
                <Cloud
                    opacity={0.5}
                    scale={[0.4, 0.4, 0.4]}
                    position={[-3, -1, -50]}
                />
                <Cloud
                    opacity={0.4}
                    scale={[0.9, 0.9, 0.9]}
                    position={[-5, 3, -54]}
                />
            </group>
        </>
    );
};
