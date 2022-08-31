const express = require("express");
const router = express.Router();

const { getQuery } = require("../../libs/wsm-pg");
const { getPageDesc } = require("../../libs/wsm-string");
const pageTitle = "테이블 목록 조회";

/* GET home page. */
router.get("/", function (req, res, next) {
  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename);

  let _query = [
    req.query.limit || 10, // default : 10
    req.query.offset || 0, // start at : 0
    req.query.tablename || "",
    req.query.tabledesc || "",
  ];

  getQuery("STEEM", domain, seq, _query).then((response) => {
    res.render(`./${domain}/${seq}`, {
      domain,
      seq,
      desc,
      title: `${domain} - ${seq} : ${desc}`,
      rows: response.rows,
      fields: response.fields,
      limit: req.query.limit || 10,
      offset: req.query.offset || 0,
      tablename: req.query.tablename || "",
      tabledesc: req.query.tabledesc || "",
    });
  });
});

module.exports = { router, title: pageTitle };
