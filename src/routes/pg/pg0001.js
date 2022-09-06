// file : pg0001.js
// title : MODIFY_PAGE_TITLE
// @since 2022-08-31T11:27:53.879Z (UTC)
const express = require("express");
const router = express.Router();

const { getQuery } = require("../../libs/wsm-pg");
const { getPageDesc } = require("../../libs/wsm-string");
const pageTitle = "테이블 상세 정보를 조회";

/* MODIFY_GET_HERE */
router.get("/", function (req, res, next) {
  const limit = req.query.limit || 9999;
  const offset = req.query.offset || 0;
  const DB_TARGET = "STEEM";

  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);

  let table_name = req.query.table_name || "";
  let _query = [limit, offset, table_name];

  getQuery(DB_TARGET, domain, seq, _query).then((response) => {
    res.render(`./${domain}/${seq}`, {
      domain,
      seq,
      desc,
      title: `${domain} - ${seq} : ${desc}`,
      rows: response.rows,
      limit,
      offset,
      table_name,
    });
  });
});

module.exports = { router, title: pageTitle };
