import { useEffect, useRef, useState } from "react";
import ToolbarStable from "./ToolbarStable";
import CanvasCustom from "./CanvasCustom";
import { submitPrompt } from "../../../MonBuilderPage/Api/MonBuilderApi";
import { AlwaysonScripts, ScriptArgs } from "../../../../models/TextToImageRequestModel";
import { Button, Modal } from "react-bootstrap";
import UploadImageModal from "./UploadImageModal";

declare global {
    interface Window {
        nsfwjs: {
            load: () => Promise<any>;
        };
    }
}

interface Prediction {
    className: string;
    probability: number;
}

interface CanvasPageProps {
    setImageOfCanvas: React.Dispatch<React.SetStateAction<string>>;
}

export const CanvasPage: React.FC<CanvasPageProps> = ({
    setImageOfCanvas
}) => {



    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(4);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [bufferDimensions] = useState({ width: 512, height: 512 });

    const [history, setHistory] = useState<ImageData[]>([new ImageData(bufferDimensions.width, bufferDimensions.height)]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const MAX_HISTORY_SIZE = 100;

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
            setImageOfCanvas(dataURL);
        }
    };


    const [uploadedImage, setUploadedImage] = useState("");


    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = async function (e) {
                const img = new Image();
                img.src = e.target?.result as string;
                setUploadedImage(img.src);

                img.onload = async () => {

                    // Classify the image before processing
                    const predictions = await classifyImage(img.src);

                    setPredictions(predictions); // save the predictions in state

                    // check if explicit content is higher than neutral
                    let explicitContent = 0;
                    let neutralContent = 0;

                    predictions.forEach((prediction: Prediction) => {
                        if (prediction.className === "Hentai" || prediction.className === "Porn") {
                            explicitContent += prediction.probability;
                        }
                        if (prediction.className === "Drawing" || prediction.className === "Neutral") {
                            neutralContent += prediction.probability;
                        }
                    });

                    if (explicitContent > neutralContent) {
                        setExplicitCheck("Unworthy of the Pokémon League: Disapproved!");
                    } else {
                        setExplicitCheck("Worthy of the Pokémon League: Approved!");
                    }


                    explicitContent = predictions.filter((prediction: Prediction) =>
                        ["Hentai", "Porn"].includes(prediction.className)
                    ).reduce((acc, curr) => acc + curr.probability, 0);

                    neutralContent = predictions.filter((prediction: Prediction) =>
                        ["Drawing", "Neutral"].includes(prediction.className)
                    ).reduce((acc, curr) => acc + curr.probability, 0);

                    // If the image is explicit, stop the function here
                    if (explicitContent > neutralContent) {
                        setClassificationResult("The image content is explicit.");
                        setShowModal(true);
                        return;
                    }


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
                        const startX = (canvas.width - newWidth) / 2;
                        const startY = (canvas.height - newHeight) / 2;
                        ctx.drawImage(img, startX, startY, newWidth, newHeight);
                    }


                    const processedImgSrc = canvas.toDataURL();

                    const arg3: ScriptArgs = {
                        input_image: processedImgSrc,
                        module: "lineart_realistic",
                        model: "control_v11p_sd15_scribble [d4ba51ff]",
                        resize_mode: 1,
                        weight: 1,
                    };

                    let alwaysonScripts: AlwaysonScripts;
                    alwaysonScripts = {
                        controlnet: {
                            args: [arg3],
                        },
                    };

                    let newImageData = await submitPrompt(
                        /* steps */ 20,
                        /* prompt */ "example",
                        /* sampler_index */ "Euler a",
                        /* setIsImageLoading: */() => { },
                        /* setImageData: */() => { },
                        /* setSeed */() => { },
                        /* imageIndex */ 1,
                        /* seed */      -1,
                        /* negative_prompts */ "",
                        /* alwayson_scripts */ alwaysonScripts
                    );

                    newImageData = "data:image/png;base64," + newImageData;

                    // Invert newImageData
                    if (newImageData) {
                        const imgElement = document.createElement("img");
                        imgElement.src = newImageData;
                        await new Promise((resolve) => {
                            imgElement.onload = () => resolve(true);
                        });

                        const canvas = document.createElement('canvas');
                        canvas.width = imgElement.width;
                        canvas.height = imgElement.height;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);
                            let imageData = ctx.getImageData(0, 0, imgElement.width, imgElement.height);
                            let data = imageData.data;

                            for (let i = 0; i < data.length; i += 4) {
                                // invert the colors
                                data[i] = 255 - data[i];     // red
                                data[i + 1] = 255 - data[i + 1]; // green
                                data[i + 2] = 255 - data[i + 2]; // blue
                            }

                            ctx.putImageData(imageData, 0, 0);
                        }

                        newImageData = canvas.toDataURL();
                        drawImageOnCanvas(newImageData);
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };


    // Function to draw image on the canvas
    const drawImageOnCanvas = (imgSrc: string) => {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            if (context) {
                context.clearRect(0, 0, bufferDimensions.width, bufferDimensions.height);
                context.drawImage(img, 0, 0, 512, 512);
            }
            setLastUploadedImage(imgSrc);
            saveCanvasState();
        };
    }


    const classifyImage = async (imgSrc: string): Promise<Prediction[]> => {
        const model = await window.nsfwjs.load();
        const img = new Image();
        img.src = imgSrc;
        img.crossOrigin = 'anonymous';

        return new Promise((resolve, reject) => {
            img.onload = async () => {
                try {
                    const predictions = await model.classify(img);
                    console.log(predictions);
                    resolve(predictions);
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => {
                reject(new Error("There was an error loading the image for classification."));
            };
        })
    };

    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [classificationResult, setClassificationResult] = useState("");
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [explicitCheck, setExplicitCheck] = useState<string>('');


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
                openModal={openModal}
            />
            <UploadImageModal
                showModal={showModal}
                closeModal={closeModal}
                fileInputRef={fileInputRef}
                handleImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                predictions={predictions}
                saveBase64Image={saveBase64Image}
                explicitCheck={explicitCheck}
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