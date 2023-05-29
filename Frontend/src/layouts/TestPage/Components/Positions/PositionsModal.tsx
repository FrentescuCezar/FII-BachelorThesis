import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Assuming react-bootstrap is being used.
import { Pagination } from '../../../Utils/Pagination';
import { countElements } from '../../Utils/TestPageStickmanFunctions';
import { Positions } from '../../../../models/PositionsModel';

export type PositionsModalProps = {
    authState: any;
    submitClicked: any;
    showPositions: boolean;
    handleClosePositions: () => void;
    setStickmen: (stickmen: any) => void;
    setImages: (images: any) => void;
    setStickmanScales: (stickmanScales: any) => void;
    setUniqueIdCounter: (uniqueIdCounter: any) => void;
    loadScene: (positions: any, setStickmen: any, setImages: any, setStickmanScales: any) => void;
};

export const PositionsModal: React.FC<PositionsModalProps> = ({
    authState,
    submitClicked,
    showPositions,
    handleClosePositions,
    setStickmen,
    setImages,
    setStickmanScales,
    setUniqueIdCounter,
    loadScene
}) => {
    const [positions, setPositions] = useState<Positions[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [positionsPerPage] = useState(9);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!authState || !authState.accessToken) return;

        fetch(`http://localhost:8081/api/positions/recentByUsername?page=${currentPage - 1}&size=${positionsPerPage}`, {
            headers: {
                Authorization: `Bearer ${authState.accessToken.accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setPositions(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [submitClicked, showPositions, currentPage, authState]);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (<Modal show={showPositions} style={{ maxWidth: '100%', maxHeight: '100%' }} onHide={handleClosePositions}>
        <Modal.Header closeButton>
            <Modal.Title>Load Positions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
            }}>
                {positions.map((position) => (
                    <div
                        key={position.id}
                        style={{
                            width: '32%', // Change this value to adjust the size of the boxes
                            cursor: 'pointer',
                            position: 'relative',
                            margin: '0 0.65%', // Reduced margin to adjust the width
                        }}
                        onClick={() => {
                            loadScene(position.positions, setStickmen, setImages, setStickmanScales);
                            setUniqueIdCounter(countElements(position.positions));
                        }}
                        onMouseEnter={() => {
                            const customImgElement = document.getElementById(`custom-image-${position.id}`);
                            const generatedImgElement = document.getElementById(`generated-image-${position.id}`);
                            const stickmanImgElement = document.getElementById(`stickman-image-${position.id}`);

                            if (customImgElement) {
                                customImgElement.style.opacity = "1";
                            }
                            if (generatedImgElement) {
                                generatedImgElement.style.filter = "brightness(20%)";
                                generatedImgElement.style.transition = "filter 0.3s ease-in-out"; // Added transition
                            }
                            if (stickmanImgElement) {
                                stickmanImgElement.style.opacity = "1";
                            }
                        }}
                        onMouseLeave={() => {
                            const customImgElement = document.getElementById(`custom-image-${position.id}`);
                            const generatedImgElement = document.getElementById(`generated-image-${position.id}`);
                            const stickmanImgElement = document.getElementById(`stickman-image-${position.id}`);

                            if (customImgElement) {
                                customImgElement.style.opacity = "0";
                            }
                            if (generatedImgElement) {
                                generatedImgElement.style.filter = "brightness(100%)";
                                generatedImgElement.style.transition = "filter 0.3s ease-in-out"; // Added transition
                            }
                            if (stickmanImgElement) {
                                stickmanImgElement.style.opacity = "0.5";
                            }
                        }}
                    >
                        <img
                            id={`generated-image-${position.id}`}
                            src={position.generatedImage}
                            alt="Generated"
                            style={{
                                width: '100%',
                                objectFit: 'contain',
                            }}
                            className="mb-3"
                        />
                        <img
                            id={`stickman-image-${position.id}`}
                            src={position.stickmanImage}
                            alt="Stickman"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', objectFit: 'contain', opacity: 0.5, transition: 'opacity 0.3s ease-in-out' }}
                        />
                        <img
                            id={`custom-image-${position.id}`}
                            src={position.imageCustomImage}
                            alt="Custom"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                objectFit: 'contain',
                                opacity: 0,
                                transition: 'opacity 0.3s ease-in-out' // Added transition
                            }}
                        />
                    </div>
                ))}
            </div>
        </Modal.Body>
        <Modal.Footer>
            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            }
        </Modal.Footer>
    </Modal>);
};