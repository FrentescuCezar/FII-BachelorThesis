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
import DepthMapModal from './Components/DepthMaps/DepthMapModal';
import { Positions } from '../../models/PositionsModel';

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
            submitPositions(sceneJson, stickmanBase64, imageBase64, authState);
            setSubmitClicked(false);  // reset after submission
        }
    }, [submitClicked, imageBase64, stickmanBase64]);




    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    // States for modals
    const [showDepthMap, setShowDepthMap] = useState(false);
    const [showPositions, setShowPositions] = useState(false);

    // Handlers for modals
    const handleCloseDepthMap = () => setShowDepthMap(false);
    const handleShowDepthMap = () => setShowDepthMap(true);

    const handleClosePositions = () => setShowPositions(false);
    const handleShowPositions = () => setShowPositions(true);






    const [page, setPage] = useState(0);
    const [positions, setPositions] = useState<Positions[]>([]);
    const [lastPage, setLastPage] = useState(false);
    useEffect(() => {
        if (!authState || !authState.accessToken) return;

        fetch(`http://localhost:8081/api/positions/recentByUsername?page=${page}&size=3`, {
            headers: {
                Authorization: `Bearer ${authState.accessToken.accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setPositions(data.content);
                setPage(data.number);  // current page
                setLastPage(data.last);  // last page
            })
            .catch((err) => console.error(err));
    }, [page, authState]);


    const [isHovered, setIsHovered] = useState<number | null>(null);



    return (
        <div>
            <div>
                <button onClick={() => addStickman(stickmen, setStickmen, uniqueIdCounter, setUniqueIdCounter)}>Add</button>
                <button onClick={() => removeNode(selectedNode, selectedNodeId, stickmen, setStickmen, setSelectedNode, setSelectedNodeId, images, setImages)}>Remove</button>
                <button onClick={() => bringForward(selectedNode)}>Bring forward</button>
                <button onClick={() => bringBackward(selectedNode)}>Bring backward</button>
                <button onClick={handleOnSubmit}>Submit Position</button>

                <Button variant="primary" onClick={handleShowDepthMap}>
                    Load DepthMaps
                </Button>

                <Button variant="primary" onClick={handleShowPositions}>
                    Load Positions
                </Button>

                <DepthMapModal
                    show={showDepthMap}
                    handleClose={handleCloseDepthMap}
                    addImage={addImage}
                    images={images}
                    setImages={setImages}
                    uniqueIdCounter={uniqueIdCounter}
                    setUniqueIdCounter={setUniqueIdCounter}
                />



                <Modal show={showPositions} style={{ maxWidth: '90%' }} onHide={handleClosePositions}>
                    <Modal.Header closeButton>
                        <Modal.Title>Load Positions</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                        }}>
                            {positions.map((position) => (
                                <div
                                    style={{
                                        width: '30%', // Change this value to adjust the size of the boxes
                                        cursor: 'pointer',
                                        position: 'relative',
                                        margin: '0 1%',
                                    }}
                                    onClick={() => {
                                        loadScene(position.positions, setStickmen, setImages, setStickmanScales);
                                        handleClose();
                                    }}
                                    onMouseEnter={() => {
                                        const customImgElement = document.getElementById(`custom-image-${position.id}`);
                                        const generatedImgElement = document.getElementById(`generated-image-${position.id}`);
                                        const stickmanImgElement = document.getElementById(`stickman-image-${position.id}`);

                                        if (customImgElement) {
                                            customImgElement.style.opacity = "1";
                                        }
                                        if (generatedImgElement) {
                                            generatedImgElement.style.opacity = "0.5"; // lower opacity to reduce brightness
                                        }
                                        if (stickmanImgElement) {
                                            stickmanImgElement.style.opacity = "1";
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        const customImgElement = document.getElementById(`custom-image-${position.id}`);
                                        const generatedImgElement = document.getElementById(`generated-image-${position.id}`);
                                        const stickmanImgElement = document.getElementById(`stickman-image-${position.id}`);

                                        if (customImgElement) {
                                            customImgElement.style.opacity = "0";
                                        }
                                        if (generatedImgElement) {
                                            generatedImgElement.style.opacity = "1"; // restore opacity
                                        }
                                        if (stickmanImgElement) {
                                            stickmanImgElement.style.opacity = "0.5";
                                        }
                                    }}
                                >
                                    <img
                                        id={`generated-image-${position.id}`}
                                        src={position.generatedImage}
                                        alt="Generated"
                                        style={{
                                            width: '100%',
                                            objectFit: 'contain',
                                            transition: 'opacity 0.3s ease-in-out',
                                            filter: isHovered === position.id ? 'brightness(50%)' : 'brightness(100%)'
                                        }}
                                        className="mb-3"
                                    />
                                    <img
                                        id={`stickman-image-${position.id}`}
                                        src={position.stickmanImage}
                                        alt="Stickman"
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', objectFit: 'contain', opacity: 0.5, transition: 'opacity 0.3s ease-in-out' }}
                                    />
                                    <img
                                        id={`custom-image-${position.id}`}
                                        src={position.imageCustomImage}
                                        alt="Custom"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            objectFit: 'contain',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease-in-out' // Added transition
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" onClick={() => setPage(page + 1)} disabled={lastPage}>
                            Next Page
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
