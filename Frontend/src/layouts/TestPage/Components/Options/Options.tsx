import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

type DepthMapModalProps = {
    show: boolean;
    handleClose: () => void;
    setStickmenControlNetSetting: React.Dispatch<React.SetStateAction<number>>;
    setDepthmapsControlNetSetting: React.Dispatch<React.SetStateAction<number>>;
};

const OptionsModal: React.FC<DepthMapModalProps> = ({
    show,
    handleClose,
    setStickmenControlNetSetting,
    setDepthmapsControlNetSetting,
}) => {
    const [stickmenImportance, setStickmenImportance] = useState(1);
    const [objectsImportance, setObjectsImportance] = useState(1);

    useEffect(() => {
        setStickmenControlNetSetting(stickmenImportance);
    }, [stickmenImportance]);

    useEffect(() => {
        setDepthmapsControlNetSetting(objectsImportance);
    }, [objectsImportance]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Change ControlNet Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>How much importance do you want the Stickposes to have:</Form.Label>
                    <Form.Control
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={stickmenImportance}
                        onChange={(e) => setStickmenImportance(parseFloat(e.target.value))}
                    />
                    <Form.Text>Value: {stickmenImportance}</Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>How much importance do you want the Objects to have:</Form.Label>
                    <Form.Control
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={objectsImportance}
                        onChange={(e) => setObjectsImportance(parseFloat(e.target.value))}
                    />
                    <Form.Text>Value: {objectsImportance}</Form.Text>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OptionsModal;
