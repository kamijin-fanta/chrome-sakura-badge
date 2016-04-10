var loadTimes = window.chrome.loadTimes();

chrome.runtime.sendMessage({
    location: window.location
});
