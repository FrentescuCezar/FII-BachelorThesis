import { useState, useEffect } from "react";
import { useOktaAuth } from '@okta/okta-react';
import { useHistory } from "react-router-dom";

import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { SpinnerLoading } from "../Utils/SpinnerLoading";

import { submitPrompt, fetchPokemonName, fetchPokemonDescription, submitPokemon } from "./Api/MonBuilderApi";


import image from "../../Images/PublicImages/MonBuilderImage.png"
import StickmanPage from "../TestPage/StickmanPage";
import { StickmanScalesProvider } from "../TestPage/Utils/StickmanScalesProvider";
import { AlwaysonScripts, ScriptArgs } from "../../models/TextToImageRequestModel";
import { createImageWithBackground } from "../TestPage/Utils/StickmanPageFunctions";
import { CanvasPage } from "../TestPage/Components/Canvas/CanvasPage";


export const MonBuilderPage = () => {

    const { authState } = useOktaAuth();
    const history = useHistory();


    // Prompt and steps states
    const [prompt, setPrompt] = useState("");
    const [steps, setSteps] = useState(20);
    const [seedInput, setSeedInput] = useState("-1");
    const [negativePrompt, setNegativePrompt] = useState("");

    // Final prompt and steps states
    const [finalPrompt, setFinalPrompt] = useState("");
    const [finalSteps, setFinalSteps] = useState(20);

    // Generated image states
    const [imageData, setImageData] = useState("");
    const [seed, setSeed] = useState(-1);
    const generation = 0;

    // Pokemon name and description states
    const [pokemonName, setPokemonName] = useState("");
    const [pokemonDescription, setPokemonDescription] = useState("");

    // Loading states
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isNameLoading, setIsNameLoading] = useState(false);
    const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);

    const [error, setError] = useState("");




    const [imageOfStickmen, setImageOfStickmen] = useState("");
    const [imageOfDepthMaps, setimageOfDepthMaps] = useState("");
    const [imageOfCanvas, setImageOfCanvas] = useState("");

    useEffect(() => {
        if (imageOfStickmen !== "") {
            createImageWithBackground(imageOfStickmen).then(imageWithBackground => {
                setImageOfStickmen(imageWithBackground)
            });
        }

        if (imageOfDepthMaps !== "") {
            createImageWithBackground(imageOfDepthMaps).then(imageWithBackground => {
                setimageOfDepthMaps(imageWithBackground)
            });
        }
    }, [imageOfStickmen, imageOfDepthMaps])

    const handleSubmit = () => {
        if (!prompt) {
            setError("Prompt is required.");
            return;
        }
        setError("");
        setFinalPrompt(prompt);
        setFinalSteps(steps);
        setPokemonDescription("");
        setPokemonName("");




        // Define the arguments for the scripts
        const arg1: ScriptArgs = {
            input_image: imageOfStickmen,
            module: "none",
            model: "control_v11p_sd15_openpose [cab727d4]",
            resize_mode: 1,
            weight: stickmenControlNetSetting,
        };

        const arg2: ScriptArgs = {
            input_image: imageOfDepthMaps,
            module: "none",
            model: "control_v11f1p_sd15_depth [cfd03158]",
            resize_mode: 1,
            weight: depthmapsControlNetSetting,
        };
        const arg3: ScriptArgs = {
            input_image: imageOfCanvas,
            module: "lineart_realistic",
            model: "control_v11p_sd15_scribble [d4ba51ff]",
            resize_mode: 1,
            weight: 1,
        };


        let alwaysonScripts: AlwaysonScripts;
        if (activePage === "PaintPage") {
            if (imageOfStickmen !== "" && imageOfDepthMaps !== "") {
                alwaysonScripts = {
                    controlnet: {
                        args: [arg1, arg2],
                    },
                };
            } else if (imageOfStickmen !== "") {
                alwaysonScripts = {
                    controlnet: {
                        args: [arg1],
                    },
                };
            } else {
                alwaysonScripts = {
                    controlnet: {
                        args: [arg2],
                    },
                };
            }
        } else {
            alwaysonScripts = {
                controlnet: {
                    args: [arg3],
                },
            };
        }


        // Combine the arguments into the scripts object


        const sampler_index = "Euler a";


        submitPrompt(
            steps,
            prompt,
            sampler_index,
            setIsImageLoading,
            setImageData,
            setSeed,
            0,
            seedInput ? parseInt(seedInput) : undefined,
            negativePrompt,
            alwaysonScripts
        );
    };



    const [activePage, setActivePage] = useState("CanvasPage");
    const [isControlNetEnabled, setControlNetEnabled] = useState(false);
    const [stickmenControlNetSetting, setStickmenControlNetSetting] = useState(1);
    const [depthmapsControlNetSetting, setDepthmapsControlNetSetting] = useState(1);



    return (
        <div className='my-5'>
            <Container>
                <Row>
                    <Col>
                        <Form.Group controlId="controlNetCheckbox">
                            <div style={{ display: "flex", alignItems: "center", height: "20px", marginBottom: "25px", marginTop: "10px" }}>
                                <Form.Check
                                    type="checkbox"
                                    label="Enable ControlNet"
                                    checked={isControlNetEnabled}
                                    onChange={() => setControlNetEnabled(!isControlNetEnabled)}
                                    style={{ marginTop: "0" }}
                                />
                                {isControlNetEnabled && (
                                    <>
                                        <Button onClick={() => setActivePage("CanvasPage")} style={{ marginLeft: "10px" }}>
                                            Canvas Page
                                        </Button>
                                        <Button onClick={() => setActivePage("PaintPage")} style={{ marginLeft: "10px" }}>
                                            Stickman Page
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Form.Group>

                        <div style={{ display: isControlNetEnabled ? "block" : "none" }}>
                            <div style={{ display: activePage === "CanvasPage" ? "block" : "none" }}>
                                <CanvasPage
                                    setImageOfCanvas={setImageOfCanvas}
                                />
                            </div>
                            <div style={{ display: activePage === "PaintPage" ? "block" : "none" }}>
                                <StickmanScalesProvider>
                                    <StickmanPage
                                        setImageOfStickmen={setImageOfStickmen}
                                        setimageOfDepthMaps={setimageOfDepthMaps}
                                        generatedImage={imageData}
                                        setStickmenControlNetSetting={setStickmenControlNetSetting}
                                        setDepthmapsControlNetSetting={setDepthmapsControlNetSetting}
                                    />
                                </StickmanScalesProvider>
                            </div>
                        </div>

                        <Form>
                            <Form.Group controlId="prompt">
                                <Form.Label>Prompt:</Form.Label>
                                <Form.Control as="textarea" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="negativePrompt">
                                <Form.Label>Negative Prompt (optional):</Form.Label>
                                <Form.Control as="textarea" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="seed">
                                <Form.Label>Seed (optional):</Form.Label>
                                <Form.Control as="textarea" value={seedInput} onChange={(e) => setSeedInput(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="steps">
                                <Form.Label>Steps: {steps}</Form.Label>
                                <Form.Control
                                    type="range"
                                    min="20"
                                    max="50"
                                    value={steps}
                                    onChange={(e) => setSteps(Number(e.target.value))}
                                    className="custom-slider"
                                />
                            </Form.Group>
                            {error && <p className="text-danger">{error}</p>}
                            <Button onClick={handleSubmit} disabled={isImageLoading}>
                                {isImageLoading ? "Generating..." : "Generate Pokemon"}
                            </Button>
                            {isImageLoading && (
                                <div className="d-inline-block ml-2">
                                    <SpinnerLoading />
                                </div>
                            )}
                        </Form>
                        {imageData && (
                            <>
                                <div className="my-5">
                                    <Button onClick={() => fetchPokemonName(finalPrompt, setIsNameLoading, setPokemonName)} disabled={isNameLoading}>
                                        {isNameLoading ? "Generating Name..." : "Generate Name"}
                                    </Button>
                                    {isNameLoading ? (
                                        <div className="mt-2">
                                            <SpinnerLoading />
                                        </div>
                                    ) : (
                                        pokemonName && <p>Pokemon Name: {pokemonName}</p>
                                    )}
                                </div>

                                <div className="my-5">
                                    <Button onClick={() => fetchPokemonDescription(
                                        finalPrompt,
                                        setIsDescriptionLoading,
                                        setPokemonDescription
                                    )} disabled={isDescriptionLoading}>
                                        {isDescriptionLoading ? "Generating Description..." : "Generate Description"}
                                    </Button>
                                    {isDescriptionLoading && (
                                        <div className="mt-2">
                                            <SpinnerLoading />
                                        </div>
                                    )}
                                    {pokemonDescription && <p>Pokemon Description: {pokemonDescription}</p>}
                                    {pokemonName && pokemonDescription && (
                                        <Button
                                            onClick={() => submitPokemon(
                                                pokemonName,
                                                pokemonDescription,
                                                finalPrompt,
                                                imageData,
                                                finalSteps,
                                                seed,
                                                generation,
                                                authState,
                                                history,
                                                negativePrompt
                                            )}
                                        >
                                            Submit Pokemon
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </Col>
                    <Col md={6} className="text-center" order={{ md: 2 }}>
                        {imageData ? (
                            <div>
                                <img
                                    src={`data:image/png;base64,${imageData}`}
                                    alt="Generated Pokemon"
                                    className="pokemon-image"
                                />
                                {imageData && (
                                    <>
                                        <p>Seed: {seed}</p>
                                        <p>Prompt: {finalPrompt}</p>
                                        <p>Steps: {steps}</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h3>Design your own Pokemon!</h3>
                                <img src={image} alt="Placeholder" className="my-4 pokemon-image" />
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div >

    );
};


export default MonBuilderPage;
