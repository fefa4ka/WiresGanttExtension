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
            path = user + '/' + repo + '/issues';


        $('.reponav-item').removeClass('selected');
        $(this).addClass('selected');
        $content.html('<h1>Gantt Diagram</h1>');

        api.on('request', function(xhr) {
            xhr.setRequestHeader('Authorization', 'token ' + token);
        });


        api.res({ repos: 'releases' });
        api.repos(path).get().then(function(issues){

            for(var index in issues) {
                var issue = issues[index];
                $content.append($('<p/>').text(issue.title + ' — ' + issue.created_at));
            }
            // $content.append($('<p/>').text('Latest release of another-rest-client:<br>'));
            // $content.append($('<p/>').text('Published at: ' + release.published_at + '<br>'));
            // $content.append($('<p/>').text('Tag: ' + release.tag_name + '<br>'));
        });
    });
    $project.after($gantt);
}