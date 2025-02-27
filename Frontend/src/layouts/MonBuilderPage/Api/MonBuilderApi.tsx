import ImageRequestModel from '../../../models/TextToImageRequestModel'
import PoketexRequestModel from '../../../models/PoketexRequestModel'



// Image generation
// Adjust return type to string
// Adjust return type to Promise<string | undefined>
export async function submitPrompt(
    steps: number,
    prompt: string,
    sampler_index: string,
    setIsImageLoading: (loading: boolean) => void,
    setImageData: (data: string) => void,
    setSeed: (seed: number) => void,
    imageIndex: number = 0,
    seed?: number,
    negative_prompts?: string,
    alwayson_scripts?: any
): Promise<string | undefined> {
    setIsImageLoading(true);

    prompt = "white background, simple background, sugimori ken \(style\), pokemon \(creature\)," + prompt + ", no humans, highres, pokemon, other focus, <lora:pokemon_v3_offset:1>"
    const imageRequestModel = new ImageRequestModel(steps, prompt, sampler_index, seed, negative_prompts, alwayson_scripts);
    const url = `http://localhost:8081/api/textToImage`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(imageRequestModel),
    };

    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Something went wrong!");
        }

        setSeed(data.seed); // Moved up

        if (data.images && data.images.length > 0) {
            setImageData(data.images[imageIndex]);
            return data.images[imageIndex]; // return the fetched image data
        } else {
            throw new Error("No images returned");
        }

    } catch (error) {
        console.error(error);
    } finally {
        setIsImageLoading(false);
    }
}



// Name generation
export async function fetchPokemonName(
    prompt: string,
    setIsNameLoading: (loading: boolean) => void,
    setPokemonName: (name: string) => void
) {
    setIsNameLoading(true);
    const url = `http://localhost:8088/name?prompt=${encodeURIComponent(prompt)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Something went wrong!");
        }

        setPokemonName(data.name);
    } catch (error) {
        console.error(error);
    } finally {
        setIsNameLoading(false);
    }
}

// Description generation
export async function fetchPokemonDescription(
    prompt: string,
    setIsDescriptionLoading: (loading: boolean) => void,
    setPokemonDescription: (description: string) => void
) {
    setIsDescriptionLoading(true);
    const url = `http://localhost:8088/description?prompt=${encodeURIComponent(prompt)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Something went wrong!");
        }

        setPokemonDescription(data.description);
    } catch (error) {
        console.error(error);
    } finally {
        setIsDescriptionLoading(false);
    }
}

export async function submitPokemon(
    name: string,
    description: string,
    prompt: string,
    image: string,
    steps: number,
    seed: number,
    generation: number,
    authState: any,
    history: any,
    imageControlNet?: string,
    negativePrompt?: string,
    parent1?: number,
    parent2?: number,
) {

    const poketexRequestModel = new PoketexRequestModel(name, description, prompt, image, steps, seed, generation, negativePrompt, parent1, parent2, imageControlNet);

    console.log(JSON.stringify(poketexRequestModel));

    const url = `http://localhost:8084/api/poketex/create`;
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
        alert('Pokemon successfully created!');

        // Redirect to /home
        history.push('/home');
    } catch (error) {
        console.error(error);
        alert('Failed to create Pokemon. Please try again.');
    }
}