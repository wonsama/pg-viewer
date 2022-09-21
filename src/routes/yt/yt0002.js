// file : yt0002.js
// title : MODIFY_PAGE_TITLE
// @since 2022-09-21T15:53:58.421Z (UTC)
const express = require("express");
const router = express.Router();

const { getQuery } = require("../../libs/wsm-pg");
const { getPageDesc } = require("../../libs/wsm-string");
const { unlink } = require("fs");
const xlsx = require("xlsx");
const youtube = require("../../libs/wsm-youtube");

// PAGE title, headers, db target
// if needed, it will changeable with request parameter.
let pageTitle = "PLAYLIST 내 재생목록정보 확인";
let headers = ["publishedAt", "title", "videoId"]; // MODIFY_HERE
// let db_target = "STEEM"; // MODIFY_HERE

router.get("/", function (req, res, next) {
  // DEFAULT PARAM
  const limit = req.query.limit || process.env.DEF_LIMIT_SIZE || 9999;
  const offset = req.query.offset || 0;

  // ADDITIONAL PARAM
  const playlistId = req.query.playlistId || ""; // MODIFY_HERE

  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);

  // QUERY : DEFAULT PARAM + ADDITIONAL PARAM
  // let _query = [limit, offset]; // MODIFY_HERE

  // SEARCH : ADDITIONAL PARAM
  const search_bar = [
    {
      placeholder: "EQ:재생목록 아이디",
      id: "playlistId",
      label: "재생목록 아이디",
      value: playlistId,
    },
  ]; // MODIFY_HERE

  if (playlistId) {
    // AXIOS & RETURN RESULT-SET
    youtube.getPlayListItems(playlistId).then((response) => {
      let rows = response.map((x) => {
        return {
          title: x.snippet.title,
          publishedAt: x.snippet.publishedAt,
          videoId: x.snippet.resourceId.videoId,
        };
      });

      res.render(`./${domain}/${seq}`, {
        domain,
        seq,
        desc,
        title: `${domain} - ${seq} : ${desc}`,
        rows,
        fields: headers,
        limit,
        offset,
        search_bar,
        headers,
        _default: JSON.parse(res.get("_default")),

        // ADDTIONAL PARAM
        playlistId,
        //      tabledesc,
      });
    });
  } else {
    res.render(`./${domain}/${seq}`, {
      domain,
      seq,
      desc,
      title: `${domain} - ${seq} : ${desc}`,
      rows: [],
      fields: headers,
      limit,
      offset,
      search_bar,
      headers,
      _default: JSON.parse(res.get("_default")),

      // ADDTIONAL PARAM
      playlistId,
      //      tabledesc,
    });
  }

  // DB QUERY & RETURN RESULT-SET
  // getQuery(db_target, domain, seq, _query).then((response) => {
  //   res.render(`./${domain}/${seq}`, {
  //     domain,
  //     seq,
  //     desc,
  //     title: `${domain} - ${seq} : ${desc}`,
  //     rows: response.rows,
  //     fields: response.fields,
  //     limit,
  //     offset,
  //     search_bar,
  //     headers,
  //     _default: JSON.parse(res.get("_default")),

  //     // ADDTIONAL PARAM
  //     //      tablename,
  //     //      tabledesc,
  //   });
  // });
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
