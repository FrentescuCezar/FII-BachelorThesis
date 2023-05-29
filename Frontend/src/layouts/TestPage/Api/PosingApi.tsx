import { PositionsRequestModel } from "../../../models/PositionsRequestModel";

export async function submitPositions(
    positions: string,
    stickmanImage: string,
    imageCustomImage: string,
    generatedImage: string,
    authState: any,
) {

    generatedImage = "data:image/png;base64," + generatedImage;
    const poketexRequestModel = new PositionsRequestModel(positions, stickmanImage, imageCustomImage, generatedImage);

    const url = `http://localhost:8081/api/positions/addPosition`;

    console.log(JSON.stringify(poketexRequestModel))


    const requestOptons = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(poketexRequestModel)
    };
    try {
        const response = await fetch(url, requestOptons);

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        // Show success alert
        alert('Positions successfully created!');


    } catch (error) {
        console.error(error);
        alert('Failed to create Positions. Please try again.');
    }
}