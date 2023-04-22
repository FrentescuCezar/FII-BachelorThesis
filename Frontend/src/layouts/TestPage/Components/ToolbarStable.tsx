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

}

const ToolbarStable: React.FC<ToolbarProps> = ({
    color,
    setColor,
    brushSize,
    setBrushSize,
    tool,
    setTool,

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
                <FaPencilAlt
                    size={24}
                    color={tool === 'pen' ? 'blue' : 'black'}
                    style={{ verticalAlign: 'middle' }}
                />
            </button>
            <button onClick={() => setTool('eraser')}>
                <FaEraser
                    size={24}
                    color={tool === 'eraser' ? 'blue' : 'black'}
                    style={{ verticalAlign: 'middle' }}
                />
            </button>
            <button onClick={handleColorPickerClick}>
                <div
                    style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        marginRight: 2,
                    }}
                >
                    <div
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: color,
                        }}
                    />
                </div>
                {displayColorPicker && (
                    <div style={{ position: 'absolute', zIndex: 2 }}>
                        <SketchPicker color={color} onChange={handleColorChange} />
                    </div>
                )}
            </button>
            <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={handleBrushSizeChange}
            />
            <button>
                Undo
            </button>
            <button>
                Redo
            </button>
            <button>
                <FaSave size={24} style={{ verticalAlign: 'middle' }} />
            </button>
        </div>
    );
};

export default ToolbarStable;
