var cacheExpire = 12 * 60 * 60 * 1000;  //12 hour 

function render(s, tabId){
    var icon = s.isSakura ? "icon-enable" : "icon-disable";
    chrome.browserAction.setBadgeText({
        text: getAsnName(s.asn),
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
        var cache = JSON.parse(localStorage.getItem(host));

        // if has old cache, delete cache
        if(cache && (
            !cache.date
            || new Date(cache.date).valueOf() + cacheExpire < new Date().valueOf()
        )) {
            cache = undefined;
        }

        if(cache){
            render(cache, tabId);
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
function getAsnName(asn) {
    var showName = true;
    var myStorage = JSON.parse(localStorage.getItem("emjemnfjellkddpigaggachjkfokfaal"));
    if(myStorage && myStorage.opt_show_name == false)
        showName = false;

    switch(asn) {
        case 9370:
            return showName?"東京":"9370";
        case 9371:
            return showName?"大阪":"9371";
        case 7684:
            return showName?"石狩":"7684";
        default:
            return "";
    }
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
