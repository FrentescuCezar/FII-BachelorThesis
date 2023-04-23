import React, { useState } from 'react';
import CanvasStable from './Components/Canvas/CanvasStable';
import Toolbar from './Components/Canvas/ToolbarStable';
import { Layer, Stage } from 'react-konva';
import Stickman from './Components/Stickman/Stickman';

const PaintPage: React.FC = () => {
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [bufferDimensions, setBufferDimensions] = useState({ width: 512, height: 512 });

    const [history, setHistory] = useState<ImageData[]>([new ImageData(bufferDimensions.width, bufferDimensions.height)]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const MAX_HISTORY_SIZE = 100;

    const [stickmen, setStickmen] = useState<{ x: number; y: number }[]>([])
    const scaleFactor = Math.min(window.innerWidth / 512, window.innerHeight / 512);
    ;

    const addStickman = () => {
        setStickmen([...stickmen, { x: 256 - 80, y: 256 - 190 }]);
    };

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
            <Toolbar
                color={color}
                setColor={setColor}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                tool={tool}
                setTool={setTool}
                undo={undo}
                redo={redo}
            />
            <CanvasStable
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

            <div>
                <button onClick={addStickman}>Add</button>
                <div
                    style={{
                        backgroundColor: 'black',
                        width: 512,
                        height: 512,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <Stage
                        width={512}
                        height={512}
                        scaleX={scaleFactor}
                        scaleY={scaleFactor}
                    >
                        <Layer>
                            <rect
                                x={0}
                                y={0}
                                width={512}
                                height={512}
                                fill="black"
                                onClick={addStickman}
                            />
                            {stickmen.map((stickman, index) => (
                                <Stickman
                                    key={index}
                                    x={stickman.x}
                                    y={stickman.y}
                                    draggable
                                />
                            ))}
                        </Layer>
                    </Stage>
                </div>
            </div>
        </div>
    );
}

export default PaintPage;
