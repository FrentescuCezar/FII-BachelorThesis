import React, { useState } from 'react';
import { Group, Line, Circle, Path } from 'react-konva';

interface StickmanProps {
    x: number;
    y: number;
    draggable: boolean;
}

const Stickman: React.FC<StickmanProps> = ({ x, y, draggable }) => {
    const colors = {
        head: 'red',
        torso: 'blue',
        arms: 'green',
        legs: 'purple',
        rightHipChest: '#00b300',
        rightKneeHip: '#00b33c',
        rightFootKnee: '#00b377',
        leftHipChest: '#00b3b3',
        leftKneeHip: '#0077b3',
        leftFootKnee: '#003cb3',
        chestLeftShoulder: '#b33c00',
        chestRightShoulder: '#b30000',
        rightShoulderElbow: '#b37700',
        rightElbowHand: '#b3b300',
        leftShoulderElbow: '#77b300',
        leftElbowHand: '#3cb300',
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

    const handleJointDrag = (index: number, x: number, y: number) => {
        const newJoints = [...joints];
        newJoints[index] = { x, y };
        setJoints(newJoints);
    };

    return (
        <Group x={x} y={y} draggable={draggable}>
            {/* Head */}
            <Circle radius={20} fill={colors.head} x={joints[0].x} y={joints[0].y - 20} />

            {/* Neck */}
            <Line
                points={[
                    joints[0].x, // neck
                    joints[0].y,
                    joints[11].x, // chest
                    joints[11].y,
                ]}
                stroke={colors.head}
                strokeWidth={4}
            />

            {/* Torso */}
            <Line
                points={[
                    joints[1].x, // left shoulder
                    joints[1].y,
                    joints[11].x, // chest
                    joints[11].y,
                    joints[2].x, // right shoulder
                    joints[2].y,
                ]}
                stroke={colors.chestRightShoulder}
                strokeWidth={4}
            />
            <Line
                points={[
                    joints[11].x, // chest
                    joints[11].y,
                    joints[2].x, // right shoulder
                    joints[2].y,
                ]}
                stroke={colors.chestLeftShoulder}
                strokeWidth={4}
            />

            {/* Right Arm */}
            <Line
                points={[
                    joints[1].x,
                    joints[1].y,
                    joints[3].x,
                    joints[3].y,
                    joints[5].x,
                    joints[5].y,
                ]}
                stroke={colors.rightShoulderElbow}
                strokeWidth={4}
            />
            <Line
                points={[
                    joints[3].x,
                    joints[3].y,
                    joints[5].x,
                    joints[5].y,
                ]}
                stroke={colors.rightElbowHand}
                strokeWidth={4}
            />

            {/* Left Arm */}
            <Line
                points={[
                    joints[2].x,
                    joints[2].y,
                    joints[4].x,
                    joints[4].y,
                    joints[6].x,
                    joints[6].y,
                ]}
                stroke={colors.leftShoulderElbow}
                strokeWidth={4}
            />
            <Line
                points={[
                    joints[4].x,
                    joints[4].y,
                    joints[6].x,
                    joints[6].y,
                ]}
                stroke={colors.leftElbowHand}
                strokeWidth={4}
            />

            {/* Right Leg */}
            <Line
                points={[
                    joints[11].x, // chest
                    joints[11].y,
                    joints[12].x, // left hip
                    joints[12].y,
                ]}
                stroke={colors.rightHipChest}
                strokeWidth={4}
            />
            <Line
                points={[
                    joints[12].x, // left hip
                    joints[12].y,
                    joints[7].x, // left knee
                    joints[7].y,
                ]}
                stroke={colors.rightKneeHip}
                strokeWidth={4}
            />
            <Line
                points={[
                    joints[7].x, // left knee
                    joints[7].y,
                    joints[9].x, // left foot
                    joints[9].y,
                ]}
                stroke={colors.rightFootKnee}
                strokeWidth={4}
            />


            {/* Left Leg */}
            <Line
                points={[
                    joints[11].x, // chest
                    joints[11].y,
                    joints[13].x, // right hip
                    joints[13].y,
                ]}
                stroke={colors.leftHipChest}
                strokeWidth={4}
            />
            <Line
                points={[
                    joints[13].x, // right hip
                    joints[13].y,
                    joints[8].x, // right knee
                    joints[8].y,
                ]}
                stroke={colors.leftKneeHip}
                strokeWidth={4}
            />
            <Line
                points={[
                    joints[8].x, // right knee
                    joints[8].y,
                    joints[10].x, // right foot
                    joints[10].y,
                ]}
                stroke={colors.leftFootKnee}
                strokeWidth={4}
            />

            {/* Joints */}
            {joints.map((joint, index) => (
                <Circle
                    key={index}
                    x={joint.x}
                    y={joint.y}
                    radius={5}
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
                    onDragMove={(e) => handleJointDrag(index, e.target.x(), e.target.y())}
                />
            ))}
        </Group>
    );

};

export default Stickman;
