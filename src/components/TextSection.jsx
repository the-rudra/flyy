import { Text } from "@react-three/drei";

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
            </Text>
        </group>
    );
};
