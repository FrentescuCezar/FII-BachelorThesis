export interface ScriptArgs {
    input_image: string;
    module: string;
    model: string;
    resize_mode: number;
    weight: number;
}


export interface AlwaysonScripts {
    controlnet: {
        args: ScriptArgs[];
    };
}

class TextToImageRequestModel {
    constructor(
        public steps: number,
        public prompt: string,
        public sampler_index: string,
        public seed: number | undefined,
        public negative_prompts: string | undefined,
        public alwayson_scripts: AlwaysonScripts | undefined,
    ) { }
}

export default TextToImageRequestModel;