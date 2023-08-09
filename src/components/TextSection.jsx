import { Text } from "@react-three/drei";
import {
    fadeOnBeforeCompile,
    fadeOnBeforeCompileFlat,
} from "../utils/fadeMaterial";

export const TextSection = ({ title, subtitle, ...props }) => {
    return (
        <group {...props}>
            {!!title && (
                <Text
                    color={"white"}
                    anchorX={"left"}
                    anchorY={"bottom"}
                    fontSize={0.15}
                    maxWidth={2}
                    font={"./fonts/PlayfairDisplay-Bold.ttf"}
                >
                    {title}
                    <meshStandardMaterial
                        color={"white"}
                        onBeforeCompile={fadeOnBeforeCompileFlat}
                    />
                </Text>
            )}

            <Text
                color={"white"}
                anchorX={"left"}
                anchorY={"top"}
                fontSize={0.15}
                maxWidth={2.5}
                font={"./fonts/PlayfairDisplay-Regular.ttf"}
            >
                {subtitle}
                <meshStandardMaterial
                    color={"white"}
                    onBeforeCompile={fadeOnBeforeCompileFlat}
                />
            </Text>
        </group>
    );
};
