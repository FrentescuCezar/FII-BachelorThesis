import Konva from 'konva';
import React, { useRef, useState } from 'react';
import { Group, Circle, Ellipse } from 'react-konva';
import { colors } from './Colors';

import { handleJointDrag, renderEllipse, dragBound } from './Utils/StickmanFunctions'

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



    const handleClick = (e: any) => {
        if (stickmanGroupRef.current) {
            onSelect(stickmanGroupRef.current, id);
        }
        e.cancelBubble = true;
    };




    return (
        <Group
            ref={stickmanGroupRef}
            x={x}
            y={y}
            draggable={draggable}
            onClick={handleClick}
            //dragBoundFunc={(pos) => dragBound(stickmanGroupRef, { x, y })}
            name="Stickman" // For the save positions
        >
            {/* Head */}
            <Circle radius={20} fill={colors.head} x={joints[0].x} y={joints[0].y - 20} />

            {/* Neck */}
            {renderEllipse(joints, 0, 11, colors.head)}

            {/* Torso */}
            {renderEllipse(joints, 1, 11, colors.chestRightShoulder)}
            {renderEllipse(joints, 2, 11, colors.chestLeftShoulder)}

            {/* Right Arm */}
            {renderEllipse(joints, 1, 3, colors.rightShoulderElbow)}
            {renderEllipse(joints, 3, 5, colors.rightElbowHand)}

            {/* Left Arm */}
            {renderEllipse(joints, 2, 4, colors.leftShoulderElbow)}
            {renderEllipse(joints, 4, 6, colors.leftElbowHand)}

            {/* Right Leg */}
            {renderEllipse(joints, 11, 12, colors.rightHipChest)}
            {renderEllipse(joints, 12, 7, colors.rightKneeHip)}
            {renderEllipse(joints, 7, 9, colors.rightFootKnee)}

            {/* Left Leg */}
            {renderEllipse(joints, 11, 13, colors.leftHipChest)}
            {renderEllipse(joints, 13, 8, colors.leftKneeHip)}
            {renderEllipse(joints, 8, 10, colors.leftFootKnee)}

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
                    onDragMove={(e) => handleJointDrag(stickmanGroupRef, onSelect, id, joints, onJointsUpdate, index, e.target.x(), e.target.y())}
                />
            ))}
        </Group>
    );
};

export default Stickman;