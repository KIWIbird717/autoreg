# AutoRegTG-bot

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Launches both servers simultaneously in the interactive watch mode.\
Open [http://localhost:3000](http://localhost:3000) and [http://localhost:8080](http://localhost:8080) to view more detales in the browser.

### `npm run server`

Launches the BackEnd server runner in the interactive watch mode.\
You can run it separately in `BackEnd` folder, by `npm run dev` command in watch mode\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### `npm run client`

Launches the FrontEnd ReactApp in the interactive watch mode.\
You can run it separately in `WebApp` folder, by `npm rstart` command\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## By the time of release

### TODO list

1. Do not foget to remove `cors policy` in `src/middlewares/login.moddleware.ts`
2. While testing set REACT_APP_SERVER_END_POINT=http://localhost:8080
3. On release set it to REACT_APP_SERVER_END_POINT=http://94.228.115.40:8080