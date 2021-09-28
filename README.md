# EncryptionServer

## Getting started

1. Setup:

- create `.env` file in project root directory [encryption_server](./encryption_server) with environmental variables which will be used in application,
  example [.env.example](./encryption_server/.env.example) file has been created
- install required dependencies from [package.json](./encryption_server/package.json) using `npm` or `yarn`
- `yarn` was used by myself in development process

2. Available scripts:

- `start` - starts application
- `dev` - starts application in dev environment using Nodemon

Project can be run with package manager of your choice (`npm` or `yarn`)

- Mocked users with details:

```json
[
  {
    "id": 0,
    "name": "John Doe",
    "username": "john",
    "email": "john@example.com",
    "password": "john123",
  },
  {
    "id": 1,
    "name": "Jane Doe",
    "username": "jane",
    "email": "jane@example.com",
    "password": "jane123",
  },
];
```

- Authorization in application has been implemented using JWT tokens sent in HTTP `Authorization` header using HTTP Bearer authentication scheme:

```
Authorization: Bearer {JWT_TOKEN}
```

Project was tested with `Node.js v14.17.6` (`npm v6.14.15`) and `yarn v1.22.5`

### Available endpoints

- Unauthorized `POST /api/sign-in`

- Authorized `POST /api/generate-key-pair`

- Authorized `POST /api/encrypt`
