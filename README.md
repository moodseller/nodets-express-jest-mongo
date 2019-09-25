# Description

This is a simple boilerplate of Node.JS + Express + Typescript + Jest + MongoDB.

The boilerplate provides examples on how typescript enhances the standard routing for an express application,
how convenient typescript becomes and how tests require minimal effort.

# Usage

1. Clone this repository ( `git clone git@github.com:wildcookie007/nodets-express-jest-mongo.git` )
2. Run `yarn install`
3. Install docker - `https://www.docker.com/`
4. Run `yarn run-docker`
5. Start the server with `yarn start:dev`

# Structure

```
├── __tests__
│   └── taskRoutes.test.ts
├── app.ts
├── config
│   ├── default.yml
│   └── test.yml
├── controllers
│   └── TaskController.ts
├── docker-compose.yml
├── jest.config.js
├── jest.setup.js
├── mongo
│   ├── MongoService.ts
│   ├── database.ts
│   └── taskStorage.ts
├── package.json
├── routes
│   └── TaskRoutes.ts
├── services
│   ├── loggerService.ts
│   └── settingsService.ts
├── tsconfig.json
├── typings
│   └── partialMock.d.ts
├── utils
│   ├── typed.ts
│   └── utils.ts
└── yarn.lock
```