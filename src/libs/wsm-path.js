// file : wsm-path.js
// desc : 경로처리 유틸
// lastupdate : 22.08.31
//
// see more : -
//
const { join } = require("path");
const { readdirSync, lstatSync } = require("fs");

/**
 * 최초 동적으로 라우팅 정보를 설정하기 위함
 * routes 폴더 -> xx 폴더 아래 존재하는 js 파일의 경로를 보고 자동으로 라우팅 정보 등록 처리
 * @returns 라우팅 처리 목록 정보
 */
function getRoutes() {
  const ROUTES_ROOT = `src/routes`;
  let folders = readdirSync(ROUTES_ROOT).filter((fileName) => {
    const joinedPath = join(ROUTES_ROOT, fileName);
    return lstatSync(joinedPath).isDirectory();
  });

  let results = []; // path, require
  for (let folder of folders) {
    let fnames = readdirSync(join(ROUTES_ROOT, folder)).filter((fileName) => {
      const joinedPath = join(ROUTES_ROOT, folder, fileName);
      return !lstatSync(joinedPath).isDirectory();
    });
    for (let fname of fnames) {
      let sc_desc = fname.split(".")[0];
      if (sc_desc != "index") {
        results.push({
          path: `/${folder}/${sc_desc}`,
          require: `./src/routes/${folder}/${sc_desc}`,
        });
      } else {
        results.push({
          path: `/${folder}`,
          require: `./src/routes/${folder}/${sc_desc}`,
        });
      }
    }
  }
  return results;
}

module.exports = {
  getRoutes,
};
