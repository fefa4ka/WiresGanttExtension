var token = '';

chrome.extension.sendMessage({}, function(response) {
    // // jQuery init
    // var jq = document.createElement('script');
    // jq.onload = function(){};
    // jq.src = "https://code.jquery.com/jquery-2.1.1.min.js";
    // document.querySelector('head').appendChild(jq);

    var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        renderGanttNavigation();
    }
    }, 10);

    function titleModified() {
        setTimeout(renderGanttNavigation, 0);
    }

    window.onload = function() {
        chrome.storage.sync.get('token', function(keys) {
            token = keys.token;
        });
        var titleEl = document.getElementsByTagName("title")[0];
        var docEl = document.documentElement;

        if (docEl && docEl.addEventListener) {
            docEl.addEventListener("DOMSubtreeModified", function(evt) {
                var t = evt.target;
                if (t === titleEl || (t.parentNode && t.parentNode === titleEl)) {
                    titleModified();
                }
            }, false);
        } else {
            document.onpropertychange = function() {
                if (window.event.propertyName == "title") {
                    titleModified();
                }
            };
        }


    };

});



function renderGanttNavigation() {
     // Add Gantt Link
    var $project = $('.reponav-item[data-selected-links~="repo_project"]'),
        $gantt = $('<a><svg aria-hidden="true" class="octicon octicon-project" height="16" version="1.1" viewBox="0 0 15 16" width="15"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z"></path></svg> Gantt</a>').addClass('reponav-item reponav-gantt');
        $content = $('.repository-content');

    $gantt.click(function () {
        var api = new RestClient('https://api.github.com'),
            location = document.location.href.split('/'),
            user = location[3],
            repo = location[4],
            path = user + '/' + repo,
            issues_path = path + '/issues';

        $('.reponav-item').removeClass('selected');
        $(this).addClass('selected');
        $content.empty()
        .append($('<div class="subnav" data-pjax="">\
          <a href="/' + path + '/issues/new" class="btn btn-primary float-right" role="button" data-hotkey="c">\
            New issue\
          </a>\
          <div class="float-left subnav-spacer-right" role="search">\
              <div class="float-left select-menu js-menu-container js-select-menu subnav-search-context">\
                <button class="btn select-menu-button js-menu-target" type="button" aria-haspopup="true" aria-expanded="false">\
                  Filters\
                </button>\
                <div class="select-menu-modal-holder js-menu-content js-navigation-container">\
                  <div class="select-menu-modal">\
                    <div class="select-menu-list">\
                        <a href="/' + path + '/issues?q=is%3Aopen" class="select-menu-item js-navigation-item">\
                          <div class="select-menu-item-text">\
                            Open issues and pull requests\
                          </div>\
                        </a>\
                        <a href="/' + path + '/issues?q=is%3Aopen+is%3Aissue+author%3Afefa4ka" class="select-menu-item js-navigation-item">\
                          <div class="select-menu-item-text">\
                            Your issues\
                          </div>\
                        </a>\
                      <a href="/' + path + '/issues?q=is%3Aopen+is%3Apr+author%3Afefa4ka" class="select-menu-item js-navigation-item">\
                        <div class="select-menu-item-text">\
                          Your pull requests\
                        </div>\
                      </a>\
                      <a href="/' + path + '/issues?q=is%3Aopen+assignee%3Afefa4ka" class="select-menu-item js-navigation-item">\
                        <div class="select-menu-item-text">\
                          Everything assigned to you\
                        </div>\
                      </a>\
                      <a href="/' + path + '/issues?q=is%3Aopen+mentions%3Afefa4ka" class="select-menu-item js-navigation-item">\
                        <div class="select-menu-item-text">\
                          Everything mentioning you\
                        </div>\
                      </a>\
                      <a href="https://help.github.com/articles/searching-issues" class="select-menu-item js-navigation-item" target="_blank">\
                        <svg aria-hidden="true" class="octicon octicon-link-external select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg>\
                        <div class="select-menu-item-text">\
                          <strong>View advanced search syntax</strong>\
                        </div>\
                      </a>\
                    </div>\
                  </div>\
                </div>\
              </div>\
            <form accept-charset="UTF-8" action="/' + path + '/issues" class="subnav-search float-left" data-pjax="true" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="✓"></div>\
              <input aria-label="Search all issues" class="form-control form-control subnav-search-input input-contrast" data-hotkey="/" id="js-issues-search" name="q" placeholder="Search all issues" type="text" value="is:issue is:open ">\
              <svg aria-hidden="true" class="octicon octicon-search subnav-search-icon" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0 0 13 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 0 0 0-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>\
        </form>  </div>\
        <div class="subnav-links float-left" role="navigation">\
          <a href="/' + path + '/labels" class="js-selected-navigation-item subnav-item" data-selected-links="repo_labels /' + path + '/labels">Labels</a>\
          <a href="/' + path + '/milestones" class="js-selected-navigation-item subnav-item" data-selected-links="repo_milestones /' + path + '/milestones">Milestones</a>\
        </div>\
        </div>'));
        $content.append('<div class="gantt-container"><svg id="gantt"/></div>');

        api.on('request', function(xhr) {
            xhr.setRequestHeader('Authorization', 'token ' + token);
        });


        api.res({ repos: 'releases' });
        api.repos(issues_path).get().then(function(issues){
            var tasks = [];

            for(var index in issues) {
                var issue = issues[index];
                tasks.push({
                    id: issue.number,
                    name: issue.title,
                    start: issue.created_at,
                    end: issue.updated_at,
                    progress: 0,
                    dependencies: []
                });
                // $content.append($('<p/>').text(issue.title + ' — ' + issue.created_at));
            }
            console.log(tasks);

            var gantt = new Gantt("#gantt", tasks);
            // $content.append($('<p/>').text('Latest release of another-rest-client:<br>'));
            // $content.append($('<p/>').text('Published at: ' + release.published_at + '<br>'));
            // $content.append($('<p/>').text('Tag: ' + release.tag_name + '<br>'));
        });
    });
    $project.after($gantt);
}