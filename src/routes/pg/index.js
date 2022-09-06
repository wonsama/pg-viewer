const express = require("express");
const router = express.Router();

const { getQuery } = require("../../libs/wsm-pg");
const { getPageDesc } = require("../../libs/wsm-string");
const pageTitle = "PG 화면 상세 목록 조회";

/* GET home page. */
router.get("/", function (req, res, next) {
  const limit = req.query.limit || 9999;
  const offset = req.query.offset || 0;
  const sc_desc = req.query.sc_desc || "";

  let { domain, seq, desc } = getPageDesc(pageTitle, __dirname, __filename); // pg, index, pageTitle

  return res.join({ success: true });

  //   getQuery(DB_TARGET, domain, seq, _query).then((response) => {
  //     res.render(`./${domain}/${seq}`, {
  //       domain,
  //       seq,
  //       desc,
  //       title: `${domain} - ${seq} : ${desc}`,
  //       rows: response.rows,
  //       fields: response.fields,
  //       limit,
  //       offset,
  //       tablename,
  //       tabledesc,
  //     });
  //   });
});

module.exports = { router, title: pageTitle };
