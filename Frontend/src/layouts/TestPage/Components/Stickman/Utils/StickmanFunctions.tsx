import Konva from 'konva';
import { Ellipse } from 'react-konva';

export const handleJointDrag = (
  stickmanGroupRef: React.RefObject<Konva.Group>,
  onSelect: (node: Konva.Node | null, id: number | null) => void,
  id: number,
  joints: Array<{ x: number; y: number }>,
  onJointsUpdate: (id: number, joints: Array<{ x: number; y: number }>) => void,
  index: number,
  x: number,
  y: number,
  setUpdateJointBug: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (stickmanGroupRef.current) {
    onSelect(null, id);
  }
  const newJoints = [...joints];
  newJoints[index] = { x, y };
  onJointsUpdate(id, newJoints);
  setUpdateJointBug(true);
};



export const renderEllipse = (
  joints: Array<{ x: number; y: number }>,
  startJoint: number,
  endJoint: number,
  color: string
) => {
  const startX = joints[startJoint].x;
  const startY = joints[startJoint].y;
  const endX = joints[endJoint].x;
  const endY = joints[endJoint].y;

  return (
    <Ellipse
      x={startX + (endX - startX) / 2}
      y={startY + (endY - startY) / 2}
      radiusX={Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) / 2}
      radiusY={3.5}
      fill={color}
      rotation={Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)}
    />
  );
};

export const dragBound = (

  stickmanGroupRef: React.RefObject<Konva.Group>,
  pos: { x: number; y: number }
): { x: number; y: number } => {

  const stageWidth = 512;
  const stageHeight = 512;

  if (!stickmanGroupRef.current?.parent) {
    return pos;
  }

  const stickman = stickmanGroupRef.current?.getClientRect({ relativeTo: stickmanGroupRef.current.parent });

  if (!stickman) {
    return pos;
  }

  const minX = -stickman.width + 10;
  const minY = -stickman.height + 5;
  const maxX = stageWidth + 50;
  const maxY = stageHeight + 50;

  const newX = Math.max(minX, Math.min(maxX, pos.x));
  const newY = Math.max(minY, Math.min(maxY, pos.y));


  // Check if the cursor is out of bounds
  if (pos.x < minX || pos.x > maxX || pos.y < minY || pos.y > maxY) {
    return { x: newX, y: newY };
  }



  return { x: pos.x, y: pos.y };
};
