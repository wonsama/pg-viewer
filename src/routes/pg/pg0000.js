const express = require("express");
const router = express.Router();

const { getQuery } = require("../../libs/wsm-pg");
const { getPageDesc } = require("../../libs/wsm-string");
const pageTitle = "테이블 목록 조회";
const headers = ["tablename", "hasindexes", "tablespace", "tabledesc"];

/* GET home page. */
router.get("/", function (req, res, next) {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const tablename = req.query.tablename || "";
  const tabledesc = req.query.tabledesc || "";
  const DB_TARGET = "STEEM";

  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);

  let _query = [limit, offset, tablename, tabledesc];
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

  getQuery(DB_TARGET, domain, seq, _query).then((response) => {
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

      tablename,
      tabledesc,
    });
  });
});

const xlsx = require("xlsx");

router.get("/download", function (req, res, next) {
  const limit = 65535;
  const offset = 0;
  const tablename = req.query.tablename || "";
  const tabledesc = req.query.tabledesc || "";
  const DB_TARGET = "STEEM";

  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);

  let _query = [limit, offset, tablename, tabledesc];

  getQuery(DB_TARGET, domain, seq, _query).then((response) => {
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

    let filename = "output.xlsx";
    xlsx.writeFile(wb, filename);
    ws_data = [];

    res.download(filename);
  });
});

module.exports = { router, title: pageTitle };
