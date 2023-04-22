import React, { useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { FaPencilAlt, FaEraser, FaSave } from 'react-icons/fa';



interface ToolbarProps {
    color: string;
    setColor: (color: string) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
    tool: 'pen' | 'eraser';
    setTool: (tool: 'pen' | 'eraser') => void;
    saveImage: () => void;
    undo: React.MouseEventHandler<HTMLButtonElement> | undefined;
    redo: React.MouseEventHandler<HTMLButtonElement> | undefined;

}

const ToolbarStable: React.FC<ToolbarProps> = ({
    color,
    setColor,
    brushSize,
    setBrushSize,
    tool,
    setTool,
    saveImage,
    undo,
    redo
}) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const handleColorChange = (color: ColorResult) => {
        setColor(color.hex);
    };

    const handleColorPickerClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleBrushSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBrushSize(Number(event.target.value));
    };

    return (
        <div>
            <button onClick={() => setTool('pen')}>
                <FaPencilAlt size={24} color={tool === 'pen' ? 'blue' : 'black'} />
            </button>
            <button onClick={() => setTool('eraser')}>
                <FaEraser size={24} color={tool === 'eraser' ? 'blue' : 'black'} />
            </button>
            <button onClick={handleColorPickerClick}>
                <div
                    style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: color,
                    }}
                />
            </button>
            {displayColorPicker ? (
                <div>
                    <SketchPicker color={color} onChange={handleColorChange} />
                </div>
            ) : null}
            <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={handleBrushSizeChange}
            />
            <button onClick={undo} disabled={!undo}>
                Undo
            </button>
            <button onClick={redo} disabled={!redo}>
                Redo
            </button>
            <button onClick={saveImage}>
                <FaSave size={24} />
            </button>
        </div>
    );
};

export default ToolbarStable;