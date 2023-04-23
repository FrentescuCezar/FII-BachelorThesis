import React, { useState } from 'react';
import { Group, Line, Circle, Ellipse } from 'react-konva';

interface StickmanProps {
    x: number;
    y: number;
    draggable: boolean;
}

const Stickman: React.FC<StickmanProps> = ({ x, y, draggable }) => {
    const colors = {
        head: 'rgba(255, 0, 0, 0.8)',
        torso: 'rgba(0, 0, 255, 0.8)',
        arms: 'rgba(0, 128, 0, 0.8)',
        legs: 'rgba(128, 0, 128, 0.8)',
        rightHipChest: 'rgba(0, 179, 0, 0.8)',
        rightKneeHip: 'rgba(0, 179, 60, 0.8)',
        rightFootKnee: 'rgba(0, 179, 119, 0.8)',
        leftHipChest: 'rgba(0, 179, 179, 0.8)',
        leftKneeHip: 'rgba(0, 119, 179, 0.8)',
        leftFootKnee: 'rgba(0, 60, 179, 0.8)',
        chestLeftShoulder: 'rgba(179, 60, 0, 0.8)',
        chestRightShoulder: 'rgba(179, 0, 0, 0.8)',
        rightShoulderElbow: 'rgba(179, 119, 0, 0.8)',
        rightElbowHand: 'rgba(179, 179, 0, 0.8)',
        leftShoulderElbow: 'rgba(119, 179, 0, 0.8)',
        leftElbowHand: 'rgba(60, 179, 0, 0.8)',
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
            <Ellipse
                x={joints[0].x + (joints[11].x - joints[0].x) / 2} // horizontal center of the ellipse
                y={joints[0].y + (joints[11].y - joints[0].y) / 2} // vertical center of the ellipse
                radiusX={Math.sqrt(Math.pow(joints[11].x - joints[0].x, 2) + Math.pow(joints[11].y - joints[0].y, 2)) / 2} // half the horizontal distance between joints 0 and 11
                radiusY={3.5} // fixed vertical radius
                fill={colors.head} // same color as the original stroke
                rotation={Math.atan2(joints[11].y - joints[0].y, joints[11].x - joints[0].x) * (180 / Math.PI)} // angle between the horizontal axis and the line connecting joints 0 and 11
            />


            {/* Torso */}
            <Ellipse
                x={joints[1].x + (joints[11].x - joints[1].x) / 2} // horizontal center of the ellipse
                y={joints[1].y + (joints[11].y - joints[1].y) / 2} // vertical center of the ellipse
                radiusX={Math.sqrt(Math.pow(joints[11].x - joints[1].x, 2) + Math.pow(joints[11].y - joints[1].y, 2)) / 2} // half the horizontal distance between joints 1 and 11
                radiusY={3.5} // fixed vertical radius
                fill={colors.chestRightShoulder} // same color as the original stroke
                rotation={Math.atan2(joints[11].y - joints[1].y, joints[11].x - joints[1].x) * (180 / Math.PI)} // angle between the horizontal axis and the line connecting joints 1 and 11
            />
            <Ellipse
                x={joints[2].x + (joints[11].x - joints[2].x) / 2} // horizontal center of the ellipse
                y={joints[2].y + (joints[11].y - joints[2].y) / 2} // vertical center of the ellipse
                radiusX={Math.sqrt(Math.pow(joints[11].x - joints[2].x, 2) + Math.pow(joints[11].y - joints[2].y, 2)) / 2} // half the horizontal distance between joints 2 and 11
                radiusY={3.5} // fixed vertical radius
                fill={colors.chestLeftShoulder} // same color as the original stroke
                rotation={Math.atan2(joints[11].y - joints[2].y, joints[11].x - joints[2].x) * (180 / Math.PI)} // angle between the horizontal axis and the line connecting joints 2 and 11
            />


            {/* Right Arm */}
            <Ellipse
                x={joints[1].x + (joints[3].x - joints[1].x) / 2}
                y={joints[1].y + (joints[3].y - joints[1].y) / 2}
                radiusX={Math.sqrt(Math.pow(joints[3].x - joints[1].x, 2) + Math.pow(joints[3].y - joints[1].y, 2)) / 2}
                radiusY={3.5}
                fill={colors.rightShoulderElbow}
                rotation={Math.atan2(joints[3].y - joints[1].y, joints[3].x - joints[1].x) * (180 / Math.PI)}
            />
            <Ellipse
                x={joints[3].x + (joints[5].x - joints[3].x) / 2}
                y={joints[3].y + (joints[5].y - joints[3].y) / 2}
                radiusX={Math.sqrt(Math.pow(joints[5].x - joints[3].x, 2) + Math.pow(joints[5].y - joints[3].y, 2)) / 2}
                radiusY={3.5}
                fill={colors.rightElbowHand}
                rotation={Math.atan2(joints[5].y - joints[3].y, joints[5].x - joints[3].x) * (180 / Math.PI)}
            />

            {/* Left Arm */}
            <Ellipse
                x={joints[2].x + (joints[4].x - joints[2].x) / 2}
                y={joints[2].y + (joints[4].y - joints[2].y) / 2}
                radiusX={Math.sqrt(Math.pow(joints[4].x - joints[2].x, 2) + Math.pow(joints[4].y - joints[2].y, 2)) / 2}
                radiusY={3.5}
                fill={colors.leftShoulderElbow}
                rotation={Math.atan2(joints[4].y - joints[2].y, joints[4].x - joints[2].x) * (180 / Math.PI)}
            />
            <Ellipse
                x={joints[4].x + (joints[6].x - joints[4].x) / 2}
                y={joints[4].y + (joints[6].y - joints[4].y) / 2}
                radiusX={Math.sqrt(Math.pow(joints[6].x - joints[4].x, 2) + Math.pow(joints[6].y - joints[4].y, 2)) / 2}
                radiusY={3.5}
                fill={colors.leftElbowHand}
                rotation={Math.atan2(joints[6].y - joints[4].y, joints[6].x - joints[4].x) * (180 / Math.PI)}
            />

            {/* Right Leg */}
            <Ellipse
                x={joints[11].x + (joints[12].x - joints[11].x) / 2} // horizontal center of the ellipse
                y={joints[11].y + (joints[12].y - joints[11].y) / 2} // vertical center of the ellipse
                radiusX={Math.sqrt(Math.pow(joints[12].x - joints[11].x, 2) + Math.pow(joints[12].y - joints[11].y, 2)) / 2} // half the horizontal distance between joints 11 and 12
                radiusY={3.5} // fixed vertical radius
                fill={colors.rightHipChest} // same color as the original stroke
                rotation={Math.atan2(joints[12].y - joints[11].y, joints[12].x - joints[11].x) * (180 / Math.PI)} // angle between the horizontal axis and the line connecting joints 11 and 12
            />

            <Ellipse
                x={joints[12].x + (joints[7].x - joints[12].x) / 2} // horizontal center of the ellipse
                y={joints[12].y + (joints[7].y - joints[12].y) / 2} // vertical center of the ellipse
                radiusX={Math.sqrt(Math.pow(joints[7].x - joints[12].x, 2) + Math.pow(joints[7].y - joints[12].y, 2)) / 2} // half the horizontal distance between joints 12 and 7
                radiusY={3.5} // fixed vertical radius
                fill={colors.rightKneeHip} // same color as the original stroke
                rotation={Math.atan2(joints[7].y - joints[12].y, joints[7].x - joints[12].x) * (180 / Math.PI)} // angle between the horizontal axis and the line connecting joints 12 and 7
            />

            <Ellipse
                x={joints[7].x + (joints[9].x - joints[7].x) / 2} // horizontal center of the ellipse
                y={joints[7].y + (joints[9].y - joints[7].y) / 2} // vertical center of the ellipse
                radiusX={Math.sqrt(Math.pow(joints[9].x - joints[7].x, 2) + Math.pow(joints[9].y - joints[7].y, 2)) / 2} // half the horizontal distance between joints 7 and 9
                radiusY={3.5} // fixed vertical radius
                fill={colors.rightFootKnee} // same color as the original stroke
                rotation={Math.atan2(joints[9].y - joints[7].y, joints[9].x - joints[7].x) * (180 / Math.PI)} // angle between the horizontal axis and the line connecting joints 7 and 9
            />



            {/* Left Leg */}
            <Ellipse
                x={joints[11].x + (joints[13].x - joints[11].x) / 2} // horizontal center of the ellipse
                y={joints[11].y + (joints[13].y - joints[11].y) / 2} // vertical center of the ellipse
                radiusX={Math.sqrt(Math.pow(joints[13].x - joints[11].x, 2) + Math.pow(joints[13].y - joints[11].y, 2)) / 2} // half the horizontal distance between joints 11 and 13
                radiusY={3.5} // fixed vertical radius
                fill={colors.leftHipChest} // same color as the original stroke
                rotation={Math.atan2(joints[13].y - joints[11].y, joints[13].x - joints[11].x) * (180 / Math.PI)} // angle between the horizontal axis and the line connecting joints 11 and 13
            />
            <Ellipse
                x={joints[13].x + (joints[8].x - joints[13].x) / 2} // horizontal center of the ellipse
                y={joints[13].y + (joints[8].y - joints[13].y) / 2} // vertical center of the ellipse
                radiusX={Math.sqrt(Math.pow(joints[8].x - joints[13].x, 2) + Math.pow(joints[8].y - joints[13].y, 2)) / 2} // half the horizontal distance between joints 13 and 8
                radiusY={3.5} // fixed vertical radius
                fill={colors.leftKneeHip} // same color as the original stroke
                rotation={Math.atan2(joints[8].y - joints[13].y, joints[8].x - joints[13].x) * (180 / Math.PI)} // angle between the horizontal axis and the line connecting joints 13 and 8
            />
            <Ellipse
                x={joints[8].x + (joints[10].x - joints[8].x) / 2} // horizontal center of the ellipse
                y={joints[8].y + (joints[10].y - joints[8].y) / 2} // vertical center of the ellipse
                radiusX={Math.sqrt(Math.pow(joints[10].x - joints[8].x, 2) + Math.pow(joints[10].y - joints[8].y, 2)) / 2} // half the horizontal distance between joints 8 and 10
                radiusY={3.5} // fixed vertical radius
                fill={colors.leftFootKnee} // same color as the original stroke
                rotation={Math.atan2(joints[10].y - joints[8].y, joints[10].x - joints[8].x) * (180 / Math.PI)} // angle between the horizontal axis and the line connecting joints 8 and 10
            />

            {/* Joints */}
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
                    onDragMove={(e) => handleJointDrag(index, e.target.x(), e.target.y())}
                />
            ))}
        </Group>
    );

};

export default Stickman;
