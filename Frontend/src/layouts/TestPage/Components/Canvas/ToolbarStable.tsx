import React, { useRef, useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { FaPencilAlt, FaEraser, FaSave, FaUndo, FaRedo, FaImage } from 'react-icons/fa';

interface ToolbarProps {
    color: string;
    setColor: (color: string) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
    tool: 'pen' | 'eraser';
    setTool: (tool: 'pen' | 'eraser') => void;
    undo: () => void;
    redo: () => void;
    saveBase64Image: () => void;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    openModal: () => void;
}

const ToolbarStable: React.FC<ToolbarProps> = ({
    color,
    setColor,
    brushSize,
    setBrushSize,
    tool,
    setTool,
    undo,
    redo,
    saveBase64Image,
    handleImageUpload,
    openModal
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

    const fileInputRef = useRef<HTMLInputElement | null>(null);


    return (
        <div>
            <button onClick={() => setTool('pen')}>
                <FaPencilAlt
                    size={24}
                    color={tool === 'pen' ? 'red' : 'black'}
                    style={{ verticalAlign: 'middle' }}
                />
            </button>
            <button onClick={() => setTool('eraser')}>
                <FaEraser
                    size={24}
                    color={tool === 'eraser' ? 'red' : 'black'}
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
            <button onClick={undo}>
                <FaUndo
                    size={24}
                    style={{ verticalAlign: 'middle' }}
                />
            </button>
            <button onClick={redo}>
                <FaRedo
                    size={24}
                    style={{ verticalAlign: 'middle' }}
                />
            </button>
            <button onClick={saveBase64Image}>
                <FaSave size={24} style={{ verticalAlign: 'middle' }} />
            </button>
            <button onClick={openModal}>
                <FaImage size={24} style={{ verticalAlign: 'middle' }} />
            </button>

        </div>
    );
};

export default ToolbarStable;
