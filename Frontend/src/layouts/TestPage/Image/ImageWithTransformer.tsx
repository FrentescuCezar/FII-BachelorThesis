import Konva from 'konva';
import React, { useEffect, useRef } from 'react';
import { Image, Transformer, Group } from 'react-konva';
import useImage from 'use-image';

interface ImageWithTransformerProps {
    id: number;
    x: number;
    y: number;
    url: string;
    scaleX: number;  // Add these new props
    scaleY: number;  // Add these new props
    rotation:number
    draggable: boolean;
    onSelect: (node: Konva.Node | null, id: number | null) => void;
    onDragEnd: (id: number, x: number, y: number) => void;
    onScaleChange: (id: number, newScaleX: number, newScaleY: number) => void;
    onRotateChange: (id: number, newRotation: number) => void; // new callback
}

const ImageWithTransformer: React.FC<ImageWithTransformerProps> = ({
    id,
    x,
    y,
    url,
    scaleX,
    scaleY,
    rotation,
    draggable,
    onSelect,
    onDragEnd,
    onScaleChange,
    onRotateChange, // new callback
}) => {
    const imageRef = useRef<Konva.Image>(null);
    const [img] = useImage(url, 'anonymous');

    const imageGroupRef = useRef<Konva.Group>(null);

    const handleClick = (e: any) => {
        if (imageGroupRef.current) {
            onSelect(imageGroupRef.current, id);
        }
        e.cancelBubble = true;
    };


    useEffect(() => {
        if (imageGroupRef.current) {
            imageGroupRef.current.scaleX(scaleX);
            imageGroupRef.current.scaleY(scaleY);
            imageGroupRef.current.rotation(rotation);
        }
    }, [scaleX, scaleY, rotation]);

    return (
        <Group
            ref={imageGroupRef}
            x={x}
            y={y}
            scaleX={scaleX}  // Apply the scales
            scaleY={scaleY}  // Apply the scales
            draggable={draggable}
            onDragEnd={(e) => {
                if (imageGroupRef.current) {
                    const newX = imageGroupRef.current.x();
                    const newY = imageGroupRef.current.y();

                    onDragEnd(id, newX, newY);

                    if (imageGroupRef.current) {
                        const newScaleX = imageGroupRef.current.scaleX();
                        const newScaleY = imageGroupRef.current.scaleY();
                        onScaleChange(id, newScaleX, newScaleY);
                    }
                }
            }}

            onTransformEnd={() => {
                if (imageGroupRef.current) {
                    const newRotation = imageGroupRef.current.rotation();
                    const newScaleX = imageGroupRef.current.scaleX();
                    const newScaleY = imageGroupRef.current.scaleY();

                    onScaleChange(id, newScaleX, newScaleY);
                    onRotateChange(id, newRotation);
                }
            }}

            onMouseDown={(e) => {
                onSelect(imageGroupRef.current, id);
                e.cancelBubble = true;
            }}
            onClick={handleClick}
            onTouchStart={(e) => onSelect(imageGroupRef.current, id)}
            name="Image"
        >
            <Image ref={imageRef} image={img} />
        </Group>
    );
};

export default ImageWithTransformer;
