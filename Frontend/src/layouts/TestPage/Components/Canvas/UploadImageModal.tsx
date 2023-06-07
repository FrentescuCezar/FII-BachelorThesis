import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface Prediction {
    className: string;
    probability: number;
}

type UploadImageModalProps = {
    showModal: boolean;
    closeModal: () => void;
    fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    uploadedImage: string;
    predictions: Prediction[];
    saveBase64Image: () => void;
    explicitCheck: string;
};

const UploadImageModal: React.FC<UploadImageModalProps> = ({
    showModal,
    closeModal,
    fileInputRef,
    handleImageUpload,
    uploadedImage,
    predictions,
    saveBase64Image,
    explicitCheck
}) => {


    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Upload Image</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />
                <Button
                    variant="primary"
                    onClick={() => {
                        if (fileInputRef.current) {
                            fileInputRef.current.click();
                        }
                    }}
                    style={{ marginBottom: '10px' }}
                >
                    Upload Image
                </Button>
                {uploadedImage && (
                    <img src={uploadedImage} alt="Uploaded" style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'cover', marginBottom: '10px' }} />
                )}
                {predictions.length > 0 && (
                    (() => {
                        const totalProbability = predictions.reduce((acc, prediction) => {
                            if (prediction.className !== 'Sexy') {
                                acc += prediction.probability;
                            }
                            return acc;
                        }, 0);
                        const badProbability = 100 * (((predictions.find((prediction) => prediction.className === 'Hentai') || {}).probability || 0) + ((predictions.find((prediction) => prediction.className === 'Porn') || {}).probability || 0)) / totalProbability;
                        const goodProbability = 100 * (((predictions.find((prediction) => prediction.className === 'Drawing') || {}).probability || 0) + ((predictions.find((prediction) => prediction.className === 'Neutral') || {}).probability || 0)) / totalProbability;

                        if (goodProbability > badProbability) {
                            saveBase64Image();
                        }

                        const percentageColor = goodProbability >= 50 ? 'green' : 'red';

                        return (
                            <>
                                <p>Pokétex seal of approval:</p>
                                <p style={{ color: percentageColor }}>{goodProbability.toFixed(2)}%</p>
                            </>
                        );
                    })()
                )}
                <p>{explicitCheck}</p>
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


export default UploadImageModal;
