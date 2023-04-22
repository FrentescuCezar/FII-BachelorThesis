import React, { useRef, useEffect, useState, MouseEvent } from 'react';

import '../Css/Canvas.css';

const MAX_HISTORY_SIZE = 100;


interface CanvasProps {
    color: string;
    brushSize: number;
    tool: 'pen' | 'eraser';
    setUndo: (undo: () => void) => void;
    setRedo: (redo: () => void) => void;

}

const Canvas: React.FC<CanvasProps> = ({ color, brushSize, tool, setUndo, setRedo }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [bufferDimensions, setBufferDimensions] = useState({ width: 512, height: 512 });

    const [canvasImage, setCanvasImage] = useState<ImageData | null>(null);

    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const getMouseCoords = (event: React.MouseEvent<HTMLCanvasElement>): [number, number] => {
        const canvas = event.currentTarget;
        if (!canvas) return [0, 0];

        const canvasRect = canvas.getBoundingClientRect();
        const scaleX = bufferDimensions.width / canvasRect.width;
        const scaleY = bufferDimensions.height / canvasRect.height;

        const x = (event.clientX - canvasRect.left) * scaleX;
        const y = (event.clientY - canvasRect.top) * scaleY;

        return [x, y];
    };

    useEffect(() => {
        if (canvasRef.current) {
            const renderCtx = canvasRef.current.getContext('2d');
            if (renderCtx) {
                setContext(renderCtx);
            }
        }
    }, [canvasRef]);

    useEffect(() => {
        const handleResize = () => {
            if (context) {
                const tempCanvasImage = context.getImageData(0, 0, dimensions.width, dimensions.height);
                setCanvasImage(tempCanvasImage);
            }

            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [context, dimensions.height, dimensions.width]);

    useEffect(() => {
        if (context && canvasImage) {
            context.putImageData(canvasImage, 0, 0);
        }
    }, [context, dimensions]);





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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'z') {
                undo();
            } else if (event.ctrlKey && event.key === 'y') {
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [undo, redo]);




    const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        if (!context || !drawing) return;
        const [x, y] = getMouseCoords(event);
        context.lineTo(x, y);
        context.lineWidth = brushSize;
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.globalCompositeOperation = tool === 'pen' ? 'source-over' : 'destination-out';
        context.stroke();
    };

    const handleMouseUp = () => {
        if (!context) return;
        context.closePath();
        setDrawing(false);
        saveCanvasState();
    };


    const saveCanvasState = () => {
        if (!context) return;

        // Remove all future states from the history stack when making a new change
        if (historyIndex !== history.length - 1) {
            setHistory((prevHistory) => prevHistory.slice(0, historyIndex + 1));
        }

        // Save the current canvas state
        const newCanvasState = context.getImageData(0, 0, bufferDimensions.width, bufferDimensions.height);

        setHistory((prevHistory) => {
            if (prevHistory.length >= MAX_HISTORY_SIZE) {
                return [...prevHistory.slice(1), newCanvasState];
            } else {
                return [...prevHistory, newCanvasState];
            }
        });
        setHistoryIndex((prevIndex) => (prevIndex < MAX_HISTORY_SIZE - 1 ? prevIndex + 1 : prevIndex));
    };


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'z') {
                undo();
            } else if (event.ctrlKey && event.key === 'y') {
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [undo, redo]);


    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!context) return;
        const [x, y] = getMouseCoords(event);
        setDrawing(true);
        context.beginPath();
        context.moveTo(x, y);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('mousedown', (event) => {
                handleMouseDown(event as unknown as React.MouseEvent<HTMLCanvasElement>);
            });
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('mousedown', (event) => {
                    handleMouseDown(event as unknown as React.MouseEvent<HTMLCanvasElement>);
                });
            }
        };
    }, [context]);

    const undoCanvas = () => {
        if (canvasRef.current) {
            undo();
        }
    };

    const redoCanvas = () => {
        if (canvasRef.current) {
            redo();
        }
    };



    return (
        <canvas
            ref={canvasRef}
            width={bufferDimensions.width}
            height={bufferDimensions.height}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="canvas"
        />
    );
};

export default Canvas;
