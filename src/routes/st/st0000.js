const express = require("express");
const router = express.Router();

const { query } = require("../../libs/wsm-pg");
const { getPageDesc } = require("../../libs/wsm-string");

/* GET home page. */
router.get("/", function (req, res, next) {
  let { domain, seq, desc } = getPageDesc(
    `스팀잇 최신글 조회`,
    __dirname,
    __filename
  );

  let _query = req.query.author
    ? [
        req.query.author,
        req.query.limit || 10, // default : 10
        req.query.offset || 0, // start at : 0
      ]
    : [
        req.query.limit || 10, // default : 10
        req.query.offset || 0, // start at : 0
      ];

  query(domain, req.query.author ? seq : seq + "-1", _query).then(
    (response) => {
      res.render(`./${domain}/${seq}`, {
        domain,
        seq,
        desc,
        title: `${domain} - ${seq} : ${desc}`,
        rows: response.rows,
        author: req.query.author,
        limit: req.query.limit || 10,
        offset: req.query.offset || 0,
      });
    }
  );
});

module.exports = router;
