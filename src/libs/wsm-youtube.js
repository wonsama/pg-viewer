// - [youtube/v3/getting-started](https://developers.google.com/youtube/v3/getting-started?hl=ko)
// - https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas?authuser=1&project=plexiform-bot-272122
const axios = require("axios").default;

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";

/**
 * VIDEO ID 를 가지고 채널 ID 정보를 조회한다
 * Swj8qOuZ4Jg
 * @param {string} videoId 비디오 아이디
 * @return {string} 채널 아이디
 */
async function getChannelId(videoId) {
  //
  // 값은 배열로 리턴되나 사실상 1개임
  let url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&fields=items(snippet(channelId,title))&part=snippet`;
  console.log("getChannelId", url);
  let res;
  try {
    res = await axios.get(url);
  } catch (err) {
    console.error(
      `${err.response.data.error.code} : ${err.response.data.error.message}`
    );
    return [];
  }

  let results = [];
  results.push(...res.data.items);

  return results;
}

/**
 * CHANNEL ID 를 가지고 해당 채널 내 재생목록(playlist) 정보를 조회한다
 * UC0QKPVkRkvgupomhEYK1Uhw
 * @param {string} channelId 채널 아이디
 * @param {string} pageToken 조회용 토큰 아이디
 * @param {array} results 누적 결과
 * @return {string} 채널 내 존재하는 재생목록(playlist)
 */
async function getPlaylists(channelId, pageToken = "", results = []) {
  let url = `https://www.googleapis.com/youtube/v3/playlists?channelId=${channelId}&key=${YOUTUBE_API_KEY}&pageToken=${pageToken}&part=snippet&maxResults=50&fields=nextPageToken,pageInfo,items(id,snippet(title))`;
  console.log("getPlaylists", url);
  let res;
  try {
    res = await axios.get(url);
  } catch (err) {
    console.error(
      `${err.response.data.error.code} : ${err.response.data.error.message}`
    );
    return [];
  }

  results.push(...res.data.items);
  if (res.data.nextPageToken) {
    return await getPlaylists(channelId, res.data.nextPageToken, results);
  }
  results.sort((a, b) => a.snippet.title.localeCompare(b.snippet.title));
  return results;
}

/**
 * 재생 목록 내 존재하는 재생 정보를 조회한다
 * PLX0uqwxLwywM2Awk_6jXptUINJYyRhdm8
 * @param {string} playlistId 재생 목록 아이디
 * @param {string} [pageToken=""] 다음 조회를 위한 페이지 토큰
 * @return {string}  재생목록 내 존재하는 재생항목 정보
 */
async function getPlayListItems(playlistId, pageToken = "", results = []) {
  // PLgXGHBqgT2TvpJ_p9L_yZKPifgdBOzdVH
  // nextPageToken 값이 존재하면 pageToken 에 값을 설정 후 재 검색
  // 결과는 최신(publishedAt) 으로 정렬되어 listing 됨

  let url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&pageToken=${pageToken}&key=${YOUTUBE_API_KEY}&part=snippet&maxResults=50&fields=nextPageToken,pageInfo,items(snippet(title,publishedAt,resourceId(videoId)))`;
  console.log("getPlayListItems", url);
  let res;
  try {
    res = await axios.get(url);
  } catch (err) {
    console.error(
      `${err.response.data.error.code} : ${err.response.data.error.message}`
    );
    return [];
  }

  results.push(...res.data.items);
  if (res.data.nextPageToken) {
    return await getPlayListItems(playlistId, res.data.nextPageToken, results);
  }
  if (results.length > 0) {
    console.log(results[0]);
    results.sort((a, b) =>
      b.snippet.publishedAt.localeCompare(a.snippet.publishedAt)
    );
  }

  return results;
}

module.exports = {
  getChannelId,
  getPlaylists,
  getPlayListItems,
};
