import React, { useRef, useEffect } from 'react';
import { Transformer } from 'react-konva';
import Konva from 'konva';

interface StickmanTransformerProps {
    selectedNode: any;
}

const StickmanTransformer: React.FC<StickmanTransformerProps> = ({ selectedNode }) => {
    const transformerRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (transformerRef.current) {
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
            } else {
                transformerRef.current.nodes([]);
            }
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [selectedNode]);

    return (
        <Transformer
            ref={transformerRef}
            rotateEnabled={true}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
    );
};

export default StickmanTransformer;
