var cacheExpire = 12 * 60 * 60 * 1000;  //12 hour 

async function render(s, tabId) {
    var icon = s.isSakura ? "icon-enable" : "icon-disable";
    chrome.action.setBadgeText({
        text: await getAsnName(s.asn),
        tabId: tabId
    });
    chrome.action.setBadgeBackgroundColor({
        color: "#e46d81"
    });
    chrome.action.setIcon({
        path: `image/${icon}.png`,
        tabId: tabId
    });
}
async function update(tabId) {
    const tab = await chrome.tabs.get(tabId);
    var host = tab.url.split("/")[2];
    if (!host) {
        return;
    }

    const result = await chrome.storage.local.get([host]);
    var cache = result[host] ? JSON.parse(result[host]) : undefined;

    // if has old cache, delete cache
    if (cache && (
        !cache.date
        || new Date(cache.date).valueOf() + cacheExpire < new Date().valueOf()
    )) {
        cache = undefined;
    }

    if (cache) {
        await render(cache, tabId);
    } else {
        var url = "https://kamijin.sakura.ne.jp/host.php?host=";
        const res = await (await fetch(url + host)).json();
        res.date = new Date().valueOf();  // add date field

        await chrome.storage.local.set({
            [host]: JSON.stringify(res),
        });
        await render(res, tabId);
    }
}
async function getAsnName(asn) {
    const CONFIG_KEY = "emjemnfjellkddpigaggachjkfokfaal";
    const config = await chrome.storage.sync.get([CONFIG_KEY]);
    const confObj = config[CONFIG_KEY] ? JSON.parse(config[CONFIG_KEY]) : undefined;
    const showName = confObj?.opt_show_name ?? true;

    switch (asn) {
        case 9370:
            return showName ? "東京" : "9370";
        case 9371:
            return showName ? "大阪" : "9371";
        case 7684:
            return showName ? "石狩" : "7684";
        default:
            return "";
    }
}

chrome.runtime.onMessage.addListener(function (res, sender) {
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
