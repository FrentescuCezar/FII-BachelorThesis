import Konva from 'konva';
import React, { useRef, useState } from 'react';
import { Group, Circle, Ellipse } from 'react-konva';
import { colors } from './Colors';

interface StickmanProps {
    id: number;
    x: number;
    y: number;
    draggable: boolean;
    onSelect: (node: Konva.Node | null, id: number | null) => void;
    joints: Array<{ x: number; y: number }>;
    onJointsUpdate: (id: number, joints: Array<{ x: number; y: number }>) => void;
}

const Stickman: React.FC<StickmanProps> = ({ id, x, y, draggable, onSelect, joints, onJointsUpdate }) => {

    const stickmanGroupRef = useRef<Konva.Group>(null);
    const [localJoints, setLocalJoints] = useState<Array<{ x: number; y: number }>>(joints);


    const handleJointDrag = (index: number, x: number, y: number) => {
        if (stickmanGroupRef.current) {
            onSelect(null, id);
        }
        const newJoints = [...localJoints];
        newJoints[index] = { x, y };
        setLocalJoints(newJoints);
        onJointsUpdate(id, newJoints);
    };

    const handleClick = (e: any) => {
        if (stickmanGroupRef.current) {
            onSelect(stickmanGroupRef.current, id);
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


    const dragBound = (pos: { x: number; y: number }): { x: number; y: number } => {
        const stageWidth = 512;
        const stageHeight = 512;

        if (!stickmanGroupRef.current?.parent) {
            return pos;
        }

        const stickman = stickmanGroupRef.current?.getClientRect({ relativeTo: stickmanGroupRef.current.parent });

        if (!stickman) {
            return pos;
        }

        const minX = -stickman.width + 10;
        const minY = -stickman.height + 5;
        const maxX = stageWidth + 50;
        const maxY = stageHeight + 50;

        const newX = Math.max(minX, Math.min(maxX, pos.x));
        const newY = Math.max(minY, Math.min(maxY, pos.y));

        // Check if the cursor is out of bounds
        if (pos.x < minX || pos.x > maxX || pos.y < minY || pos.y > maxY) {
            return { x: newX, y: newY };
        }

        return pos;
    }



    return (
        <Group
            ref={stickmanGroupRef}
            x={x}
            y={y}
            draggable={draggable}
            onClick={handleClick}
            dragBoundFunc={dragBound}
            name="Stickman" // For the save positions
        >
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