# SETUP

> 구성환경 : express + pug + pm2 + postgresql

## INSTALL GENERATOR (설치 안 된 경우에만)

`$ npm install express-generator -g`

> pug가 2.0 으로 설치 되므로 제거 후 다시 재설치 하면 최신 버전 3.0^ 으로 설치 되는 것을 볼 수 있다

## EXPRESS + PUG INIT

```sh
$ express --view=pug pg-viewer
$ cd pg-viewer
$ npm install
```

## INSTALL PM2 (설치 안 된 경우에만)

`$ npm install pm2@latest -g`

## INSTALL NODEMON (설치 안 된 경우에만)

`$ npm install -g nodemon`


## ADDED package

> `yarn add dotenv body-parser express-session i18next i18next-fs-backend i18next-http-middleware memorystore pg tailwindcss`

## tailwindcss

```sh
npx tailwindcss init
```

```js
/* tailwind.config.js */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.pug"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

```css
/* ./tailwind/input.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```sh
npx tailwindcss -i ./tailwind/input.css -o ./public/stylesheets/tailwind.css --watch

```

- dotenv : Loads environment variables from .env file
- body-parser : Node.js body parsing middleware
- express-session : Simple session middleware for Express
- i18next : I18next internationalization framework
- i18next-fs-backend : I18next-fs-backend is a backend layer for i18next using in Node.js and for Deno to load translations from the filesystem.
- i18next-http-middleware : I18next-http-middleware is a middleware to be used with Node.js web frameworks like express or Fastify and also for Deno.
- memorystore : Express-session full featured MemoryStore layer without leaks!
- pg : Non-blocking PostgreSQL client for Node.js. Pure JavaScript and optional native libpq bindings.

## 참조링크

- [expressjs : generator](https://expressjs.com/ko/starter/generator.html)
- [pm2 : home](https://pm2.keymetrics.io/)
- [Nodemon 사용하기](https://backend-intro.vlpt.us/1/03.html)
- [letsencript와 docker로 ssl 설치](http://52.78.22.201/tutorials/weplanet/docker-compose-ssl/)
