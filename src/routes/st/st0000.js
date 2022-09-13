const express = require("express");
const router = express.Router();
const { unlink } = require("fs");
const xlsx = require("xlsx");

const { getQuery } = require("../../libs/wsm-pg");
const { getPageDesc } = require("../../libs/wsm-string");
const pageTitle = "스팀잇 최신글 조회";
const db_target = "STEEM";

const headers = ["post_id", "author", "link", "title", "created_at"];

/* GET home page. */
router.get("/", function (req, res, next) {
  // DEFAULT PARAM
  const limit = req.query.limit || process.env.DEF_LIMIT_SIZE || 10;
  const offset = req.query.offset || 0;

  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);

  const author = req.query.author || ""; // MODIFY_HERE

  let _query = [limit, offset, author]; // MODIFY_HERE

  getQuery(db_target, domain, seq, _query).then((response) => {
    res.render(`./${domain}/${seq}`, {
      domain,
      seq,
      desc,
      title: `${domain} - ${seq} : ${desc}`,
      rows: response.rows,
      headers,
      limit,
      offset,
      author,
    });
  });
});

router.get("/download", function (req, res, next) {
  // DEFAULT PARAM - ignore limit & offset
  const limit = 65535; // MAX_VALUE IS 65535
  const offset = 0;

  // ADDITIONAL PARAM
  const author = req.query.author || ""; // MODIFY_HERE

  let { domain, seq } = getPageDesc(pageTitle, __dirname, __filename);

  let _query = [limit, offset, author]; // MODIFY_HERE

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
