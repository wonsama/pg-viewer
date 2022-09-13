const express = require("express");
const router = express.Router();

const { getQuery } = require("../../libs/wsm-pg");
const { getPageDesc } = require("../../libs/wsm-string");
const { unlink } = require("fs");
const xlsx = require("xlsx");

// PAGE title, headers, db target
// if needed, it will changeable with request parameter.
let pageTitle = "테이블 목록 조회";
let headers = ["tablename", "hasindexes", "tablespace", "tabledesc"];
let db_target = "STEEM";

router.get("/", function (req, res, next) {
  // DEFAULT PARAM
  const limit = req.query.limit || process.env.DEF_LIMIT_SIZE || 10;
  const offset = req.query.offset || 0;

  // ADDITIONAL PARAM
  const tablename = req.query.tablename || "";
  const tabledesc = req.query.tabledesc || "";

  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);

  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM
  let _query = [limit, offset, tablename, tabledesc];

  // SEARCH : ADDITIONAL PARAM
  const search_bar = [
    {
      placeholder: "LIKE:테이블명",
      id: "tablename",
      label: "테이블명",
      value: tablename,
    },
    {
      placeholder: "LIKE:테이블설명",
      id: "tabledesc",
      label: "테이블설명",
      value: tabledesc,
    },
  ];

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

      // ADDTIONAL PARAM
      tablename,
      tabledesc,
    });
  });
});

router.get("/download", function (req, res, next) {
  // DEFAULT PARAM - ignore limit & offset
  const limit = 65535; // MAX_VALUE IS 65535
  const offset = 0;

  // ADDITIONAL PARAM
  const tablename = req.query.tablename || "";
  const tabledesc = req.query.tabledesc || "";

  let { domain, seq } = getPageDesc(pageTitle, __dirname, __filename);

  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM
  let _query = [limit, offset, tablename, tabledesc];

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

module.exports = { router, title: pageTitle };
