import React, { useRef, useEffect, useState, MouseEvent } from 'react';

import './Css/Canvas.css';

const MAX_HISTORY_SIZE = 100;


interface CanvasProps {
    color: string;
    brushSize: number;
    tool: 'pen' | 'eraser';
    undo: () => void;
    redo: () => void;
    saveCanvasState: () => void;
    context: CanvasRenderingContext2D | null;
    setContext: (context: CanvasRenderingContext2D | null) => void;
    bufferDimensions: { width: number; height: number };
}

const CanvasCustom: React.FC<CanvasProps> = ({ color,
    brushSize,
    tool,
    undo,
    redo,
    saveCanvasState,
    context,
    setContext,
    bufferDimensions
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [drawing, setDrawing] = useState(false);

    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    const [canvasImage, setCanvasImage] = useState<ImageData | null>(null);

    const brushSizeIndicatorRef = useRef<HTMLDivElement | null>(null);
    const [showBrushSizeIndicator, setShowBrushSizeIndicator] = useState(false);





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
            const renderCtx = canvasRef.current.getContext('2d', { willReadFrequently: true });
            if (renderCtx) {

                setContext(renderCtx);
            }
        }
    }, [canvasRef, setContext]);

    //Make the brush more smooth
    useEffect(() => {
        if (context) {
            context.lineJoin = "round";
            context.lineCap = "round";
        }
    }, [context]);

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
        updateBrushSizeIndicator(event);

        if (!context || !drawing) return;
        const [x, y] = getMouseCoords(event);
        context.lineTo(x, y);
        context.lineWidth = brushSize;
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.globalCompositeOperation = tool === 'pen' ? 'source-over' : 'destination-out';
        context.stroke();
    };

    const updateBrushSizeIndicator = (event: MouseEvent<HTMLCanvasElement>) => {
        if (brushSizeIndicatorRef.current && showBrushSizeIndicator) {
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            brushSizeIndicatorRef.current.style.left = `${event.clientX + scrollX}px`;
            brushSizeIndicatorRef.current.style.top = `${event.clientY + scrollY}px`;
        }

    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLCanvasElement>) => {
        //handleMouseUp();
        setShowBrushSizeIndicator(false);
    };

    useEffect(() => {
        if (brushSizeIndicatorRef.current) {
            brushSizeIndicatorRef.current.style.width = `${brushSize}px`;
            brushSizeIndicatorRef.current.style.height = `${brushSize}px`;
            brushSizeIndicatorRef.current.style.marginLeft = `-${brushSize / 2}px`;
            brushSizeIndicatorRef.current.style.marginTop = `-${brushSize / 2}px`;
        }
    }, [brushSize]);

    const handleMouseEnter = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (drawing) {
            const [x, y] = getMouseCoords(event);
            context?.moveTo(x, y);
        }
        setShowBrushSizeIndicator(true);
    };

    const handleMouseUp = () => {
        if (!context) return;
        context.closePath();
        setDrawing(false);
        saveCanvasState();
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




    return (
        <div>
            <div
                ref={brushSizeIndicatorRef}
                className="brush-size-indicator"
                style={{
                    display: showBrushSizeIndicator ? 'block' : 'none',
                    width: `${brushSize}px`,
                    height: `${brushSize}px`,
                    marginLeft: `-${brushSize / 2}px`,
                    marginTop: `-${brushSize / 2}px`,
                }}
            />
            <div className="canvas-container">
                <canvas
                    ref={canvasRef}
                    width={bufferDimensions.width}
                    height={bufferDimensions.height}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}
                    className="canvas"
                />
            </div>
        </div>
    );
}
export default CanvasCustom;
