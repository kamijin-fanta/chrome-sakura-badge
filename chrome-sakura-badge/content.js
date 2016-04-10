var loadTimes = window.chrome.loadTimes();

chrome.runtime.sendMessage({
    location: window.location
});

chrome.tabs.onActivated.addListener(function (tabId) {
    console.log("select change");
    chrome.runtime.sendMessage({
        location: window.location
    });
});
