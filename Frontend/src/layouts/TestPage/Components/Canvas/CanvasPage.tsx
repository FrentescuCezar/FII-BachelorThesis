import { useState } from "react";
import ToolbarStable from "./ToolbarStable";
import CanvasCustom from "./CanvasCustom";

export const CanvasPage = () => {
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(4);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [bufferDimensions, setBufferDimensions] = useState({ width: 512, height: 512 });

    const [history, setHistory] = useState<ImageData[]>([new ImageData(bufferDimensions.width, bufferDimensions.height)]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const MAX_HISTORY_SIZE = 100;


    const undo = () => {
        if (historyIndex <= 0 || !context) return;

        setHistoryIndex((prevIndex) => prevIndex - 1);
        context.putImageData(history[historyIndex - 1], 0, 0);
    };

    const redo = () => {
        if (historyIndex >= history.length - 1 || !context) return;

        setHistoryIndex((prevIndex) => prevIndex + 1);
        context.putImageData(history[historyIndex + 1], 0, 0);
    };



    const saveCanvasState = () => {
        if (!context) return;

        // Remove all future states from the history stack when making a new change
        if (historyIndex !== history.length - 1) {
            setHistory((prevHistory) => prevHistory.slice(0, historyIndex + 1));
        }

        // Save the current canvas state
        const newCanvasState = context.getImageData(0, 0, bufferDimensions.width, bufferDimensions.height);

        // Check if the new state is different from the last state
        if (history.length === 0 || !history[history.length - 1].data.every((value, index) => value === newCanvasState.data[index])) {
            setHistory((prevHistory) => {
                if (prevHistory.length >= MAX_HISTORY_SIZE) {
                    return [...prevHistory.slice(1), newCanvasState];
                } else {
                    return [...prevHistory, newCanvasState];
                }
            });
            setHistoryIndex((prevIndex) => (prevIndex < MAX_HISTORY_SIZE - 1 ? prevIndex + 1 : prevIndex));
        }
    };




    return (
        <div>
            <ToolbarStable
                color={color}
                setColor={setColor}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                tool={tool}
                setTool={setTool}
                undo={undo}
                redo={redo}
            />
            <CanvasCustom
                color={color}
                brushSize={brushSize}
                tool={tool}
                undo={undo}
                redo={redo}
                saveCanvasState={saveCanvasState}
                context={context}
                setContext={setContext}
                bufferDimensions={bufferDimensions}
            />
        </div>
    );

};