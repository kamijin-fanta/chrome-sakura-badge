var cacheExpire = 12 * 60 * 60 * 1000;  //12 hour 

function render(s, tabId){
    var icon = s.isSakura ? "icon-enable" : "icon-disable";
    chrome.browserAction.setBadgeText({
        text: "" + (s.asn?s.asn:""),
        tabId: tabId
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: "#e46d81"
    });
    chrome.browserAction.setIcon({
        path: `image/${icon}.png`,
        tabId: tabId
    });
}
function update(tabId){
    chrome.tabs.get(tabId, function(s){
        var host = s.url.split("/")[2];
        var secure = window.location.protocol == "https:";
        var cache = localStorage.getItem(host);

        // if has old cache, delete cache
        if(cache && (
            !cache.date
            || new Date(cache.date).valueOf() + cacheExpire < new Date().valueOf()
        )) {
            cache = undefined;
        }

        if(cache){
            render(JSON.parse(cache), tabId);
        } else {
            var url = "http://kamijin.sakura.ne.jp/host.php?host=";
            if (secure)
                url = "https://kamijin.sakura.ne.jp/host.php?host=";
            fetch(url + host)
                .then(s=>s.json())
                .then(s=>{
                    s.date = new Date().valueOf();  // add date fieald
                    localStorage.setItem(host, JSON.stringify(s));
                    render(s, tabId);
                });
        }
    });
}

chrome.runtime.onMessage.addListener(function(res, sender){
    var tab = sender.tab.id;
    update(tab);
});

chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) {
    chrome.tabs.sendMessage(addedTabId, {});
});


chrome.tabs.onActivated.addListener(function (tab) {
    console.log("select change", tab);
    update(tab.tabId);
});
