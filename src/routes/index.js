// file : index.js
// title : 메인 페이지
// @since 2022-09-06T14:27:55.650Z (UTC)
const express = require("express");
const router = express.Router();

// const { getQuery } = require("../../libs/wsm-pg");
// const { getPageDesc } = require("../../libs/wsm-string");
const { unlink } = require("fs");
const xlsx = require("xlsx");

// const { readdirSync } = require("fs");

// PAGE title, headers, db target
// if needed, it will changeable with request parameter.
let pageTitle = "전체 도메인(업무구분) 목록 조회";
let headers = ["domain_no", "page_title", "use_yn"]; // MODIFY_HERE
// let db_target = "STEEM"; // MODIFY_HERE

router.get("/", function (req, res, next) {
  // DEFAULT PARAM
  const limit = 9999; // MAX LIMIT is 9999
  const offset = 0;

  // ADDITIONAL PARAM
  const domain_no = req.query.domain_no || "";
  const page_title = req.query.page_title || "";
  // const use_yn = req.query.use_yn || "";

  // let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);
  let domain = "all";
  let seq = "";
  let desc = pageTitle;

  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM
  // let _query = [limit, offset, page_no, page_title]; // MODIFY_HERE

  // SEARCH : ADDITIONAL PARAM
  const search_bar = []; // MODIFY_HERE

  let rows = getRows();

  // RETURN RESULT-SET
  res.render(`./`, {
    domain,
    seq,
    desc,
    title: `${domain} - ${seq} - ${desc}`,
    rows: rows, // CHECK
    fields: search_bar.map((x) => x.id), // CHECK
    limit,
    offset,
    search_bar,
    headers,

    // ADDTIONAL PARAM
    domain_no,
    page_title,
  });
});

router.get("/download", function (req, res, next) {
  // DEFAULT PARAM - ignore limit & offset
  const limit = 65535; // MAX_VALUE IS 65535
  const offset = 0;

  // ADDITIONAL PARAM
  // const page_no = req.query.page_no || "";
  // const page_title = req.query.page_title || "";
  // const use_yn = req.query.use_yn || "";

  // let { domain, seq } = getPageDesc(pageTitle, __dirname, __filename);
  let domain = "all";
  // let seq = "";

  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM
  // let _query = [limit, offset, page_no, page_title]; // MODIFY_HERE
  let rows = getRows();

  // SEARCH : ADDITIONAL PARAM
  let count = 1;
  let ws_data = [];

  // SET HEADER
  ws_data[0] = new Array();
  ws_data[0].push("no");
  for (let header of headers) {
    ws_data[0].push(header);
  }

  // SET BODY
  for (let row of rows) {
    ws_data[count] = new Array();
    ws_data[count].push(count);
    for (let header of headers) {
      ws_data[count].push(row[header]);
    }
    count++;
  }

  // MAKE XLSX
  let wb = xlsx.utils.book_new();
  let ws = xlsx.utils.aoa_to_sheet(ws_data);
  xlsx.utils.book_append_sheet(wb, ws, "sheet1");

  let tm = new Date().getTime();
  let filename = `${domain}-${tm}.xlsx`;
  xlsx.writeFile(wb, filename);
  ws_data = []; // gc ?!
  res.download(filename, `${domain}.xlsx`, function (err) {
    if (err) {
      console.log(1, err);
    } else {
      // remove temporary file after download
      unlink(filename, function (err) {
        if (err) {
          console.log(2, err);
        }
      });
    }
  });
});

function getRows() {
  let rows = [];
  rows.push({
    domain_no: "pg",
    page_title: "postgresql 관련",
    use_yn: "Y",
  });
  rows.push({
    domain_no: "st",
    page_title: "STEEM 관련",
    use_yn: "Y",
  });

  return rows;
}

module.exports = { router, title: pageTitle };
