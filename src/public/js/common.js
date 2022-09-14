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

// save position
let _savedTop = 0;

function postHide(event) {
  if (event.target.dataset.bg != "Y") {
    return;
  }
  // show contents
  el = document.getElementById("modal");
  document.body.style.overflow = "";
  document.body.style.height = "";

  // reset previous position
  window.scrollTo(0, _savedTop);

  /// hide modal
  el.style.opacity = 1;
  (function fade() {
    if ((el.style.opacity -= 0.1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}
function postShow(post_id) {
  let el = document.getElementById("modal");

  // save scroll position
  let _doc = document.documentElement;
  let _left = (window.pageXOffset || _doc.scrollLeft) - (_doc.clientLeft || 0);
  let _top = (window.pageYOffset || _doc.scrollTop) - (_doc.clientTop || 0);
  _savedTop = _top;

  // get detail
  // console.log(`${location.pathname}/detail?post_id=${post_id}`);
  // let pathname = location.pathname;
  let pathname = "/st/st0001";
  fetch(`${pathname}/detail?post_id=${post_id}`)
    .then((res) => res.json())
    .then((data) => {
      let d = data.rows[0];
      document.getElementById("modal_title").innerHTML = `<h1>${
        d.title
      }</h1><br/><img src="https://steemitimages.com/u/${
        d.author
      }/avatar" class="author"/> ${d.author} (${parseInt(
        d.author_rep
      )}) votes : ${d.total_votes} replies : ${
        d.children
      } <a href='https://steemit.com/${d.category}/@${d.author}/${
        d.permlink
      }' target='_blank'>view in seeemit</a>`;
      document.getElementById("modal_content").innerHTML = data.markdown;
    });

  // hide contents
  document.body.style.overflow = "hidden";
  document.body.style.height = "100%";

  // show modal
  document.getElementById("modal_title").innerHTML = "Contents";
  document.getElementById("modal_content").innerHTML = "Loading ...";
  el.style.opacity = 1;
  el.style.display = "flex";
  savedTop = window.scrollTo(0, 0);
  // (function fade() {
  //   let val = parseFloat(el.style.opacity);
  //   if (!((val += 0.2) > 1)) {
  //     el.style.opacity = val;
  //     requestAnimationFrame(fade);
  //   } else {
  //     savedTop = window.scrollTo(0, 0);
  //   }
  // })();
}

// window.onload = function () {
//   console.log(document.body);
//   window.addEventListener("scroll", function (e) {
//     var doc = document.documentElement;
//     var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
//     var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

//     console.log(top, left);
//   });
// };
