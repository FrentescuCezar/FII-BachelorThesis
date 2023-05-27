import React, { useState, useRef, useEffect } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Stickman from './Components/Stickman/Stickman';
import StickmanTransformer from './Components/Stickman/TransformerCustom';
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
import ImageCustom from './Image/Image';
import { useOktaAuth } from '@okta/okta-react';
import { submitPositions } from './Api/PosingApi';
import { Button, Modal } from 'react-bootstrap';

const PaintPage: React.FC = () => {

    const { authState } = useOktaAuth();

    console.log(authState)

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

    const loadSceneFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const sceneJson = event.target?.result as string;
                loadScene(sceneJson, setStickmen, setImages, setStickmanScales);
            };

            reader.readAsText(file);
        }
    };

    const [imageBase64, setImageBase64] = useState<string>("");
    const [stickmanBase64, setStickmanBase64] = useState<string>("");
    const [submitClicked, setSubmitClicked] = useState(false);

    // Handle onSubmit - set both images and set submitClicked to true
    const handleOnSubmit = () => {
        getBase64Image(stageRef, imageBase64, setImageBase64, images.map(image => image.id));
        getBase64Image(stageRef, stickmanBase64, setStickmanBase64, stickmen.map(stickman => stickman.id));
        saveScene(stickmen, images, stickmanScales, setSceneJson)
        setSubmitClicked(true);
    };

    useEffect(() => {
        if (submitClicked && (imageBase64 || stickmanBase64)) {
            submitPositions(sceneJson, imageBase64, stickmanBase64, authState);
            setSubmitClicked(false);  // reset after submission
        }
    }, [submitClicked, imageBase64, stickmanBase64]);

    type DepthMap = {
        id: number;
        imageBase64: string;
        category: string;
    };

    const [categories, setCategories] = useState<string[]>([]);
    const [depthMaps, setDepthMaps] = useState<DepthMap[]>([]);

    async function fetchCategories() {
        const res = await fetch("http://localhost:8081/api/depthmaps");
        const data = await res.json();

        const categories = Array.from(new Set<string>(data.map((item: DepthMap) => item.category)));
        setCategories(categories);
    }

    async function fetchDepthMaps(category: string) {
        const res = await fetch(`http://localhost:8081/api/depthmaps/category/${category}`);
        const data = await res.json();

        setDepthMaps(data);
    }

    useEffect(() => {
        fetchCategories();
    }, []);


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        fetchCategories();
        setShow(true);
    }

    return (
        <div>
            <div>
                <button onClick={() => addStickman(stickmen, setStickmen, uniqueIdCounter, setUniqueIdCounter)}>Add</button>
                <button onClick={() => removeNode(selectedNode, selectedNodeId, stickmen, setStickmen, setSelectedNode, setSelectedNodeId, images, setImages)}>Remove</button>
                <button onClick={() => bringForward(selectedNode)}>Bring forward</button>
                <button onClick={() => bringBackward(selectedNode)}>Bring backward</button>
                <input type="file" id="scene-file" style={{ display: 'none' }} onChange={loadSceneFromFile} />
                <button onClick={() => document.getElementById('scene-file')?.click()}>Load from file</button>
                <button onClick={handleOnSubmit}>Submit Position</button>

                <Button variant="primary" onClick={handleShow}>
                    Load DepthMaps
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select a category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {categories.map(category => (
                            <Button variant="secondary" onClick={() => fetchDepthMaps(category)} key={category}>
                                {category}
                            </Button>
                        ))}
                        <div style={{
                            display: 'grid',
                            gridGap: '1em',
                            gridTemplateColumns: 'repeat(3, 1fr)'  // 3 images per row
                        }}>
                            {depthMaps.map(depthMap => (
                                <div
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                                        transition: 'box-shadow 0.3s ease-in-out',  // smooth transition for the hover effect
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',  // center the content vertically
                                        width: '128px',
                                        height: '128px',
                                        boxSizing: 'border-box'  // include padding and border in the dimensions
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.5)'}  // increase the box shadow on hover
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)'}  // reset box shadow when mouse leaves
                                    key={depthMap.id}
                                >
                                    <img
                                        src={`${depthMap.imageBase64}`}
                                        alt={depthMap.category}
                                        onClick={() => addImage(images, depthMap.imageBase64, setImages, uniqueIdCounter, setUniqueIdCounter)}
                                        style={{
                                            cursor: 'pointer',
                                            maxWidth: '100%',  // scale the image to fit within the box
                                            maxHeight: '100%',  // scale the image to fit within the box
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>





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
                                rotation={stickmanScales[stickman.id]?.rotation || 0}

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


                            <ImageCustom
                                key={image.id}
                                id={image.id}
                                x={image.x}
                                y={image.y}
                                url={image.url}
                                scaleX={stickmanScales[image.id]?.scaleX || 1}
                                scaleY={stickmanScales[image.id]?.scaleY || 1}
                                rotation={stickmanScales[image.id]?.rotation || 0}
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
