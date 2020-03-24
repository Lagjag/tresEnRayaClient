### Anotaciones propias del proyecto

    - Proyecto creado por Luis Alamillo
    - Tecnologías:
        - HTML5
        - CSS
        - ReactJS
        - Bootstrap
        - yarn

### Parte funcional

    El proyecto consta de un tres en raya, creado para enfocar hacia una API REST creada en Symfony 4.
    Toda la carga lógica del proyecto se encuentra en dicha api, quí solo se encuentra la lógica necesaria
    para que react pueda ajustar bien los parámetros necesarios.

    El tres en raya consta del modo IA y del 2 juegadores. Por defecto está colocado el modo IA.

    Si se quiere cambiar el tipo de juego hará solo falta clickar sobre el que queramos. Esto
    borrará el tablero que tenemos asociado.

### Iniciando el proyecto

    El proyecto consta de diversos archivos los cuales se deben cambiar para su correcto funcionamiento:

        - .env:
            Aquí deberemos cambiar la variable REACT_APP_API_SYMFONY por la que se encuentre alojado 
            nuestra api del proyecto de Symfony.

    Acto seguido haremos un "yarn install" y luego un "yarn start" para arrancar el servidor local.

    En caso de encontrar algún tipo de fallo al arrancar el servidor se recomienda ejecutar
    "yarn build"

### Mejoras a largo plazo

    - Creación de usuarios
        - nombre
        - partidas ganadas

    - Records
        - idUsuario
        - partidas ganadas

### Cosas por defecto del yarn

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify