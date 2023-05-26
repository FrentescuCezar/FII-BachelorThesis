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
    draggable: boolean;
    onSelect: (node: Konva.Node | null, id: number | null) => void;
    onDragEnd: (id: number, x: number, y: number) => void;
    isSelected: boolean; // new prop to determine if the image is selected or not
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
    draggable,
    onSelect,
    onDragEnd,
    isSelected, // receive isSelected prop
    onScaleChange,
    onRotateChange, // new callback
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
                    const newScaleX = imageGroupRef.current.scaleX();
                    const newScaleY = imageGroupRef.current.scaleY();
                    const newRotation = imageGroupRef.current.rotation(); // get the new rotation value
                    onScaleChange(id, newScaleX, newScaleY);
                    onRotateChange(id, newRotation); // call the onRotateChange callback
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
            {isSelected && <Transformer ref={trRef} />}
        </Group>
    );
};

export default ImageWithTransformer;
