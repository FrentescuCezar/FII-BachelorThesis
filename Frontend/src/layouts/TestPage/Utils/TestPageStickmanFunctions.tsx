// paintPageFunctions.ts
import Konva from 'konva';
import { Dispatch, SetStateAction } from 'react';

export const addStickman = (
    stickmen: {
        id: number; x: number; y: number; joints: Array<{ x: number; y: number }>;
    }[],
    setStickmen: Function,
    uniqueIdCounter: number,
    setUniqueIdCounter: Function
) => {
    setStickmen([
        ...stickmen,
        {
            id: uniqueIdCounter,
            x: 256,
            y: 256 - 120,
            joints: [
                { x: 0, y: 0 }, // neck
                { x: -40, y: 20 }, // left shoulder
                { x: 40, y: 20 }, // right shoulder
                { x: -60, y: 80 }, // left elbow
                { x: 60, y: 80 }, // right elbow
                { x: -70, y: 140 }, // left hand
                { x: 70, y: 140 }, // right hand
                { x: -40, y: 190 }, // left knee
                { x: 40, y: 190 }, // right knee
                { x: -50, y: 260 }, // left foot
                { x: 50, y: 260 }, // right foot
                { x: 0, y: 20 }, // chest
                { x: -20, y: 110 }, // left hip
                { x: 20, y: 110 } // right hip
            ],
        },
    ]);
    setUniqueIdCounter(uniqueIdCounter + 1);
};

export const removeNode = (selectedNode: Konva.Node | null, selectedNodeId: number | null, stickmen: { id: number; x: number; y: number }[], setStickmen: Function, setSelectedNode: Function, setSelectedNodeId: Function, images: { id: number; x: number; y: number }[], setImages: Function) => {
    if (selectedNode && selectedNodeId !== null) {
        const newStickmen = stickmen.filter((stickman) => stickman.id !== selectedNodeId);
        setStickmen(newStickmen);
        setSelectedNode(null);
        setSelectedNodeId(null);
    }
    if (selectedNode && selectedNodeId !== null) {
        const newImages = images.filter((image) => image.id !== selectedNodeId);
        setImages(newImages);
        setSelectedNode(null);
        setSelectedNodeId(null);
    }
};

export const bringForward = (selectedNode: Konva.Node | null) => {
    if (selectedNode) {
        const parent = selectedNode.getParent();
        const children = parent.getChildren();
        const backgroundIndex = children.indexOf(parent.findOne("Rect"));

        const maxZIndex = children.length - 2; // Exclude the background and the transformer

        if (selectedNode.getZIndex() > backgroundIndex && selectedNode.getZIndex() < maxZIndex) {
            selectedNode.moveUp();
            selectedNode.getLayer()?.batchDraw();
        }
    }
};


export const bringBackward = (selectedNode: Konva.Node | null) => {
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





export const getBase64Image = (stageRef: React.RefObject<Konva.Stage>, base64Image: string, setBase64Image: React.Dispatch<React.SetStateAction<string>>, nodesToInclude: number[]): string => {
    if (!stageRef.current) {
        setBase64Image('')
        return '';
    }

    const stage = stageRef.current;

    // Create a temporary container element
    const tempContainer = document.createElement('div');

    // Create a new stage with the same dimensions
    const tempStage = new Konva.Stage({
        container: tempContainer,
        width: stage.width(),
        height: stage.height(),
    });

    // Create a new layer for the cloned image nodes
    const tempLayer = new Konva.Layer();

    // Find and clone the specified image nodes
    nodesToInclude.forEach((id) => {
        const node = stage.findOne(`#${id}`);
        if (node && (node instanceof Konva.Group || node instanceof Konva.Image)) {
            const clone = node.clone();
            tempLayer.add(clone);
        }
    });

    // Add the layer to the stage
    tempStage.add(tempLayer);

    // Check if the layer is empty
    if (!tempLayer.children || tempLayer.children.length === 0) {
        tempLayer.destroy();
        tempStage.destroy();
        tempContainer.remove();
        setBase64Image('')
        return '';
    }

    // Render the stage to an off-screen canvas
    const canvas = tempStage.toCanvas();

    // Get the data URL of the canvas
    const dataUrl = canvas.toDataURL();
    setBase64Image(dataUrl)

    // Clean up
    tempLayer.destroy();
    tempStage.destroy();
    tempContainer.remove();


    return dataUrl;
};















export const handleJointsUpdate = (
    id: number,
    joints: Array<{ x: number; y: number }>,
    stickmen: {
        id: number;
        x: number;
        y: number;
        joints: Array<{ x: number; y: number }>;
    }[],
    setStickmen: Function
) => {
    setStickmen(
        stickmen.map((stickman) => {
            if (stickman.id === id) {
                return { ...stickman, joints };
            }
            return stickman;
        })
    );
};



type StickmanScale = {
    scaleX: number;
    scaleY: number;
    rotation: number;

};

type StickmanType = {
    id: number;
    x: number;
    y: number;
    joints: Array<{ x: number; y: number }>;
};

export const saveScene = (
    stickmen: StickmanType[],
    images: ImageType[],
    stickmanScales: { [key: number]: StickmanScale },
    setSceneJson: Dispatch<SetStateAction<string>>
) => {
    const stickmenToSave = stickmen.map(stickman => ({
        ...stickman,
        scaleX: stickmanScales[stickman.id]?.scaleX || 1,
        scaleY: stickmanScales[stickman.id]?.scaleY || 1,
        joints: stickman.joints,
        rotation: stickmanScales[stickman.id]?.rotation || 0,
    }));

    const imagesToSave = images.map(image => ({
        ...image,
        scaleX: stickmanScales[image.id]?.scaleX || 1,
        scaleY: stickmanScales[image.id]?.scaleY || 1,
        rotation: stickmanScales[image.id]?.rotation || 1,
    }));

    const newSceneJson = JSON.stringify({ stickmen: stickmenToSave, images: imagesToSave });
    setSceneJson(newSceneJson);

    // Create a Blob object from the JSON string
    const blob = new Blob([newSceneJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a link element, set the download attribute and click it
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scene.json';
    link.click();
    console.log(newSceneJson);
};

export const loadScene = (
    sceneJson: string,
    setStickmen: Dispatch<SetStateAction<StickmanType[]>>,
    setImages: Dispatch<SetStateAction<ImageType[]>>,
    setStickmanScales: Dispatch<SetStateAction<{ [key: number]: StickmanScale }>>
) => {
    try {
        if (sceneJson !== "") {
            const loadedScene = JSON.parse(sceneJson);
            const loadedStickmen = loadedScene.stickmen;
            const loadedImages = loadedScene.images;

            // update stickmanScales state for stickmen
            const newStickmanScales: { [key: number]: StickmanScale } = {};
            loadedStickmen.forEach((stickman: any) => {
                newStickmanScales[stickman.id] = {
                    scaleX: stickman.scaleX,
                    scaleY: stickman.scaleY,
                    rotation: stickman.rotation
                };
            });

            // update stickmanScales state for images
            loadedImages.forEach((image: any) => {
                newStickmanScales[image.id] = {
                    scaleX: image.scaleX,
                    scaleY: image.scaleY,
                    rotation: image.rotation
                };
            });

            setStickmanScales(newStickmanScales);
            setStickmen(loadedStickmen);
            setImages(loadedImages);
        }
    } catch (error) {
        console.error("Error loading scene:", error);
    }
};


type ImageType = {
    id: number;
    x: number;
    y: number;
    url: string;

};

export const addImage = (
    images: ImageType[],
    urlBase64: string,
    setImages: Dispatch<SetStateAction<ImageType[]>>,
    uniqueIdCounter: number,
    setUniqueIdCounter: Dispatch<SetStateAction<number>>
) => {
    const image = new window.Image();
    image.onload = () => {
        const stageSize = 512;
        const imageSize = Math.max(image.width, image.height);

        let scaleX = 1;
        let scaleY = 1;

        if (imageSize > stageSize) {
            scaleX = stageSize / imageSize;
            scaleY = stageSize / imageSize;
        }

        const canvas = document.createElement('canvas');
        const canvasContext = canvas.getContext('2d');

        if (canvasContext) {
            const scaledWidth = image.width * scaleX;
            const scaledHeight = image.height * scaleY;

            canvas.width = scaledWidth;
            canvas.height = scaledHeight;
            canvasContext.drawImage(image, 0, 0, scaledWidth, scaledHeight);

            const scaledUrlBase64 = canvas.toDataURL();

            const newImage = {
                id: uniqueIdCounter,
                x: 0,
                y: 0,
                url: scaledUrlBase64,
                scaleX,
                scaleY,
            };

            setImages([...images, newImage]);
            setUniqueIdCounter(uniqueIdCounter + 1);
        }

        // Clean up the temporary canvas
        canvas.remove();
    };

    image.src = urlBase64;
};
