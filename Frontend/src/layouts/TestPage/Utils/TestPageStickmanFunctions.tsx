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

export const getBase64Image = (stageRef: React.RefObject<Konva.Stage>) => {
    if (stageRef.current) {
        const base64Image = stageRef.current.toDataURL();

        console.log(base64Image);
        // You can now use the base64Image in your JSON payload or for any other purpose
    }
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
};

type StickmanType = {
    id: number;
    x: number;
    y: number;
    joints: Array<{ x: number; y: number }>;
};

type ImageType = {
    id: number;
    x: number;
    y: number;
    url: string;
};

export const saveStickmen = (
    stickmen: StickmanType[],
    stickmanScales: { [key: number]: StickmanScale },
    setStickmenJson: Dispatch<SetStateAction<string>>
) => {
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

export const loadStickmen = (
    stickmenJson: string,
    setStickmen: Dispatch<SetStateAction<StickmanType[]>>,
    setStickmanScales: Dispatch<SetStateAction<{ [key: number]: StickmanScale }>>
) => {
    try {
        if (stickmenJson !== "") {
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

export const addImage = (
    images: ImageType[],
    setImages: Dispatch<SetStateAction<ImageType[]>>,
    uniqueIdCounter: number,
    setUniqueIdCounter: Dispatch<SetStateAction<number>>
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