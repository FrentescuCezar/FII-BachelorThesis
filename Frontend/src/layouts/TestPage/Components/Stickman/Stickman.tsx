import Konva from 'konva';
import React, { useEffect, useRef } from 'react';
import { Group, Circle } from 'react-konva';
import { colors } from './Colors';

import { handleJointDrag, renderEllipse } from './Utils/StickmanFunctions'

interface StickmanProps {
    id: number;
    x: number;
    y: number;
    rotation: number;
    draggable: boolean;
    onSelect: (node: Konva.Node | null, id: number | null) => void;
    joints: Array<{ x: number; y: number }>;
    onJointsUpdate: (id: number, joints: Array<{ x: number; y: number }>) => void;
    scaleX: number;  // Add these new props
    scaleY: number;  // Add these new props
    onDragEnd: (id: number, newX: number, newY: number) => void;  // Add this line
    onScaleChange: (id: number, newScaleX: number, newScaleY: number) => void;
    onRotateChange: (id: number, newRotation: number) => void; // new callback
    updateJointBug: boolean;
    setUpdateJointBug: React.Dispatch<React.SetStateAction<boolean>>;
}

const Stickman: React.FC<StickmanProps> = ({
    id, x, y, rotation, draggable, onSelect, joints, onJointsUpdate, scaleX, scaleY,
    onDragEnd, onScaleChange, onRotateChange, updateJointBug, setUpdateJointBug
}) => {

    const stickmanGroupRef = useRef<Konva.Group>(null);

    const handleClick = (e: any) => {
        if (stickmanGroupRef.current) {
            onSelect(stickmanGroupRef.current, id);
        }
        e.cancelBubble = true;
    };

    useEffect(() => {
        if (stickmanGroupRef.current) {
            stickmanGroupRef.current.scaleX(scaleX);
            stickmanGroupRef.current.scaleY(scaleY);
            stickmanGroupRef.current.rotation(rotation);
        }
    }, [scaleX, scaleY, rotation]);

    const handleDragEnd = (
    ) => {
        setUpdateJointBug(false);
    };



    return (
        <Group
            id={id.toString()} // Convert to string because Konva's id is a string
            ref={stickmanGroupRef}
            x={x}
            y={y}
            scaleX={scaleX}  // Apply the scales
            scaleY={scaleY}  // Apply the scales
            draggable={draggable}
            onClick={handleClick}
            onDragEnd={(e) => {
                if (stickmanGroupRef.current) {
                    const newX = stickmanGroupRef.current.x();
                    const newY = stickmanGroupRef.current.y();

                    const deltaX = newX - x;
                    const deltaY = newY - y;

                    const newJoints = joints.map(joint => ({
                        x: joint.x + deltaX,
                        y: joint.y + deltaY,
                    }));

                    onJointsUpdate(id, newJoints);

                    onDragEnd(id, newX, newY);

                    if (stickmanGroupRef.current) {
                        const newScaleX = stickmanGroupRef.current.scaleX();
                        const newScaleY = stickmanGroupRef.current.scaleY();
                        onScaleChange(id, newScaleX, newScaleY);
                    }
                }
            }}

            onTransformEnd={() => {
                if (stickmanGroupRef.current) {
                    const newScaleX = stickmanGroupRef.current.scaleX();
                    const newScaleY = stickmanGroupRef.current.scaleY();
                    const newRotation = stickmanGroupRef.current.rotation(); // get the new rotation value
                    onScaleChange(id, newScaleX, newScaleY);
                    onRotateChange(id, newRotation); // call the onRotateChange callback
                }
            }}

            name="Stickman"

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
                    onDragMove={(e) => handleJointDrag(stickmanGroupRef, onSelect, id, joints, onJointsUpdate, index, e.target.x(), e.target.y(), setUpdateJointBug)}
                    onDragEnd={handleDragEnd}
                />
            ))}
        </Group>
    );
};

export default Stickman;