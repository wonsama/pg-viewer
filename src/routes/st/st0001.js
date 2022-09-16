// file : st0001.js
// title : MODIFY_PAGE_TITLE
// @since 2022-09-13T16:26:36.414Z (UTC)
const express = require("express");
const router = express.Router();

const { getQuery } = require("../../libs/wsm-pg");
const { getPageDesc } = require("../../libs/wsm-string");
const { unlink } = require("fs");
const xlsx = require("xlsx");
const MarkdownIt = require("markdown-it"),
  md = new MarkdownIt();
const Autolinker = require("autolinker");
const autolinker = new Autolinker([]);

// PAGE title, headers, db target
// if needed, it will changeable with request parameter.
let pageTitle = "커뮤니티 기준 조회 (기본 : 스코판)";
let headers = ["author", "title", "link", "created_at"]; // MODIFY_HERE
let db_target = "STEEM"; // MODIFY_HERE
const DEFAULT_COMMUNITY_ID = "1364110"; // 미 기입 시 스코판

router.get("/", function (req, res, next) {
  // DEFAULT PARAM
  const limit = req.query.limit || process.env.DEF_LIMIT_SIZE || 10;
  const offset = req.query.offset || 0;

  // ADDITIONAL PARAM
  const community_id = req.query.community_id || DEFAULT_COMMUNITY_ID; // MODIFY_HERE,
  const author = req.query.author || ""; // MODIFY_HERE

  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);

  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM
  let _query = [limit, offset, community_id, author]; // MODIFY_HERE

  // SEARCH : ADDITIONAL PARAM
  const search_bar = [
    {
      placeholder: "SEL:커뮤니티",
      id: "community_id",
      label: "커뮤니티",
      value: community_id,
      type: "sel",
      options: [
        { value: 1364110, key: "스코판" },
        { value: 1373943, key: "개발자그룹" },
      ],
    },
    {
      placeholder: "EQ:계정명",
      id: "author",
      label: "계정명",
      value: author,
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
      community_id,
      author,
    });
  });
});

router.get("/detail", function (req, res, next) {
  // DEFAULT PARAM
  const limit = req.query.limit || process.env.DEF_LIMIT_SIZE || 10;
  const offset = req.query.offset || 0;

  // ADDITIONAL PARAM
  const post_id = req.query.post_id || ""; // MODIFY_HERE

  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);

  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM
  let _query = [limit, offset, post_id]; // MODIFY_HERE

  // DB QUERY & RETURN RESULT-SET
  getQuery(db_target, domain, `${seq}-1`, _query).then((response) => {
    let mbody = md
      .render(response.rows[0].body)
      .replaceAll("\n", "<br />")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">");

    res.json({
      ...response,
      markdown: autolinker.link(mbody),
    });
  });
});

router.get("/download", function (req, res, next) {
  // DEFAULT PARAM - ignore limit & offset
  const limit = 65535; // MAX_VALUE IS 65535
  const offset = 0;

  // ADDITIONAL PARAM
  const community_id = req.query.community_id || DEFAULT_COMMUNITY_ID; // MODIFY_HERE,
  const author = req.query.author || ""; // MODIFY_HERE

  let { domain, seq } = getPageDesc(pageTitle, __dirname, __filename);

  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM
  let _query = [limit, offset, community_id, author]; // MODIFY_HERE

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
