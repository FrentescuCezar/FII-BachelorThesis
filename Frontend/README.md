# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

```
Frontend
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ public
│  ├─ css
│  │  └─ NavbarStyle.css
│  ├─ favicon.ico
│  ├─ index.html
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ manifest.json
│  └─ robots.txt
├─ README.md
├─ setupProxy.ts
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ Auth
│  │  ├─ Login.jsx
│  │  └─ OktaSignInWidget.jsx
│  ├─ Images
│  │  ├─ PokemonImage
│  │  │  └─ Default-Pokemon.png
│  │  ├─ PublicImages
│  │  │  ├─ image-1.jpg
│  │  │  ├─ MonBuilderImage.png
│  │  │  ├─ Pokytex-2.png
│  │  │  ├─ Pokytex_Loading.png
│  │  │  └─ usernamePhoto.png
│  │  └─ StickmenImage
│  │     ├─ AddStickman.gif
│  │     ├─ BackwardsStickman.gif
│  │     ├─ ForwardStickman.gif
│  │     └─ RemoveStickman.gif
│  ├─ index.css
│  ├─ index.tsx
│  ├─ layouts
│  │  ├─ BreedingPage
│  │  │  ├─ BreedingPage.tsx
│  │  │  └─ Components
│  │  │     └─ PokemonsForBreeding.tsx
│  │  ├─ GuessThePokemon
│  │  │  ├─ Api
│  │  │  │  └─ pokeMysteryApi.ts
│  │  │  ├─ Components
│  │  │  │  ├─ GuessInputForm.tsx
│  │  │  │  ├─ PokeMysteryDesktop.tsx
│  │  │  │  ├─ PokeMysteryMobile.tsx
│  │  │  │  └─ RemainedTries.tsx
│  │  │  ├─ PokeMysteryPage.tsx
│  │  │  └─ Utils
│  │  │     ├─ pokeMysteryUtils.ts
│  │  │     ├─ PokeMysteryUtils2.tsx
│  │  │     └─ SilhouetteImage.tsx
│  │  ├─ Homepage
│  │  │  ├─ Components
│  │  │  │  ├─ Carousel.tsx
│  │  │  │  ├─ PoketexServices.tsx
│  │  │  │  └─ ReturnPokemon.tsx
│  │  │  └─ Homepage.tsx
│  │  ├─ MonBuilderPage
│  │  │  ├─ Api
│  │  │  │  └─ MonBuilderApi.tsx
│  │  │  ├─ Component
│  │  │  └─ MonBuilderPage.tsx
│  │  ├─ NavbarAndFooter
│  │  │  ├─ Footer.tsx
│  │  │  ├─ Navbar.module.css
│  │  │  ├─ Navbar.tsx
│  │  │  └─ NavBarUserCircle.tsx
│  │  ├─ PoketexPage
│  │  │  ├─ Api
│  │  │  │  └─ PoketexApi.ts
│  │  │  ├─ Components
│  │  │  │  ├─ Comments
│  │  │  │  │  ├─ CommentBox.tsx
│  │  │  │  │  ├─ CommentListPage
│  │  │  │  │  │  └─ CommentListPage.tsx
│  │  │  │  │  ├─ CommentMessage.tsx
│  │  │  │  │  ├─ LatestComments.tsx
│  │  │  │  │  ├─ LeaveAComment.tsx
│  │  │  │  │  └─ StarsComment.tsx
│  │  │  │  ├─ PoketexStats
│  │  │  │  │  ├─ Abilities.tsx
│  │  │  │  │  ├─ PoketexStats.tsx
│  │  │  │  │  └─ Seed.tsx
│  │  │  │  └─ RelatedPoketexes.tsx
│  │  │  └─ PoketexPage.tsx
│  │  ├─ SearchPoketexesPage
│  │  │  ├─ Api
│  │  │  │  └─ fetchPoketexes.ts
│  │  │  ├─ Components
│  │  │  │  └─ SearchPoketex.tsx
│  │  │  └─ SearchPoketexesPage.tsx
│  │  ├─ TestPage
│  │  │  ├─ Api
│  │  │  │  └─ PosingApi.tsx
│  │  │  ├─ Components
│  │  │  │  ├─ Canvas
│  │  │  │  │  ├─ CanvasCustom.tsx
│  │  │  │  │  ├─ CanvasPage.tsx
│  │  │  │  │  ├─ Css
│  │  │  │  │  │  └─ Canvas.css
│  │  │  │  │  ├─ ToolbarStable.tsx
│  │  │  │  │  └─ UploadImageModal.tsx
│  │  │  │  ├─ DepthMaps
│  │  │  │  │  └─ DepthMapModal.tsx
│  │  │  │  ├─ Options
│  │  │  │  │  └─ Options.tsx
│  │  │  │  ├─ Positions
│  │  │  │  │  └─ PositionsModal.tsx
│  │  │  │  └─ Stickman
│  │  │  │     ├─ Colors.ts
│  │  │  │     ├─ Stickman.tsx
│  │  │  │     ├─ TransformerCustom.tsx
│  │  │  │     └─ Utils
│  │  │  │        └─ StickmanFunctions.tsx
│  │  │  ├─ Image
│  │  │  │  └─ Image.tsx
│  │  │  ├─ StickmanPage.tsx
│  │  │  └─ Utils
│  │  │     ├─ StickmanPageFunctions.tsx
│  │  │     └─ StickmanScalesProvider.tsx
│  │  ├─ UserPage
│  │  │  ├─ Api
│  │  │  │  └─ fetchRelatedPoketex.ts
│  │  │  ├─ Components
│  │  │  │  └─ UserPokemons.tsx
│  │  │  └─ UserPage.tsx
│  │  └─ Utils
│  │     ├─ Pagination.tsx
│  │     ├─ PoketexDetailsUtils.tsx
│  │     └─ SpinnerLoading.tsx
│  ├─ lib
│  │  └─ oktaConfig.ts
│  ├─ logo.svg
│  ├─ models
│  │  ├─ CommentModel.ts
│  │  ├─ CommentRequestModel.ts
│  │  ├─ PoketexModel.ts
│  │  ├─ PoketexRequestModel.ts
│  │  ├─ PositionsModel.ts
│  │  ├─ PositionsRequestModel.ts
│  │  └─ TextToImageRequestModel.ts
│  ├─ okta.d.ts
│  ├─ react-app-env.d.ts
│  └─ setupProxy.ts
└─ tsconfig.json

```