import { useEffect, useState } from "react";
import ToolbarStable from "./ToolbarStable";
import CanvasCustom from "./CanvasCustom";

export const CanvasPage = () => {
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(4);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [bufferDimensions] = useState({ width: 512, height: 512 });

    const [history, setHistory] = useState<ImageData[]>([new ImageData(bufferDimensions.width, bufferDimensions.height)]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const MAX_HISTORY_SIZE = 100;

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [lastUploadedImage, setLastUploadedImage] = useState<string | null>(null);



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

    const saveBase64Image = () => {
        if (context) {
            // Create a new canvas to avoid mutating the existing one
            const newCanvas = document.createElement('canvas');
            const newContext = newCanvas.getContext('2d');

            // Set the dimensions of the new canvas
            newCanvas.width = 512;
            newCanvas.height = 512;

            // Draw a white rectangle covering the whole canvas
            if (newContext !== null) {
                newContext.fillStyle = "white";
                newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);

                // Draw the original canvas image onto the new canvas
                newContext.drawImage(context.canvas, 0, 0);
            }

            // Export to base64
            const dataURL = newCanvas.toDataURL();
            console.log(dataURL);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target?.result as string;

                img.onload = () => {
                    // Reset history
                    setHistory([new ImageData(bufferDimensions.width, bufferDimensions.height)]);
                    setHistoryIndex(0);

                    // calculate the width and height, maintaining the aspect ratio
                    let aspectRatio = img.width / img.height;
                    let newWidth = bufferDimensions.width;
                    let newHeight = newWidth / aspectRatio;

                    // if height is still too big, adjust both dimensions again
                    if (newHeight > bufferDimensions.height) {
                        newHeight = bufferDimensions.height;
                        newWidth = newHeight * aspectRatio;
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = bufferDimensions.width;
                    canvas.height = bufferDimensions.height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, newWidth, newHeight);
                        setUploadedImage(canvas.toDataURL());
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (context && uploadedImage && uploadedImage !== lastUploadedImage) {
            const img = new Image();
            img.src = uploadedImage;
            img.onload = () => {
                context.clearRect(0, 0, bufferDimensions.width, bufferDimensions.height);
                context.drawImage(img, 0, 0, 512, 512);
                setLastUploadedImage(uploadedImage);
                saveCanvasState();
            };
        }
    }, [context, uploadedImage, lastUploadedImage, bufferDimensions.width, bufferDimensions.height, saveCanvasState]);


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
                saveBase64Image={saveBase64Image}
                handleImageUpload={handleImageUpload}
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