import Konva from 'konva';
import React, { useEffect, useRef } from 'react';
import { Image, Transformer, Group } from 'react-konva';
import useImage from 'use-image';

interface ImageWithTransformerProps {
    id: number;
    x: number;
    y: number;
    url: string;
    draggable: boolean;
    onSelect: (node: Konva.Node | null, id: number | null) => void;
    onDragEnd: (id: number, x: number, y: number) => void;
    isSelected: boolean; // new prop to determine if the image is selected or not
}

const ImageWithTransformer: React.FC<ImageWithTransformerProps> = ({
    id,
    x,
    y,
    url,
    draggable,
    onSelect,
    onDragEnd,
    isSelected, // receive isSelected prop
}) => {
    const imageRef = useRef<Konva.Image>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const [img] = useImage(url, 'anonymous');

    useEffect(() => {
        if (isSelected) {
            if (imageRef.current) {
                // attaches / detaches Transformer tool based on isSelected prop
                trRef.current?.setNodes([imageRef.current]);
                trRef.current?.getLayer()?.batchDraw();
            }
        }
    }, [isSelected]);

    const imageGroupRef = useRef<Konva.Group>(null);

    const handleClick = (e: any) => {
        if (imageGroupRef.current) {
            onSelect(imageGroupRef.current, id);
        }
        e.cancelBubble = true;
    };


    return (
        <Group
            ref={imageGroupRef}
            x={x}
            y={y}
            draggable={draggable}
            onDragEnd={(e) => onDragEnd(id, e.target.x(), e.target.y())}
            onMouseDown={(e) => {
                onSelect(imageGroupRef.current, id);
                e.cancelBubble = true;
            }}
            onClick={handleClick}
            onTouchStart={(e) => onSelect(imageGroupRef.current, id)}
            name="Image"
        >
            <Image ref={imageRef} image={img} />
            {isSelected && <Transformer ref={trRef} />}
        </Group>
    );
};

export default ImageWithTransformer;
