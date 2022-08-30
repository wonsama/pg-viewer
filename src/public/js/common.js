// common.js
console.log("common.js loaded");

const elFormPageSearchBar = document.querySelector("#formPageSearchBar");
elFormPageSearchBar.onsubmit = (e) => {
  let elOffset = document.getElementById("offset");

  e.preventDefault();

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
