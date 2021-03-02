# pngql-template

> A battery-included **P**risma, **N**exus, **G**raphQL Template

## About

This template provides a very basic User/Post type under the GraphQL protocol, implemented using Nexus, backed with Prisma, and served using express (Apollo)

## Features

* JWT
* Prisma/JWT functions from context
* Authentication plugin integration with JWT (read/write guard)
* Basic CORS middleware

## Setup

First, clone this repo using `degit` or any other template generator tool you are familiar with

```
npx degit esinx/pngql-template#main ./destination
```

Run `scripts/create-keys.sh` to create JWT keys.
Use the `.env.default` configuration if you wish. Change the variables as you need.

```
JWT_PRIVATE_KEY_PATH=./keys/private.pem
JWT_PUBLIC_KEY_PATH=./keys/public.pem
PORT=8000
DATABASE_URL="file:./dev.db"
```

Run `npm install && npm run generate` before start working on your project to make sure that typescript definitions are recognized by the language server.