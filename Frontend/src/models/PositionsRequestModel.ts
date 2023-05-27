export class PositionsRequestModel {
    positions: string;
    stickmanImage: string;
    imageCustomImage: string;
    generatedImage: string;
    constructor(
        positions: string,
        stickmanImage: string,
        imageCustomImage: string,
        generatedImage: string
    ) {
        this.positions = positions;
        this.stickmanImage = stickmanImage;
        this.imageCustomImage = imageCustomImage;
        this.generatedImage = generatedImage;
    }
}
