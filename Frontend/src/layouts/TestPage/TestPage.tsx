import React, { useState } from 'react';
import Canvas from './Components/CanvasStable';
import Toolbar from './Components/ToolbarStable';

const PaintPage: React.FC = () => {
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [base64Image, setBase64Image] = useState<string>('');


    return (
        <div>
            <Toolbar
                color={color}
                setColor={setColor}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                tool={tool}
                setTool={setTool}

            />
            <Canvas color={color} brushSize={brushSize} tool={tool} />
        </div>
    );
}

export default PaintPage;
