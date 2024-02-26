# FII-BachelorThesis
<p align="center">
  <img src="https://github.com/FrentescuCezar/FIIPractic_Bytex/blob/main/Poketex/03-frontend/poketex/src/Images/PublicImages/Pokytex-2.png" width=500 title="Poketex">
</p>


# Poketex

Poketex is a web platform that provides users with tools to generate and interact with Pokémon characters created through AI. \
It is the product of a bachelor's thesis from the Faculty of Computer Science in Iasi and an extension of a project that won at FIIPractic. \
Link to the [paper](https://drive.google.com/file/d/1Y5UpqZdQTxSfG8lrnkKJ85DhHBkvWETI/view?usp=drive_link).



## Features



### Community and Engagement
- **Main Page**: Showcases the most popular Pokémon and includes search functionality with pagination.

|                                          Home                                                            |
| ---------------------------------------------------------------------------------------------------- |
| <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/1.png" width="500"></div> |


  
- **Rating and Comments**: Users can rate ⭐⭐⭐⭐⭐ and comment on each Pokémon.


### MonBuilder: AI-Based Pokémon Creation
- **MonBuilder**: AI-Based Pokémon Creation tool where users can specify a prompt for how the Pokémon should look, a negative prompt for excluding certain elements, a seed for precise and consistent generation, and the number of steps for processing intensity.

|                                          Home                                                            |
| ---------------------------------------------------------------------------------------------------- |
| <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/2.png" width="500"></div> |

- **PokePaint**: A drawing interface where users can sketch their ideas. The AI interprets these sketches to generate a Pokémon image.
  - *Paint*: Real-Time canvas with the ability to draw, Erase, Change color or the Brush size, Undo/Redo and image uploading.
  - *ControlNET Integration*: Enhances image uploads by transforming them into pencil sketches with "control_v11p_sd15s2_lineart_anime" preprocessor.
  - *NSFWJS*: Ensuring the content is Safe for Work testing the image for malicious or +18 content.



|                       Paint Components                        |                      NSFWJS (Adult Content Filtering)                       |                     Image Uploading with ControlNET Preprocessing                        |
| ------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/3.5.png" width="500"></div> | <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/3.png" width="500"></div> | <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/4.png" width="500"></div> |



- **StickPose**: A stickman editor allows the user to pose figures with adjustable joints. Depth Maps and image segmentation are employed to add and layer objects, creating a scene for the AI to interpret.
  - Allows for the adding or removal of any stickman from the scene.
  - Users can add objects to the scene.
  - Stickmen and objects can be moved forwards or backwards in the scene.
  - Offers settings to adjust how much the pose affects the generated image.
  - Includes a function to save and load poses into/from a database.

|                       StickPose examples                        |                      Image Generation                       |                     Saved Poses                       |
| ------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/5.2.gif" width="400"></div> | <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/5.4.png" width="700"></div> | <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/5.5.png" width="300"></div> |


|                       Technologies for Image Segmentation                        |                     DepthMaps Objects Menu                       |                     Overlapping the Generation with Objects                       |
| ------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/11.png" width="500"></div> | <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/Picture1.png" width="500"></div> | <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/9.png" width="500"></div> |

- **ChatGPT Integration**: Using the ChatGPT API and the prompt of the Pokemon, it generates a name and a backstory of the character.

|                                          LLM Generated Text                                                            |
| ---------------------------------------------------------------------------------------------------- |
| <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/7.png" width="300"></div> |


### User Profiles and Pokémon Database
- **Profiles**: Users have their profiles where their generated Pokémon are displayed with unique names and stories.
- **Breeding**: Users can combine two Pokémon, one from their collection and another from their own or another user's collection.

|              User Profile              |              Breeding              |
| ---------------------------------- | ---------------------------------- |
| <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/6.2.png" width="300"></div> | <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/6.1.png" width="500"></div> |


- **Pokémon Pages**: Each Pokémon has a dedicated page featuring its story, attributes, and community ratings.

|                                          Pokemon                                                            |
| ---------------------------------------------------------------------------------------------------- |
| <div style="display: flex; justify-content: center;"><img src="https://github.com/FrentescuCezar/FII-BachelorThesis/blob/main/Screenshots/8.png" width="300"></div> |


## AI Model & Technologies

**Frontend** \
_React_ [React official website](https://react.dev/)<br />
_Konva-React_ [Konva-React official website](https://konvajs.org/)<br />
_TypeScript_ [TypeScript official website](https://www.typescriptlang.org/)<br />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" width="70"/>

 **Backend** \
_API_ [Java Spring Boot](https://spring.io/)<br />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Spring_Framework_Logo_2018.svg/1280px-Spring_Framework_Logo_2018.svg.png" width = "200"> <br />

**Database** <br />
_PostgreSQL_ [PostgreSQL official website](https://www.postgresql.org/ ) <br />
<img src="https://www.turnkeylinux.org/files/images/postgresql-logo-for-blog.png" width="200"/> <br/>

**Stable Diffusion with LoRA and ControlNET** <br />
- Art generation is powered by the model trained by Justin Pinkney, with Lambda Diffuser and Stable Diffusion:
  - Stable Diffusion Checkpoint: https://civitai.com/models/23900/anylora-checkpoint
  - Stable Diffusion LoRA: https://civitai.com/models/5115/pokemon-lora-ken-sugimori-style-for-fakemon-and-characters
  - ControlNET Preprocessor: https://huggingface.co/lllyasviel/control_v11p_sd15s2_lineart_anime
- Stable Diffusion module utilizes the Automatic1111 nowebui Rest API: https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API.

**Other A.Is used**
- NSFWSJS library to check the content of the uploaded images: https://github.com/infinitered/nsfwjs
- IS-NET for Image Segmentation: https://arxiv.org/abs/2108.12382
- ZoeDepth used to create depth maps for objects in the editor: https://github.com/isl-org/ZoeDepth

**ChatGPT** <br />
- The Name and the Description of the pokemon is automatically generated with ChatGPT-3.5TURBO model : https://github.com/PlexPt/chatgpt-java

**Security** <br />
- Authentication and user management is handled by Okta with OAuth2 security. https://developer.okta.com/


## Acknowledgements

- Bytex for organizing the "Java in the world of microservices" training (Trainers : Alexandru Cretu, Cristian Danila)
- Justin Pinkney for the art generation model.
- Automatic1111 for the Stable Diffusion API
- PlexPt for the ChatGPT connexions
- Okta for providing user authentication and management.

