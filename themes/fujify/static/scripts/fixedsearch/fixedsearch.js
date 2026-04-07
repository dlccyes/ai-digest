// static/scripts/fixedsearch/fixedsearch.js
/*--------------------------------------------------------------
based on Arty2/fixedsearch.js
source https://gist.github.com/Arty2/8b0c43581013753438a3d35c15091a9f
--------------------------------------------------------------*/

if (typeof variable !== 'undefined') {
  console.log('fixedsearch.js already loaded');
} else {
  fixedsearch = function () {
    var search_form = document.getElementById('search-form'); // search form
    var search_bar = document.getElementById('search-bar'); // search bar;
    var search_input = document.getElementById('search-input'); // input box for search
    var search_submit = document.getElementById('search-submit'); // form submit button
    var search_results = document.getElementById('search-results'); // targets the <ul>
    var search__focus = false; // check to true to make visible by default
    var results_available = false; // did we get any search results?
    var first_run = true; // allow us to delay loading json data unless search activated



    search_form.classList.remove('noscript'); // JavaScript is active
    search_form.setAttribute('data-focus', search__focus);

    var search_placeholder = ""; // show the shortcut hint
    if (window.innerWidth >= 900) {
      search_placeholder = "⌕ ctrl+k";
    }
    search_input.placeholder = search_placeholder;

    /*--------------------------------------------------------------
    The main keyboard event listener running the show
    --------------------------------------------------------------*/
    document.addEventListener('keydown', function (e) {
      // console.log(e); // DEBUG
      // if (e.metaKey && e.which === "/") {
      // if (e.ctrlKey && e.which === "/") {
      if (e.ctrlKey && e.key === "k") {
        search_toggle(e); // toggle visibility of search box
      }
      // Allow ESC (27) to close search box
      if (e.key == "Escape") {
        search_off();
      }
    });

    /*--------------------------------------------------------------
    Load our json data and builds fuse.js search index
    --------------------------------------------------------------*/
    search_form.addEventListener('focusin', function (e) {
      search_init(); // try to load the search index
    });

    /*--------------------------------------------------------------
    Make submit button toggle focus
    --------------------------------------------------------------*/
    search_form.addEventListener('submit', function (e) {
      search_toggle(e);
      e.preventDefault();
      return false;
    });

    /*--------------------------------------------------------------
    Clicking the search box makes search dom visible
    --------------------------------------------------------------*/
    search_bar.addEventListener('click', function (e) {
      search_on();
    });

    /*--------------------------------------------------------------
    Remove focus on clicking outside of search dom
    --------------------------------------------------------------*/
    document.addEventListener('click', function (e) {
      if (!e.composedPath().includes(search_form)) {
        search_off();
      }
    });

    /*--------------------------------------------------------------
    Toggle focus UI of form
    --------------------------------------------------------------*/
    function search_toggle(e) {
      // console.log(e); // DEBUG
      // order of operations is very important to keep focus where it should stay
      if (!search__focus) {
        search_on();
      }
      else {
        search_off();
      }
    }

    function search_on() {
      if (search__focus) return;
      search_submit.value = 'x';
      search_input.placeholder = '';
      search_form.setAttribute('data-focus', true);
      search_input.focus(); // move focus to search box
      search__focus = true;
    }

    function search_off() {
      if (!search__focus) return;
      search_submit.value = '';
      search_input.placeholder = search_placeholder;
      search_form.setAttribute('data-focus', false);
      search__focus = false;
    }

    /*--------------------------------------------------------------
    Fetch some json without jquery
    --------------------------------------------------------------*/
    function fetch_JSON(path, callback) {
      var httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            var data = JSON.parse(httpRequest.responseText);
            if (callback) callback(data);
          }
        }
      };
      httpRequest.open('GET', path);
      httpRequest.send();
    }

    /*--------------------------------------------------------------
    Load script
    based on https://stackoverflow.com/a/55451823
    --------------------------------------------------------------*/
    function load_script(url) {
      return new Promise(function (resolve, reject) {
        let script = document.createElement("script");
        script.onerror = reject;
        script.onload = resolve;
        if (document.currentScript) {
          document.currentScript.parentNode.insertBefore(script, document.currentScript);
        }
        else {
          document.head.appendChild(script)
        }
        script.src = url;
      });
    }

    /*--------------------------------------------------------------
    Load our search index, only executed once
    on first call of search box
    --------------------------------------------------------------*/
    function search_init() {
      // const fuseJsPath = "/scripts/fixedsearch/fuse.js";
      // const fuzzySortJsPath = "/scripts/fixedsearch/fuzzysort.js";
      lunrJsPath = "/scripts/fixedsearch/lunr.js";
      indexJsonPath = "/index.json";
      resultNum = 5;
      resultFormatEnum = {
        POST: "post",
        MATCHES: "matches"
      }
      resultFormat = resultFormatEnum.MATCHES;

      matchLen = 100; // show {matchLen} characters before and after the match
      if (first_run) {
        load_script(window.location.origin + lunrJsPath).then(() => {
          search_input.value = ""; // reset default value
          first_run = false; // let's never do this again
          titleKeyInd = 0;
          contentKeyInd = 1;
          matchThreshold = 0.28;
          fetch_JSON(search_form.getAttribute('data-language-prefix') + indexJsonPath, function (data) {
            allData = data;
            searchKeys = [
              'title',
              'content',
              'permalink',
              'date',
              // 'summary',
              'section',
              'tags'
            ]

            lunrIdx = lunr(function () {
              // include matched location
              this.metadataWhitelist = ['position']

              // add all searchKeys as field
              for (let key of searchKeys) {
                this.field(key);
              }

              // add all data to lunr, including an id for each item indicating its index in the original data array
              for (let i = 0; i < data.length; i++) {
                this.add({
                  id: i,
                  ...data[i]
                });
              }
            })

            // }


            search_input.addEventListener('keyup', function (e) { // execute search as each character is typed
              // if not escape
              if (e.key == "Escape") return;
              search_on();
              search_exec(this.value);
            });
            // console.log("index.json loaded"); // DEBUG
          });
        }).catch((error) => { console.log('fixedsearch failed to load: ' + error); });
      }
    }

    /*--------------------------------------------------------------
    Using the index we loaded, run
    a search query (for "term") every time a letter is typed
    in the search box
    --------------------------------------------------------------*/
    function search_exec(term) {
      let results = lunrIdx.search(term);
      let searchHtml = ''; // our results bucket

      if (isEmpty(term) || results.length === 0) { // no input or no results
        results_available = false;
        searchHtml = '';
      } else { // build our html
        matchCnt = 0;
        for (let i in results.slice(0, resultNum)) { // only show first 5 results
          let result = results[i];
          if (result.score < matchThreshold) {
            continue;
          }
          let resultObj = allData[result["ref"]];

          if (isEmpty(resultObj.title)) {
            continue;
          }

          let sectionHtml = "";
          if (!isEmpty(resultObj.section)) {
            sectionHtml = `<span class="section">/${resultObj.section}</span>`;
          }

          titleHtml =
            `<a href="${resultObj.permalink}" tabindex="0">
              <span class="title">${resultObj.title}</span>
            </a>`;

          let dateHtml = "";
          if (!isEmpty(resultObj.date)) {
            dateHtml = `<span class="date"> <i class="iconfont icon-today-sharp"></i> ${resultObj.date}</span>`;
          }

          let tagsHtml = "";
          if (!isEmpty(resultObj.tags)) {
            tagsHtml = `<span class="tags"><i class="iconfont icon-pricetags-sharp"></i> #${resultObj.tags.join(' #')}</span>`;
          }

          let metaDataHtml = `<p>${dateHtml} ${tagsHtml}</p>`;

          let resultCommonHtml =
            `${sectionHtml}
            ${titleHtml}
            ${metaDataHtml}`;

          if (resultFormat === resultFormatEnum.POST) {
            searchHtml += getPostHtml(resultCommonHtml, resultObj.summary);
          } else if (resultFormat === resultFormatEnum.MATCHES) {  // show all matches
            termObj = getLunrResTermObj(result);
            if (Object.keys(termObj).length > 1) {
              searchHtml += getPostHtml(resultCommonHtml, resultObj.summary);
              continue;
            }
            let matchHtml = getMatchHtml(resultObj.content, termObj);
            searchHtml +=
              `<li>
                ${resultCommonHtml}
                ${matchHtml}
              </li>`;
          } else {
            console.error("Invalid resultFormat: " + resultFormat);
          }
        }
        // show number of posts and matches
        let searchCntHtml = `<p class="num-results"> Found ${results.length} posts`
        if (results.length > resultNum) {
          searchCntHtml += `, showing ${resultNum} posts`
        }
        if (matchCnt > 0 && matchCnt != resultNum) {
          searchCntHtml += ` and ${matchCnt} matches`
        }
        searchCntHtml += `.</p>`
        searchHtml = searchCntHtml + searchHtml;
        // show lunr credit
        searchHtml += `<hr><p class="lunr-credit">Powered by <a href="https://lunrjs.com/">Lunr.js</a></p>`

        results_available = true;
      }

      search_results.innerHTML = searchHtml;
    }
  }();
}

function getPostHtml(commonHtml, summary) {
  matchCnt += 1;
  let summaryHtml = `<span class="summary">${summary}</span>`;
  let postHtml =
    `<li>
      ${commonHtml}
      ${summaryHtml}
    </li>`;
  return postHtml;
}

function getMatchHtml(content, termObj) {
  let matchHtml = "";
  matchCnt += termObj.content.position.length;
  for (let matchIdxs of termObj.content.position) {
    let matchStartInd = matchIdxs[0];
    let matchEndInd = matchStartInd + matchIdxs[1] - 1;
    let highlightedContent = content.substring(0, matchStartInd) +
      `<span class="highlight">` + content.substring(matchStartInd, matchEndInd + 1) + `</span>` +
      content.substring(matchEndInd + 1);
    let croppedContent = getCroppedContent(highlightedContent, matchStartInd, matchEndInd);
    matchHtml += `\n<p>---</p><p class="match">${croppedContent}</p>`;
  }
  return matchHtml;
}

function getCroppedContent(content, matchStartInd, matchEndInd) {
  let croppedContent = content.substring(matchStartInd - matchLen, matchEndInd + matchLen);
  // make sure the cropped content starts with a capital letter and ends with a space s.t. no word is cut off
  let firstCapSearch = croppedContent.match(/[A-Z]/);
  let leftInd = firstCapSearch ? firstCapSearch.index : 0;
  let lastSpaceInd = croppedContent.lastIndexOf(" ");
  let rightInd = lastSpaceInd === -1 ? croppedContent.length : lastSpaceInd + 1;
  croppedContent = croppedContent.substring(leftInd, rightInd)
  return croppedContent;
}

function getLunrResTermObj(lunrRes) {
  return lunrRes.matchData.metadata[Object.keys(lunrRes.matchData.metadata)[0]];
}

function isEmpty(str) {
  return (!str || 0 === str.length);
}
