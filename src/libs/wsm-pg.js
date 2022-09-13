// file : wsm-pg.js
// desc : postgresql 유틸
// lastupdate : 22.08.25
//
// see more : https://node-postgres.com/
//

const fs = require("fs");
const { join } = require("path");

// const { Pool } = require("pg");
const { Client } = require("pg");

/**
 * 쿼리 정보를 읽어들인다
 * @param {string} domain 업무구분
 * @param {string} seq 4자리 시퀀스, 0000 부터 시작
 * @param {string} params 파라미터 목록 (sql에서는 1부터 매칭)
 */
function _load(domain = "st", seq = "0000", params = []) {
  let sql = fs.readFileSync(
    join(__dirname, `../sql/${domain}/${seq}.sql`),
    "utf-8"
  );

  for (let i = 0; i < params.length; i++) {
    var replace = `\\$${i + 1}`;
    var re = new RegExp(replace, "gi");
    sql = sql.replace(re, params[i]);
  }

  // let split = sql.replace(/\n/gi, "").split("\r");
  let split = sql.replace(/\n/gi, "\r").split("\r");
  // split = Array.isArray(split)?sql.split("\n");
  // console.log("split", split);

  split = split.filter((x) => x.indexOf(":exist()") == -1);
  // split = split.map((x) => x.replace(/\:exist\(.*\)\s/, ""));
  split = split.map((x) => {
    if (x.indexOf(":notexist()") >= 0) {
      return x.replace(":notexist()", "");
    } else if (/\:notexist\(.*\)/.test(x)) {
      return "";
    }
    return x.replace(/\:exist\(.*\)\s/, "");
  });

  return split.join("\r\n");
}

/**
 * 쿼리를 수행한다
 * @param {string} prefix 접두사 (.env 설정 정보 참조용)
 * @param {string} domain 도메인
 * @param {string} seq 일련번호
 * @param {string} params 파라미터
 * @returns 쿼리 수행 결과
 */
async function getQuery(prefix, domain, seq, params) {
  console.log("_load(domain, seq, params)", _load(domain, seq, params));

  let client = getClient(prefix);

  await client.connect();

  let res = await client.query(_load(domain, seq, params), []);
  client.end();

  // console.log(res);

  return {
    fields: res.fields.map((x) => x.name),
    rows: res.rows,
  };
}

/**
 * 클라이언트 정보를 반환한다
 * @param {string} prefix 설정정보 접두사
 * @returns 클라이언트 정보
 */
function getClient(prefix = "IWP_DEV") {
  return new Client({
    user: process.env[prefix + "_PG_USER"],
    host: process.env[prefix + "_PG_HOST"],
    database: process.env[prefix + "_PG_DATABASE"],
    password: process.env[prefix + "_PG_PW"],
    port: process.env[prefix + "_PG_PORT"],
  });
}
// /**
//  * 쿼리를 수행한다 (async)
//  * @param {string} domain 업무구분
//  * @param {string} seq 4자리 시퀀스, 0000 부터 시작
//  * @param {string} params 파라미터 목록 (sql에서는 1부터 매칭)
//  */
// function query(domain = "st", seq = "0000", params = []) {
//   const sql = _load(domain, seq, params);

//   return new Promise((resolve, reject) => {
//     const pool = new Pool();
//     pool.query(sql, (err, res) => {
//       // return
//       if (err) {
//         reject(err);
//       } else {
//         resolve(res);
//       }
//       // close pool
//       pool.end();
//     });
//   });
// }

module.exports = {
  getQuery,
  _load,
};
