import React, { useState, useEffect, useRef } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Stickman from './Components/Stickman/Stickman';
import StickmanTransformer from './Components/Stickman/StickmanTransformer';
import Konva from 'konva';

import {
    addStickman,
    removeStickman,
    bringForward,
    bringBackward,
    getBase64Image,
    handleJointsUpdate,
} from './Utils/TestPageStickmanFunctions';

const PaintPage: React.FC = () => {
    const [stickmen, setStickmen] = useState<{
        id: number;
        x: number;
        y: number;
        joints: Array<{ x: number; y: number }>;

    }[]>([]);

    const [uniqueIdCounter, setUniqueIdCounter] = useState<number>(0);

    {/* BUTTONS */ }
    const [selectedNode, setSelectedNode] = useState<Konva.Node | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

    const stageRef = useRef<Konva.Stage>(null);


    return (
        <div>
            <div>
                <button onClick={() => addStickman(stickmen, setStickmen, uniqueIdCounter, setUniqueIdCounter)}>Add</button>
                <button onClick={() => removeStickman(selectedNode, selectedNodeId, stickmen, setStickmen, setSelectedNode, setSelectedNodeId)}>Remove</button>
                <button onClick={() => bringForward(selectedNode)}>Bring forward</button>
                <button onClick={() => bringBackward(selectedNode)}>Bring backward</button>
                <button onClick={() => getBase64Image(stageRef)}>Save Image base64</button>
                <Stage ref={stageRef} width={512} height={512}>
                    <Layer>
                        <Rect width={512} height={512} fill="black" onMouseDown={(e) => setSelectedNode(null)} />
                        {stickmen.map((stickman, index) => (
                            <Stickman
                                key={stickman.id}
                                id={stickman.id}
                                x={stickman.x}
                                y={stickman.y}

                                draggable
                                onSelect={(node, id) => {
                                    setSelectedNode(node);
                                    setSelectedNodeId(id);
                                }}
                                joints={stickman.joints}
                                onJointsUpdate={(id, joints) =>
                                    handleJointsUpdate(stickman.id, joints, stickmen, setStickmen)
                                }
                            />
                        ))}
                        <StickmanTransformer selectedNode={selectedNode} />
                    </Layer>
                </Stage>
            </div>
        </div>

    );
};

export default PaintPage;
