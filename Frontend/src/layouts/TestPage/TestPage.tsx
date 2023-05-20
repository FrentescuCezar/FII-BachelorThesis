import React, { useState, useRef } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Stickman from './Components/Stickman/Stickman';
import StickmanTransformer from './Components/Stickman/StickmanTransformer';
import Konva from 'konva';
import { useStickmanScales } from './StickmanScalesProvider';

import {
    addStickman,
    removeStickman,
    bringForward,
    bringBackward,
    getBase64Image,
    handleJointsUpdate,
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

    type StickmanScale = {
        scaleX: number;
        scaleY: number;
    };

    const [stickmenJson, setStickmenJson] = useState<string>("");
    const saveStickmen = () => {
        const stickmenToSave = stickmen.map(stickman => ({
            ...stickman,
            scaleX: stickmanScales[stickman.id]?.scaleX || 1,
            scaleY: stickmanScales[stickman.id]?.scaleY || 1,
            joints: stickman.joints
        }));

        const newStickmenJson = JSON.stringify(stickmenToSave);
        setStickmenJson(newStickmenJson);
        console.log(newStickmenJson);
    };
    const loadStickmen = () => {
        try {
            if (stickmenJson != "") {
                const loadedStickmen = JSON.parse(stickmenJson);
                setStickmen(loadedStickmen);

                // update stickmanScales state
                const newStickmanScales: { [key: number]: StickmanScale } = {};
                loadedStickmen.forEach((stickman: any) => {
                    newStickmanScales[stickman.id] = {
                        scaleX: stickman.scaleX,
                        scaleY: stickman.scaleY,
                    };
                });
                setStickmanScales(newStickmanScales);
                setStickmen(loadedStickmen);
            }
        } catch (error) {
            console.error("Error loading stickmen:", error);
        }
    };


    const [images, setImages] = useState<{
        id: number;
        x: number;
        y: number;
        url: string;
    }[]>([]);

    const [nodeType, setNodeType] = useState<string | null>(null);


    const addImage = (
        images: { id: number; x: number; y: number; url: string; }[],
        setImages: { (value: React.SetStateAction<{ id: number; x: number; y: number; url: string; }[]>): void; (arg0: any[]): void; },
        uniqueIdCounter: number,
        setUniqueIdCounter: { (value: React.SetStateAction<number>): void; (arg0: any): void; }
    ) => {
        const newImage = {
            id: uniqueIdCounter,
            x: Math.random() * 100,  // or wherever you want to place the image
            y: Math.random() * 100,  // or wherever you want to place the image
            url: 'https://i.imgur.com/fHyEMsl.jpg',  // the URL of the image
        };

        setImages([...images, newImage]);
        setUniqueIdCounter(uniqueIdCounter + 1);
    };

    return (
        <div>
            <div>
                <button onClick={() => addStickman(stickmen, setStickmen, uniqueIdCounter, setUniqueIdCounter)}>Add</button>
                <button onClick={() => removeStickman(selectedNode, selectedNodeId, stickmen, setStickmen, setSelectedNode, setSelectedNodeId)}>Remove</button>
                <button onClick={() => bringForward(selectedNode)}>Bring forward</button>
                <button onClick={() => bringBackward(selectedNode)}>Bring backward</button>
                <button onClick={() => getBase64Image(stageRef)}>Save Image base64</button>
                <button onClick={saveStickmen}>Save</button>
                <button onClick={loadStickmen}>Load</button>
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
                                        [id]: { scaleX: newScaleX, scaleY: newScaleY },
                                    });
                                }}
                            />
                        ))}
                        {images.map((image, index) => (
                            <ImageWithTransformer
                                key={image.id}
                                id={image.id}
                                x={image.x}
                                y={image.y}
                                url={image.url}
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
