// 설정정보 로딩
require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
const MemoryStore = require("memorystore")(session);
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");

const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const i18nextMiddlerware = require("i18next-http-middleware");
const { readdirSync, lstatSync } = require("fs");
const { join } = require("path");

var app = express();
const localesFolder = join(__dirname, "./src/locales");
i18next
  .use(i18nextMiddlerware.LanguageDetector)
  .use(Backend)
  .init({
    initImmediate: false, // setting initImediate to false, will load the resources synchronously
    preload: readdirSync(localesFolder).filter((fileName) => {
      const joinedPath = join(localesFolder, fileName);
      return lstatSync(joinedPath).isDirectory();
    }),
    backend: {
      loadPath: join(localesFolder, "{{lng}}/{{ns}}.json"),
    },
    detection: {
      order: ["querystring", "cookie"],
      caches: ["cookie"],
    },
  });
// fallbackLng 을 제거하고 캐쉬에 쿠키 값을 담도록 처리
app.use(i18nextMiddlerware.handle(i18next));

// view engine setup
app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./src/public")));
var sess = {
  secret: "jfbr8021br0r121",
  resave: false,
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000, // 1 day = ( 24 * 60 * 60 * 1000 = 86400000)
  }),
  saveUninitialized: true,
};
app.use(session(sess));
app.use(bodyParser.json()); // json 등록
app.use(bodyParser.urlencoded({ extended: false })); // URL-encoded 등록

// 라우팅 설정
app.use("/", require("./src/routes/index"));
app.use("/st/st0000", require("./src/routes/st/st0000"));

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
  console.log(1, err);
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  console.log(2, err);
  res.status(err.status || 500);
  res.render("error", { err });
});

module.exports = app;
