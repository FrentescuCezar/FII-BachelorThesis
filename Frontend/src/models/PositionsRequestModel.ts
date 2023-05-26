export class PositionsRequestModel {
    positions: string;
    stickmanImage: string;
    imageCustomImage: string;
    constructor(
        positions: string,
        stickmanImage: string,
        imageCustomImage: string
    ) {
        this.positions = positions;
        this.stickmanImage = stickmanImage;
        this.imageCustomImage = imageCustomImage;
    }
}
