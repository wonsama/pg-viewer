// file : wsm-generate.js
// desc :
//  작업 처리를 위한 기본 파일 셋트를 생성해준다
//  세부적으로는 생성 이후 개별 작업처리를 수행해야 된다
// lastupdate : 22.08.31
//
// see more : -
//
const { writeFileSync, mkdirSync, existsSync } = require("fs");
const { join } = require("path");
const _debug = require("debug");
const debug = _debug("pg-viewer");
const debugCreate = _debug("pg-viewer:create-file");
const errorExist = _debug("pg-viewer:error:exist-file");
const errorArugments = _debug("pg-viewer:error:check-arguments");

const PGM_ROOT = join(__dirname, "../../");

/**
 * 기본 sql 파일을 생성한다
 * @param {string} domain 업무 구분 2자리
 * @param {string} seq 업무 구분 2자리 + 일련번호 4자리, 0000부터 시작
 * @param {string} pageTitle 제목
 * @returns 파일 생성 여부
 */
function _genSql(domain = "te", seq = "te0000", pageTitle = "test 입니다.") {
  // 0. 파일 존재여부 파악
  let filename = join(PGM_ROOT, `src/sql/${domain}/${seq}.sql`);
  if (existsSync(filename)) {
    errorExist(`filename : ${filename} is exists.`);
    return false;
  }

  // 1. 기본 값 입력
  let contents = [];
  contents.push(`-- file : ${seq}.sql`);
  contents.push(`-- title : ${pageTitle}`);
  contents.push(`-- @since ${new Date().toISOString()} (UTC)`);
  contents.push(`select`);
  contents.push(`\tnow() modify_header_1, now() modify_header_2`);
  contents.push(`--from`);
  contents.push(`--\t...`);
  contents.push(`--where`);
  contents.push(`--\t...`);
  contents.push(`limit $1 -- limit : default 10`);
  contents.push(`offset $2 -- offset : start with 0`);

  // 2. 파일 생성
  // sql : src/sql/[domain]/[seq].sql : 쿼리 정보, N개 이상의 쿼리가 필요한 경우(분기, 다중 쿼리조합 등) [seq]-1.sql, [seq]-2.sql ... 등으로 생성

  if (!existsSync(`src/sql/${domain}`)) {
    mkdirSync(`src/sql/${domain}`);
  }
  writeFileSync(filename, contents.join("\r"), "utf-8");
  // 3. 생성 완료 여부 알림 및 수정 요청 로깅
  debugCreate(
    `[must check created file & update it !] filename : ${filename} is created.`
  );
  return true;
}

/**
 * 기본 pug 파일을 생성한다
 * @param {string} domain 업무 구분 2자리
 * @param {string} seq 업무 구분 2자리 + 일련번호 4자리, 0000부터 시작
 * @param {string} pageTitle 제목
 * @returns 파일 생성 여부
 */
function _genPug(domain = "te", seq = "te0000", pageTitle = "test 입니다.") {
  // 0. 파일 존재여부 파악
  let filename = join(PGM_ROOT, `src/views/${domain}/${seq}.pug`);
  if (existsSync(filename)) {
    errorExist(`filename : ${filename} is exists.`);
    return false;
  }

  // 1. 기본 값 입력
  let contents = [];
  contents.push(`//- file : ${seq}.pug`);
  contents.push(`//- title : ${pageTitle}`);
  contents.push(`//- @since ${new Date().toISOString()} (UTC)`);
  contents.push(`extends ../layout`);
  contents.push(``);
  contents.push(`block content`);
  // contents.push(`\t-var headers = ['modify_header_1', 'modify_header_2'];`);
  contents.push(`\t+pageHeader(domain, seq, desc)`);
  // contents.push(
  //   `\t//-+pageSearchBar([{placeholder:'MODIFY_INPUT_PLACE_HOLDER', id:'MODIFY_INPUT_ID_LOWERCASE', label:'MODIFY_INPUT_LABEL', ;value:'MODIFY_INPUT_VALUE'}])`
  // );
  contents.push(`\t+pageSearchBar(search_bar)`); // 기본적으로 값이 없어도 있어야 form을 생성
  contents.push(`\t+pageList(rows, headers)`);
  contents.push(`\t+pageFooter()`);
  contents.push(``);
  contents.push(`block scripts `);
  contents.push(`\tscript(src='/js/${domain}/${seq}.js')`);

  // 2. 파일 생성
  // pug-view : src/views/[domain]/[seq].pug : 화면 정보

  if (!existsSync(`src/views/${domain}`)) {
    mkdirSync(`src/views/${domain}`);
  }
  writeFileSync(filename, contents.join("\r"), "utf-8");
  // 3. 생성 완료 여부 알림 및 수정 요청 로깅
  debugCreate(
    `[must check created file & update it !] filename : ${filename} is created.`
  );
  return true;
}

/**
 * 기본 js-routes 파일을 생성한다
 * @param {string} domain 업무 구분 2자리
 * @param {string} seq 업무 구분 2자리 + 일련번호 4자리, 0000부터 시작
 * @param {string} pageTitle 제목
 * @returns 파일 생성 여부
 */
function _genRoutes(domain = "te", seq = "te0000", pageTitle = "test 입니다.") {
  // 0. 파일 존재여부 파악
  let filename = join(PGM_ROOT, `src/routes/${domain}/${seq}.js`);
  if (existsSync(filename)) {
    errorExist(`filename : ${filename} is exists.`);
    return false;
  }

  // 1. 기본 값 입력
  let contents = [];
  contents.push(`// file : ${seq}.js`);
  contents.push(`// title : ${pageTitle}`);
  contents.push(`// @since ${new Date().toISOString()} (UTC)`);
  contents.push(`const express = require("express");`);
  contents.push(`const router = express.Router();`);
  contents.push(``);
  contents.push(`const { getQuery } = require("../../libs/wsm-pg");`);
  contents.push(`const { getPageDesc } = require("../../libs/wsm-string");`);
  contents.push(`const { unlink } = require("fs");`);
  contents.push(`const xlsx = require("xlsx");`);
  contents.push(``);
  contents.push(`// PAGE title, headers, db target`);
  contents.push(`// if needed, it will changeable with request parameter.`);
  contents.push(`let pageTitle = "MODIFY_TITLE_HERE";`);
  contents.push(
    `let headers = ["header1", "header2", "header3"]; // MODIFY_HERE`
  );
  contents.push(`let db_target = "STEEM"; // MODIFY_HERE`);
  contents.push(``);
  contents.push(`router.get("/", function (req, res, next) {`);
  contents.push(`  // DEFAULT PARAM`);
  contents.push(
    `  const limit = req.query.limit || process.env.DEF_LIMIT_SIZE || 10;`
  );
  contents.push(`  const offset = req.query.offset || 0;`);
  contents.push(``);
  contents.push(`  // ADDITIONAL PARAM`);
  contents.push(
    `  // const example = req.query.example || "";  // MODIFY_HERE`
  );
  contents.push(``);
  contents.push(
    `  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);`
  );
  contents.push(``);
  contents.push(`  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM`);
  contents.push(`  let _query = [limit, offset]; // MODIFY_HERE`);
  contents.push(``);
  contents.push(`  // SEARCH : ADDITIONAL PARAM`);
  contents.push(`  const search_bar = [`);
  contents.push(`//    {`);
  contents.push(`//      placeholder: "LIKE:테이블명",`);
  contents.push(`//      id: "tablename",`);
  contents.push(`//      label: "테이블명",`);
  contents.push(`//      value: tablename,`);
  contents.push(`//    },`);
  contents.push(`  ]; // MODIFY_HERE`);
  contents.push(``);
  contents.push(`  // DB QUERY & RETURN RESULT-SET`);
  contents.push(
    `  getQuery(db_target, domain, seq, _query).then((response) => {`
  );
  contents.push("    res.render(`./${domain}/${seq}`, {");
  contents.push(`      domain,`);
  contents.push(`      seq,`);
  contents.push(`      desc,`);
  contents.push("      title: `${domain} - ${seq} : ${desc}`,");
  contents.push(`      rows: response.rows,`);
  contents.push(`      fields: response.fields,`);
  contents.push(`      limit,`);
  contents.push(`      offset,`);
  contents.push(`      search_bar,`);
  contents.push(`      headers,`);
  contents.push(`      _default: JSON.parse(res.get("_default")),`);
  contents.push(``);
  contents.push(`      // ADDTIONAL PARAM`);
  contents.push(`//      tablename,`);
  contents.push(`//      tabledesc,`);
  contents.push(`    });`);
  contents.push(`  });`);
  contents.push(`});`);
  contents.push(``);
  contents.push(`router.get("/download", function (req, res, next) {`);
  contents.push(`  // DEFAULT PARAM - ignore limit & offset`);
  contents.push(`  const limit = 65535; // MAX_VALUE IS 65535`);
  contents.push(`  const offset = 0;`);
  contents.push(``);
  contents.push(`  // ADDITIONAL PARAM`);
  contents.push(
    `  // const example = req.query.example || "";  // MODIFY_HERE`
  );
  contents.push(``);
  contents.push(
    `  let { domain, seq } = getPageDesc(pageTitle, __dirname, __filename);`
  );
  contents.push(``);
  contents.push(`  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM`);
  contents.push(`  let _query = [limit, offset];  // MODIFY_HERE`);
  contents.push(``);
  contents.push(`  // SEARCH : ADDITIONAL PARAM`);
  contents.push(
    `  getQuery(db_target, domain, seq, _query).then((response) => {`
  );
  contents.push(`    let count = 1;`);
  contents.push(`    let ws_data = [];`);
  contents.push(``);
  contents.push(`    // SET HEADER`);
  contents.push(`    ws_data[0] = new Array();`);
  contents.push(`    ws_data[0].push("no");`);
  contents.push(`    for (let header of headers) {`);
  contents.push(`      ws_data[0].push(header);`);
  contents.push(`    }`);
  contents.push(``);
  contents.push(`    // SET BODY`);
  contents.push(`    for (let row of response.rows) {`);
  contents.push(`      ws_data[count] = new Array();`);
  contents.push(`      ws_data[count].push(count);`);
  contents.push(`      for (let header of headers) {`);
  contents.push(`        ws_data[count].push(row[header]);`);
  contents.push(`      }`);
  contents.push(`      count++;`);
  contents.push(`    }`);
  contents.push(``);
  contents.push(`    // MAKE XLSX`);
  contents.push(`    let wb = xlsx.utils.book_new();`);
  contents.push(`    let ws = xlsx.utils.aoa_to_sheet(ws_data);`);
  contents.push(`    xlsx.utils.book_append_sheet(wb, ws, "sheet1");`);
  contents.push(``);
  contents.push(`    let tm = new Date().getTime();`);
  contents.push("    let filename = `${seq}-${tm}.xlsx`;");
  contents.push(`    xlsx.writeFile(wb, filename);`);
  contents.push(`    ws_data = []; // gc ?!`);
  contents.push("    res.download(filename, `${seq}.xlsx`, function (err) {");
  contents.push(`      if (err) {`);
  contents.push(`        console.log(1, err);`);
  contents.push(`      } else {`);
  contents.push(`        // remove temporary file after download`);
  contents.push(`        unlink(filename, function (err) {`);
  contents.push(`          if (err) {`);
  contents.push(`            console.log(2, err);`);
  contents.push(`          }`);
  contents.push(`        });`);
  contents.push(`      }`);
  contents.push(`    });`);
  contents.push(`  });`);
  contents.push(`});`);
  contents.push(``);
  contents.push(`module.exports = { router, use_yn : 'y', title: pageTitle };`);

  // 2. 파일 생성
  // js-route : src/routes/[domain]/[seq].js : 라우팅(get url) 정보

  if (!existsSync(`src/routes/${domain}`)) {
    mkdirSync(`src/routes/${domain}`);
  }
  writeFileSync(filename, contents.join("\r"), "utf-8");
  // 3. 생성 완료 여부 알림 및 수정 요청 로깅
  debugCreate(
    `[must check created file & update it !] filename : ${filename} is created.`
  );
  return true;
}

/**
 * 기본 js 파일을 생성한다
 * @param {string} domain 업무 구분 2자리
 * @param {string} seq 업무 구분 2자리 + 일련번호 4자리, 0000부터 시작
 * @param {string} pageTitle 제목
 * @returns 파일 생성 여부
 */
function _genJs(domain = "te", seq = "te0000", pageTitle = "test 입니다.") {
  // 0. 파일 존재여부 파악
  let filename = join(PGM_ROOT, `src/public/js/${domain}/${seq}.js`);
  if (existsSync(filename)) {
    errorExist(`filename : ${filename} is exists.`);
    return false;
  }

  // 1. 기본 값 입력
  let contents = [];
  contents.push(`// file : ${seq}.js`);
  contents.push(`// title : ${pageTitle}`);
  contents.push(`// @since ${new Date().toISOString()} (UTC)`);
  contents.push(`console.log("${seq}.js loaded");`);

  // 2. 파일 생성
  // js-view : src/public/js/[domain]/[seq].js : 각 화면 존재하는 개별 js 파일

  if (!existsSync(`src/public/js/${domain}`)) {
    mkdirSync(`src/public/js/${domain}`);
  }
  writeFileSync(filename, contents.join("\r"), "utf-8");
  // 3. 생성 완료 여부 알림 및 수정 요청 로깅
  debugCreate(
    `[must check created file & update it !] filename : ${filename} is created.`
  );
  return true;
}

/**
 * 입력받은 값을 기준으로 기본 파일 구성을 생성
 * @param {string} domain 업무 구분 2자리
 * @param {string} seq 업무 구분 2자리 + 일련번호 4자리, 0000부터 시작
 * @param {string} pageTitle 제목
 * @returns 작업처리 성공여부
 */
function gen() {
  // domain = "te", seq = "te0000", pageTitle = "test 입니다."
  if (
    process.argv.length != 4 ||
    process.argv[3].indexOf(process.argv[2]) != 0
  ) {
    debug(process.argv);
    errorArugments("ex) npm run wgen te te0008");
    return false;
  }

  let domain = process.argv[2];
  let seq = process.argv[3];
  // let pageTitle = process.argv[4];
  let pageTitle = "MODIFY_PAGE_TITLE";

  // 파일 생성 : 아래 4개
  // js-view : src/public/js/[domain]/[seq].js : 각 화면 존재하는 개별 js 파일
  _genJs(domain, seq, pageTitle);
  // js-route : src/routes/[domain]/[seq].js : 라우팅(get url) 정보
  _genRoutes(domain, seq, pageTitle);
  // sql : src/sql/[domain]/[seq].sql : 쿼리 정보, N개 이상의 쿼리가 필요한 경우(분기, 다중 쿼리조합 등) [seq]-1.sql, [seq]-2.sql ... 등으로 생성
  _genSql(domain, seq, pageTitle);
  // pug-view : src/views/[domain]/[seq].pug : 화면 정보
  _genPug(domain, seq, pageTitle);

  return true;
}
gen();

// module.exports = {
//   gen,
// };
