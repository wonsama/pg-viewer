// common.js
console.log("common.js loaded");

const elFormPageSearchBar = document.querySelector("#formPageSearchBar");
elFormPageSearchBar.onsubmit = (e) => {
  // e.preventDefault();

  // 전송 값 trim 처리
  let items = document.getElementsByClassName("search-bar-item");
  for (let item of items) {
    item.value = item.value ? item.value.trim() : "";
  }

  // page offset
  let elOffset = document.getElementById("offset");
  elOffset.value = 0;
  elFormPageSearchBar.submit();
};

function _pageMove(direction) {
  let elOffset = document.getElementById("offset");
  let elLimit = document.getElementById("limit");
  let elRowslength = document.getElementById("rowslength");
  let offset = parseInt(elOffset.value);
  let limit = parseInt(elLimit.value);
  let rowslength = parseInt(elRowslength.value);

  if (offset == 0 && direction == -1) {
    // 1페이지에서는 뒤로가기 무효화
    return;
  }

  if (rowslength < limit && direction == 1) {
    // 마지막 페이지에서는 뒤로가기 무효화
    return;
  }

  elOffset.value = offset + limit * direction;
  elFormPageSearchBar.submit();
}

function pageNext() {
  _pageMove(1);
}

function pagePrevious() {
  _pageMove(-1);
}
