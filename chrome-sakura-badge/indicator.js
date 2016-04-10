
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
        var cache = localStorage.getItem(host);
        if(cache){
            render(JSON.parse(cache), tabId);
        } else {
            fetch("http://kamijin.sakura.ne.jp/host.php?host=" + host)
                .then(s=>s.json())
                .then(s=>{
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
