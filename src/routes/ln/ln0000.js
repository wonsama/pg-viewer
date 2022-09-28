// file : ln0000.js
// title : MODIFY_PAGE_TITLE
// @since 2022-09-28T12:40:23.719Z (UTC)
const express = require("express");
const router = express.Router();

const { getQuery } = require("../../libs/wsm-pg");
const { getPageDesc } = require("../../libs/wsm-string");
const { unlink } = require("fs");
const xlsx = require("xlsx");

// PAGE title, headers, db target
// if needed, it will changeable with request parameter.
let pageTitle = "DEV BLOG 목록 조회";
let headers = ["link_cd", "link_title", "link_uri"]; // MODIFY_HERE
let db_target = "STEEM"; // MODIFY_HERE

router.get("/", function (req, res, next) {
  // DEFAULT PARAM
  // const limit = req.query.limit || process.env.DEF_LIMIT_SIZE || 10;
  const limit = 9999;
  const offset = req.query.offset || 0;

  // ADDITIONAL PARAM
  const link_cd = req.query.link_cd || ""; // link_cd
  const link_title = req.query.link_title || ""; // link_title

  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);

  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM
  let _query = [limit, offset, link_cd, link_title]; // MODIFY_HERE

  // SEARCH : ADDITIONAL PARAM
  const search_bar = [
    {
      placeholder: "SEL:타입",
      id: "link_cd",
      label: "타입",
      value: link_cd,
      type: "sel",
      options: [
        { value: "kortechblog", key: "국내기술블로그" },
        { value: "ostechblog", key: "해외기술블로그" },
        { value: "kortechcont", key: "국내기술컨텐츠플랫폼" },
      ],
    },
    {
      placeholder: "LIKE:제목",
      id: "link_title",
      label: "제목",
      value: link_title,
    },
  ]; // MODIFY_HERE

  // DB QUERY & RETURN RESULT-SET
  getQuery(db_target, domain, seq, _query).then((response) => {
    res.render(`./${domain}/${seq}`, {
      domain,
      seq,
      desc,
      title: `${domain} - ${seq} : ${desc}`,
      rows: response.rows,
      fields: response.fields,
      limit,
      offset,
      search_bar,
      headers,
      _default: JSON.parse(res.get("_default")),

      // ADDTIONAL PARAM
      link_cd,
      link_title,
    });
  });
});

router.get("/download", function (req, res, next) {
  // DEFAULT PARAM - ignore limit & offset
  const limit = 65535; // MAX_VALUE IS 65535
  const offset = 0;

  // ADDITIONAL PARAM
  // const example = req.query.example || "";  // MODIFY_HERE

  let { domain, seq } = getPageDesc(pageTitle, __dirname, __filename);

  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM
  let _query = [limit, offset]; // MODIFY_HERE

  // SEARCH : ADDITIONAL PARAM
  getQuery(db_target, domain, seq, _query).then((response) => {
    let count = 1;
    let ws_data = [];

    // SET HEADER
    ws_data[0] = new Array();
    ws_data[0].push("no");
    for (let header of headers) {
      ws_data[0].push(header);
    }

    // SET BODY
    for (let row of response.rows) {
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
    let filename = `${seq}-${tm}.xlsx`;
    xlsx.writeFile(wb, filename);
    ws_data = []; // gc ?!
    res.download(filename, `${seq}.xlsx`, function (err) {
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
});

module.exports = { router, use_yn: "y", title: pageTitle };
