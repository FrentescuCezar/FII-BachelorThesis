import React, { useRef, useEffect } from 'react';
import { Transformer } from 'react-konva';
import Konva from 'konva';

interface StickmanTransformerProps {
    selectedNode: any;
    nodeType: string | null;
}

const StickmanTransformer: React.FC<StickmanTransformerProps> = ({ selectedNode, nodeType }) => {
    const transformerRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (transformerRef.current) {
            if (selectedNode && nodeType === 'stickman') {
                // Adjust properties for stickmen
                transformerRef.current.rotateEnabled(true);
                transformerRef.current.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right']);
                transformerRef.current.nodes([selectedNode]);
            }
            else {
                transformerRef.current.nodes([]);
            }
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [selectedNode, nodeType]);

    return (
        <Transformer
            ref={transformerRef}
            rotateEnabled={true}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
    );
};

export default StickmanTransformer;
