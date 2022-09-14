# README - INSTALL

## yarn 설치

[최신버전의 yarn 받아 설치](https://github.com/yarnpkg/yarn/releases)

> install 폴더에 있는 것은 v1.22.19 임
> `$ node ./configs/install/yarn-1.22.19.js install --offline`

## 관련 라이브러리 offline 설치

> `$ yarn package`

## 테스트 제외를 하는 경우 (하지 말것)

- 용량이 가벼워지는 장점이 있음
- devDependency 는 제거됨에 유의
- nodemon, tailwindcss 빌드 등 사용불가

> `yarn install --offline --production`

## 실행

- `yarn dev`
- 자세한 내용은 `package.json` 을 참조

## TAILWIND CSS 자동빌드

```sh
npx tailwindcss -i ./configs/tailwind/input.css -o ./src/public/css/tailwind.css --watch
```

## TAILWIND DOCS

- [flowbite-docs](https://flowbite.com/docs/forms/input-field/)


## added

```txt
info Direct dependencies
└─ markdown-it@13.0.1
info All dependencies
├─ argparse@2.0.1
├─ entities@3.0.1
├─ linkify-it@4.0.1
├─ markdown-it@13.0.1
├─ mdurl@1.0.1
└─ uc.micro@1.0.6

info Direct dependencies
└─ autolinker@4.0.0
info All dependencies
└─ autolinker@4.0.0
```
