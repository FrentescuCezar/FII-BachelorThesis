import React, { useState, useEffect } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Stickman from './Components/Stickman/Stickman';
import StickmanTransformer from './Components/Stickman/StickmanTransformer';
import Konva from 'konva';

const PaintPage: React.FC = () => {
    const [stickmen, setStickmen] = useState<{ x: number; y: number }[]>([]);

    const addStickman = () => {
        setStickmen([...stickmen, { x: 256, y: 256 - 120 }]);
    };

    const [selectedNode, setSelectedNode] = useState<Konva.Node | null>(null);

    return (
        <div>
            <div>
                <button onClick={addStickman}>Add</button>
                <Stage width={512} height={512}>
                    <Layer>
                        <Rect width={512} height={512} fill="black" onMouseDown={(e) => setSelectedNode(null)} />
                        {stickmen.map((stickman, index) => (
                            <Stickman
                                key={index}
                                x={stickman.x}
                                y={stickman.y}
                                draggable
                                onSelect={(node) => setSelectedNode(node)}
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
