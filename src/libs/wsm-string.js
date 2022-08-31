// file : wsm-string.js
// desc : 문자열 유틸
// lastupdate : 22.08.25
//
// see more : -
//

/**
 * 해당 페이지 정보를 가져온다
 * @param {string} desc 상세정보
 * @param {string} dirname 폴더명 ( __dirname ) 넣어주기
 * @param {string} desc 파일명 ( __filename ) 넣어주기
 */
function getPageDesc(desc, dirname, filename) {
  let _domain = dirname.split(/[\\/]+/);
  let domain = _domain[_domain.length - 1];
  let _seq = filename.split(/[\\/]+/);
  let seq = _seq[_seq.length - 1].split(".")[0];

  return { domain, seq, desc };
}

module.exports = { getPageDesc };
