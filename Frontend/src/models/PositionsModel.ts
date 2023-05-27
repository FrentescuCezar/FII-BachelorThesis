export class Positions {
    id: number;
    username: string;
    positions: string;
    stickmanImage: string;
    imageCustomImage: string;
    generatedImage: string;

    constructor(
        id: number,
        username: string,
        positions: string,
        stickmanImage: string,
        imageCustomImage: string,
        generatedImage: string

    ) {
        this.id = id;
        this.username = username;
        this.positions = positions;
        this.stickmanImage = stickmanImage;
        this.imageCustomImage = imageCustomImage;
        this.generatedImage = generatedImage;
    }
}
