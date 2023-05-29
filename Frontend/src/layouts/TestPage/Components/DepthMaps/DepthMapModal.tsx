import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Pagination } from '../../../Utils/Pagination';

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

    const [currentPage, setCurrentPage] = useState(1);
    const [positionsPerPage] = useState(9);
    const [totalPages, setTotalPages] = useState(0);


    async function fetchCategories() {
        const res = await fetch("http://localhost:8081/api/depthmaps");
        const data = await res.json();

        const categories = Array.from(new Set<string>(data.map((item: DepthMap) => item.category)));
        setCategories(categories);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const [currentCategory, setCurrentCategory] = useState<string>('');

    useEffect(() => {
        fetch(`http://localhost:8081/api/depthmaps/category/${currentCategory}?page=${currentPage - 1}&size=${positionsPerPage}`, {
        })
            .then((res) => res.json())
            .then((data) => {
                setDepthMaps(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [currentCategory, currentPage, positionsPerPage]);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    const fillerCount = depthMaps.length % positionsPerPage;

    const fillers = [...Array(fillerCount)].map((_, i) => (
        <div key={`filler-${i}`} style={{ visibility: "hidden" }} />
    ));

    const handleOnChangeCategory = (category: string) => {
        setCurrentCategory(category);
        setCurrentPage(1);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select a category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {categories.map(category => (
                    <Button
                        variant="secondary"
                        onClick={() => handleOnChangeCategory(category)}
                        key={category}
                    >
                        {category}
                    </Button>
                ))}
                <div
                    style={{
                        display: "grid",
                        gridGap: "em",
                        gridTemplateColumns: "repeat(3, 1fr)" // 3 images per row
                    }}
                >
                    {depthMaps.map(depthMap => (
                        <div
                            className="my-1 depthmap-box"
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                transition: "background-color 0.1s ease-in-out",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "128px",
                                height: "128px",
                                boxSizing: "border-box",
                                cursor: "pointer"
                            }}

                            key={depthMap.id}
                        >
                            <img
                                src={`${depthMap.imageBase64}`}
                                alt={depthMap.category}
                                onClick={() =>
                                    addImage(
                                        images,
                                        depthMap.imageBase64,
                                        setImages,
                                        uniqueIdCounter,
                                        setUniqueIdCounter
                                    )
                                }
                                style={{
                                    cursor: "pointer",
                                    maxWidth: "100%",
                                    maxHeight: "100%"
                                }}
                            />
                        </div>
                    ))}
                    {fillers}
                </div>
            </Modal.Body>

            <Modal.Footer>
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                )}
            </Modal.Footer>
        </Modal>
    );
};


export default DepthMapModal;
