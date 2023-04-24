import React, { useState, useEffect } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Stickman from './Components/Stickman/Stickman';
import StickmanTransformer from './Components/Stickman/StickmanTransformer';
import Konva from 'konva';

const PaintPage: React.FC = () => {
    const [stickmen, setStickmen] = useState<{ id: number; x: number; y: number }[]>([]);
    const [uniqueIdCounter, setUniqueIdCounter] = useState<number>(0);


    const addStickman = () => {
        setStickmen([...stickmen, { id: uniqueIdCounter, x: 256, y: 256 - 120 }]);
        setUniqueIdCounter(uniqueIdCounter + 1);
    };

    const removeStickman = () => {
        if (stickmen.length == 1) {
            setUniqueIdCounter(0);
        }

        if (selectedNode && selectedNodeId !== null) {
            const newStickmen = stickmen.filter((stickman) => stickman.id !== selectedNodeId);
            setStickmen(newStickmen);
            setSelectedNode(null);
            setSelectedNodeId(null);
        }
    };

    const bringForward = () => {
        if (selectedNode) {
            const group = selectedNode as Konva.Group;
            const parent = group.getParent();
            const children = parent.getChildren();
            const backgroundIndex = children.indexOf(parent.findOne("Rect"));

            const maxZIndex = children.length - 2; // Exclude the background and the transformer

            if (group.getZIndex() > backgroundIndex && group.getZIndex() < maxZIndex) {
                group.moveUp();
                group.getLayer()?.batchDraw();
            }
        }
    };

    const bringBackward = () => {
        if (selectedNode) {
            const group = selectedNode as Konva.Group;
            const parent = group.getParent();
            const backgroundIndex = parent.getChildren().indexOf(parent.findOne("Rect"));

            if (group.getZIndex() > backgroundIndex + 1) {
                group.moveDown();
                group.getLayer()?.batchDraw();
            }
        }
    };

    const [selectedNode, setSelectedNode] = useState<Konva.Node | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);


    return (
        <div>
            <div>
                <button onClick={addStickman}>Add</button>
                <button onClick={removeStickman}>Remove</button>
                <button onClick={bringForward}>Bring forward</button>
                <button onClick={bringBackward}>Bring backward</button>
                <Stage width={512} height={512}>
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
