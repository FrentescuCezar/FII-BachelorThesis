import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

type DepthMap = {
    id: number;
    imageBase64: string;
    category: string;
};

type DepthMapModalProps = {
    show: boolean;
    handleClose: () => void;
    addImage: (images: any, imageBase64: string, setImages: any, uniqueIdCounter: number, setUniqueIdCounter: any) => void;
    images: any;
    setImages: any;
    uniqueIdCounter: number;
    setUniqueIdCounter: any;
};

const DepthMapModal: React.FC<DepthMapModalProps> = ({ show, handleClose, addImage, images, setImages, uniqueIdCounter, setUniqueIdCounter }) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [depthMaps, setDepthMaps] = useState<DepthMap[]>([]);


    async function fetchDepthMaps(category: string) {
        const res = await fetch(`http://localhost:8081/api/depthmaps/category/${category}`);
        const data = await res.json();
        console.log(data)
        setDepthMaps(data);
    }

    async function fetchCategories() {
        const res = await fetch("http://localhost:8081/api/depthmaps");
        const data = await res.json();

        const categories = Array.from(new Set<string>(data.map((item: DepthMap) => item.category)));
        setCategories(categories);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select a category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {categories.map(category => (
                    <Button variant="secondary" onClick={() => fetchDepthMaps(category)} key={category}>
                        {category}
                    </Button>
                ))}
                <div style={{
                    display: 'grid',
                    gridGap: '1em',
                    gridTemplateColumns: 'repeat(3, 1fr)'  // 3 images per row
                }}>
                    {depthMaps.map(depthMap => (
                        <div className="my-3"
                            style={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                                transition: 'box-shadow 0.3s ease-in-out',  // smooth transition for the hover effect
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',  // center the content vertically
                                width: '128px',
                                height: '128px',
                                boxSizing: 'border-box',  // include padding and border in the dimensions
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.5)'}  // increase the box shadow on hover
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)'}  // reset box shadow when mouse leaves
                            key={depthMap.id}
                        >
                            <img
                                src={`${depthMap.imageBase64}`}
                                alt={depthMap.category}
                                onClick={() => addImage(images, depthMap.imageBase64, setImages, uniqueIdCounter, setUniqueIdCounter)}
                                style={{
                                    cursor: 'pointer',
                                    maxWidth: '100%',  // scale the image to fit within the box
                                    maxHeight: '100%',  // scale the image to fit within the box
                                }}
                            />
                        </div>
                    ))}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DepthMapModal;
