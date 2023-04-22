import React, { useState } from 'react';
import Canvas from './Components/CanvasStable';
import Toolbar from './Components/ToolbarStable';

const PaintPage: React.FC = () => {
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [base64Image, setBase64Image] = useState<string>('');

    const [undo, setUndo] = useState<React.MouseEventHandler<HTMLButtonElement> | undefined>(undefined);
    const [redo, setRedo] = useState<React.MouseEventHandler<HTMLButtonElement> | undefined>(undefined);


    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    const saveImage = () => {
        if (canvasRef.current) {
            const base64 = canvasRef.current.toDataURL('image/png');
            setBase64Image(base64);
            // Do something with the base64 image, e.g., store it, display it, or download it
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
                saveImage={saveImage}
                undo={undo}
                redo={redo}
            />
            <Canvas color={color} brushSize={brushSize} tool={tool} setUndo={setUndo} setRedo={setRedo} />
        </div>
    );
}

export default PaintPage;
