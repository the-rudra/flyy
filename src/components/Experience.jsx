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
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Vintage_Airplane } from "./Vintage_airplane";
import { TextSection } from "./TextSection";
import { gsap } from "gsap";
import { fadeOnBeforeCompile } from "../utils/fadeMaterial";

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
                    curvePoints[2].y + 1.5,
                    curvePoints[2].z
                ),
                title: "Who Am I?",
                subtitle:
                    "\nI'm a Web Developer, passionate in Front End Web Development. I have experience in HTML, CSS, JS, ReactJS, Redux and so on...\nCurrently learning threeJs and react-three-fiber because I have fallen in love with the things you can do within web browsers! The three dimensional websites created by using these libraries are truly amazing experiences.",
            },
            {
                cameraRailDist: 1,
                position: new THREE.Vector3(
                    curvePoints[3].x + 1.5,
                    curvePoints[3].y + 1,
                    curvePoints[3].z
                ),
                title: "Hobbies",
                subtitle:
                    "\nI am kind of a nerd. I have been gaming since an early age and I'm very invested in Esports.\nI have decent experience in most FPS esports and I am pretty skilled at the popular video game, Valorant. :)",
            },
            {
                cameraRailDist: -1,
                position: new THREE.Vector3(
                    curvePoints[4].x - 4,
                    curvePoints[4].y + 2,
                    curvePoints[4].z
                ),
                title: "My Goals",
                subtitle:
                    "\nLearn a lot more of react-three-fiber to create more amazing three dimensional websites!\nAnd also become the god gamer.",
            },
        ];
    }, []);

    const clouds = useMemo(
        () => [
            {
                position: new THREE.Vector3(-3.5, -2, -10),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
            },
            {
                position: new THREE.Vector3(9, -4, -20),
                scale: new THREE.Vector3(0.5, 0.5, 0.5),
            },
            {
                position: new THREE.Vector3(-9, 6, -30),
                scale: new THREE.Vector3(1, 1, 1),
            },
            {
                position: new THREE.Vector3(1, 2, -40),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(-5, 1, -55),
            },
            {
                position: new THREE.Vector3(8, 2, -60),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(-8, 3, -75),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[2].x - 9,
                    curvePoints[2].y,
                    curvePoints[2].z
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[2].x + 8,
                    curvePoints[2].y - 3,
                    curvePoints[2].z + 12
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[2].x + 3,
                    curvePoints[2].y + 2,
                    curvePoints[2].z - 6
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[2].x - 9,
                    curvePoints[2].y,
                    curvePoints[2].z - 22
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[2].x - 5,
                    curvePoints[2].y - 3,
                    curvePoints[2].z + 22
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[2].x + 3,
                    curvePoints[2].y + 2,
                    curvePoints[2].z - 6
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[3].x - 9,
                    curvePoints[3].y,
                    curvePoints[3].z
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[3].x + 8,
                    curvePoints[3].y - 3,
                    curvePoints[3].z + 12
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[3].x + 3,
                    curvePoints[3].y + 2,
                    curvePoints[3].z - 6
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[3].x - 9,
                    curvePoints[3].y,
                    curvePoints[3].z - 22
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[3].x - 5,
                    curvePoints[3].y - 3,
                    curvePoints[3].z + 22
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[3].x + 3,
                    curvePoints[3].y + 2,
                    curvePoints[3].z - 6
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[4].x - 9,
                    curvePoints[4].y,
                    curvePoints[4].z
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[4].x + 8,
                    curvePoints[4].y - 3,
                    curvePoints[4].z + 12
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[4].x + 3,
                    curvePoints[4].y + 2,
                    curvePoints[4].z - 6
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[4].x - 9,
                    curvePoints[4].y,
                    curvePoints[4].z - 22
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[4].x - 5,
                    curvePoints[4].y - 3,
                    curvePoints[4].z + 22
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
            {
                position: new THREE.Vector3(
                    curvePoints[4].x + 3,
                    curvePoints[4].y + 2,
                    curvePoints[4].z - 6
                ),
                scale: new THREE.Vector3(0.8, 0.8, 0.8),
                rotation: new THREE.Euler(0, 0, 0),
            },
        ],

        []
    );

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
        tl.current.seek(lerpedScrollOffset * tl.current.duration());

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

    const tl = useRef();

    //changing background colors using gsap timeline
    const backgroundColors = useRef({ colorA: "#357ca1", colorB: "white" });
    useLayoutEffect(() => {
        tl.current = gsap.timeline();

        tl.current.to(backgroundColors.current, {
            duration: 1,
            colorA: "#5C4B99",
            colorB: "#FFDBC3",
        });
        tl.current.to(backgroundColors.current, {
            duration: 1,
            colorA: "#F31559",
            colorB: "#F5F5F5",
        });
        tl.current.to(backgroundColors.current, {
            duration: 1,
            colorA: "#FBA1B7",
            colorB: "#FFDBAA",
        });

        tl.current.pause();
    }, []);

    return (
        <>
            <directionalLight intensity={0.1} position={[0, 3, 1]} />
            {/* <OrbitControls enableZoom={false} /> */}
            <group ref={cameraGroup}>
                <Background backgroundColors={backgroundColors} />
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
            <group position={[-2, 0.7, -2]}>
                <Text
                    color={"white"}
                    anchorX={"left"}
                    anchorY={"middle"}
                    fontSize={0.15}
                    maxWidth={2}
                    font={"./fonts/PlayfairDisplay-Bold.ttf"}
                >
                    Welcome to My Website!{"\n\n"}
                    Come with me on this journey to explore my universe!
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
                        onBeforeCompile={fadeOnBeforeCompile}
                    />
                </mesh>
            </group>
            {/* CLOUDS */}
            {clouds.map((clouds, index) => (
                <Cloud {...clouds} key={index} />
            ))}
        </>
    );
};
