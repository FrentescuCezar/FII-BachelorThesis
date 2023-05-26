import React, { useState, useRef } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Stickman from './Components/Stickman/Stickman';
import StickmanTransformer from './Components/Stickman/StickmanTransformer';
import Konva from 'konva';
import { useStickmanScales } from './Utils/StickmanScalesProvider';

import {
    addStickman,
    removeNode,
    bringForward,
    bringBackward,
    handleJointsUpdate,
    getBase64Image,
    saveScene,
    loadScene,
    addImage
} from './Utils/TestPageStickmanFunctions';
import ImageWithTransformer from './Image/ImageWithTransformer';

const PaintPage: React.FC = () => {
    const [stickmen, setStickmen] = useState<{
        id: number;
        x: number;
        y: number;
        joints: Array<{ x: number; y: number }>;
    }[]>([]);

    const [uniqueIdCounter, setUniqueIdCounter] = useState<number>(0);
    const [selectedNode, setSelectedNode] = useState<Konva.Node | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

    const stageRef = useRef<Konva.Stage>(null);

    const { stickmanScales, setStickmanScales } = useStickmanScales();
    const [sceneJson, setSceneJson] = useState<string>("");


    const [images, setImages] = useState<{
        id: number;
        x: number;
        y: number;
        url: string;
    }[]>([]);

    const [nodeType, setNodeType] = useState<string | null>(null);

    const handleRotateChange = (id: number, newRotation: number) => {
        setStickmanScales(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                rotation: newRotation
            }
        }));
    };

    return (
        <div>
            <div>
                <button onClick={() => addStickman(stickmen, setStickmen, uniqueIdCounter, setUniqueIdCounter)}>Add</button>
                <button onClick={() => removeNode(selectedNode, selectedNodeId, stickmen, setStickmen, setSelectedNode, setSelectedNodeId, images, setImages)}>Remove</button>
                <button onClick={() => bringForward(selectedNode)}>Bring forward</button>
                <button onClick={() => bringBackward(selectedNode)}>Bring backward</button>
                <button onClick={() => getBase64Image(stageRef)}>Save Image base64</button>
                <button onClick={() => saveScene(stickmen, images, stickmanScales, setSceneJson)}>Save</button>
                <button onClick={() => loadScene(sceneJson, setStickmen, setImages, setStickmanScales)}>Load</button>
                <button onClick={() => addImage(images, setImages, uniqueIdCounter, setUniqueIdCounter)}>Add Image</button>

                <Stage ref={stageRef} width={512} height={512}>
                    <Layer>
                        <Rect
                            width={512}
                            height={512}
                            fill="black"
                            onMouseDown={(e) => {
                                setSelectedNode(null);
                            }}
                        />
                        {stickmen.map((stickman, index) => (
                            <Stickman
                                key={stickman.id}
                                id={stickman.id}
                                x={stickman.x}
                                y={stickman.y}
                                scaleX={stickmanScales[stickman.id]?.scaleX || 1}
                                scaleY={stickmanScales[stickman.id]?.scaleY || 1}
                                draggable
                                onSelect={(node, id) => {
                                    setSelectedNode(node);
                                    setSelectedNodeId(id);
                                    setNodeType('stickman');  // Add this line in Stickman

                                }}
                                joints={stickman.joints}
                                onJointsUpdate={(id, joints) =>
                                    handleJointsUpdate(stickman.id, joints, stickmen, setStickmen)
                                }
                                onDragEnd={(id, newX, newY) => {
                                    const newStickmen = stickmen.map(stickman => {
                                        if (stickman.id === id) {
                                            return { ...stickman, x: newX, y: newY };
                                        }
                                        return stickman;
                                    });
                                    setStickmen(newStickmen);
                                }}
                                onScaleChange={(id, newScaleX, newScaleY) => {
                                    setStickmanScales({
                                        ...stickmanScales,
                                        [id]: { scaleX: newScaleX, scaleY: newScaleY, rotation: stickmanScales[id]?.rotation || 0 },
                                    });
                                }}
                                onRotateChange={handleRotateChange} // new callback
                            />
                        ))}
                        {images.map((image, index) => (
                            <ImageWithTransformer
                                key={image.id}
                                id={image.id}
                                x={image.x}
                                y={image.y}
                                url={image.url}
                                scaleX={stickmanScales[image.id]?.scaleX || 1}
                                scaleY={stickmanScales[image.id]?.scaleY || 1}
                                draggable
                                onSelect={(node, id) => {
                                    setSelectedNode(node);
                                    setSelectedNodeId(id);
                                    setNodeType('image');
                                }}
                                onDragEnd={(id, newX, newY) => {
                                    const newImages = images.map(image => {
                                        if (image.id === id) {
                                            return { ...image, x: newX, y: newY };
                                        }
                                        return image;
                                    });
                                    setImages(newImages);
                                }}
                                isSelected={selectedNodeId === image.id && nodeType === 'image'} // add this line
                                onScaleChange={(id, newScaleX, newScaleY) => {
                                    setStickmanScales({
                                        ...stickmanScales,
                                        [id]: { scaleX: newScaleX, scaleY: newScaleY, rotation: stickmanScales[id]?.rotation || 0 },
                                    });
                                }}
                                onRotateChange={handleRotateChange} // new callback
                            />
                        ))}
                        <StickmanTransformer selectedNode={selectedNode} nodeType={nodeType} />
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default PaintPage;
