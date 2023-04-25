// paintPageFunctions.ts
import Konva from 'konva';

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

export const removeStickman = (selectedNode: Konva.Node | null, selectedNodeId: number | null, stickmen: { id: number; x: number; y: number }[], setStickmen: Function, setSelectedNode: Function, setSelectedNodeId: Function) => {
    if (selectedNode && selectedNodeId !== null) {
        const newStickmen = stickmen.filter((stickman) => stickman.id !== selectedNodeId);
        setStickmen(newStickmen);
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


const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const loadFromLocalStorage = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

