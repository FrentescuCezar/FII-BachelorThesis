import Konva from 'konva';
import React, { useRef, useState } from 'react';
import { Group, Line, Circle, Ellipse } from 'react-konva';

interface StickmanProps {
    x: number;
    y: number;
    draggable: boolean;
    onSelect: (node: Konva.Node | null) => void;

}

const Stickman: React.FC<StickmanProps> = ({ x, y, draggable, onSelect }) => {
    const colors = {
        head: 'rgba(255, 0, 0, 0.6)',
        torso: 'rgba(0, 0, 255, 0.6)',
        arms: 'rgba(0, 128, 0, 0.6)',
        legs: 'rgba(128, 0, 128, 0.6)',
        rightHipChest: 'rgba(0, 179, 0, 0.6)',
        rightKneeHip: 'rgba(0, 179, 60, 0.6)',
        rightFootKnee: 'rgba(0, 179, 119, 0.6)',
        leftHipChest: 'rgba(0, 179, 179, 0.6)',
        leftKneeHip: 'rgba(0, 119, 179, 0.6)',
        leftFootKnee: 'rgba(0, 60, 179, 0.6)',
        chestLeftShoulder: 'rgba(179, 60, 0, 0.6)',
        chestRightShoulder: 'rgba(179, 0, 0, 0.6)',
        rightShoulderElbow: 'rgba(179, 119, 0, 0.6)',
        rightElbowHand: 'rgba(179, 179, 0, 0.6)',
        leftShoulderElbow: 'rgba(170, 255, 0, 0.6)',
        leftElbowHand: 'rgba(115, 252, 47, 0.6)',
    };


    const [joints, setJoints] = useState([
        { x: 0, y: 0 }, // neck
        { x: -40, y: 20 }, // left shoulder
        { x: 40, y: 20 }, // right shoulder
        { x: -60, y: 80 }, // left elbow
        { x: 60, y: 80 }, // right elbow
        { x: -70, y: 140 }, // left hand
        { x: 70, y: 140 }, // right hand
        { x: -40, y: 190 }, // left knee
        { x: 40, y: 190 }, // right knee
        { x: -50, y: 260 }, // left foot
        { x: 50, y: 260 }, // right foot
        { x: 0, y: 20 }, // chest
        { x: -20, y: 110 }, // left hip
        { x: 20, y: 110 } // right hip
    ]);

    const stickmanGroupRef = useRef<Konva.Group>(null);

    const handleJointDrag = (index: number, x: number, y: number) => {
        if (stickmanGroupRef.current) {
            onSelect(null);
        }
        const newJoints = [...joints];
        newJoints[index] = { x, y };
        setJoints(newJoints);
    };

    const handleClick = (e: any) => {
        if (stickmanGroupRef.current) {
            onSelect(stickmanGroupRef.current);
        }
        e.cancelBubble = true;
    };


    const renderEllipse = (startJoint: number, endJoint: number, color: string) => {
        const startX = joints[startJoint].x;
        const startY = joints[startJoint].y;
        const endX = joints[endJoint].x;
        const endY = joints[endJoint].y;

        return (
            <Ellipse
                x={startX + (endX - startX) / 2}
                y={startY + (endY - startY) / 2}
                radiusX={Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) / 2}
                radiusY={3.5}
                fill={color}
                rotation={Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)}
            />
        );
    };

    return (
        <Group ref={stickmanGroupRef} x={x} y={y} draggable={draggable} onClick={handleClick}>
            {/* Head */}
            <Circle radius={20} fill={colors.head} x={joints[0].x} y={joints[0].y - 20} />

            {/* Neck */}
            {renderEllipse(0, 11, colors.head)}

            {/* Torso */}
            {renderEllipse(1, 11, colors.chestRightShoulder)}
            {renderEllipse(2, 11, colors.chestLeftShoulder)}

            {/* Right Arm */}
            {renderEllipse(1, 3, colors.rightShoulderElbow)}
            {renderEllipse(3, 5, colors.rightElbowHand)}

            {/* Left Arm */}
            {renderEllipse(2, 4, colors.leftShoulderElbow)}
            {renderEllipse(4, 6, colors.leftElbowHand)}

            {/* Right Leg */}
            {renderEllipse(11, 12, colors.rightHipChest)}
            {renderEllipse(12, 7, colors.rightKneeHip)}
            {renderEllipse(7, 9, colors.rightFootKnee)}

            {/* Left Leg */}
            {renderEllipse(11, 13, colors.leftHipChest)}
            {renderEllipse(13, 8, colors.leftKneeHip)}
            {renderEllipse(8, 10, colors.leftFootKnee)}

            {/* Joint Draggable Circles */}
            {joints.map((joint, index) => (
                <Circle
                    key={index}
                    x={joint.x}
                    y={joint.y}
                    radius={4}
                    fill={
                        index === 0 ? colors.head :
                            (index === 1 || index === 2) ? colors.chestRightShoulder :
                                (index === 3 || index === 5) ? colors.rightShoulderElbow :
                                    (index === 4 || index === 6) ? colors.leftShoulderElbow :
                                        (index === 7 || index === 9) ? colors.rightKneeHip :
                                            (index === 8 || index === 10) ? colors.leftKneeHip :
                                                (index === 11) ? colors.rightHipChest :
                                                    (index === 12) ? colors.rightHipChest :
                                                        colors.leftHipChest
                    }
                    draggable
                    onClick={(e) => {
                        e.cancelBubble = true;
                    }}
                    onDragMove={(e) => handleJointDrag(index, e.target.x(), e.target.y())}
                />
            ))}
        </Group>
    );
};

export default Stickman;