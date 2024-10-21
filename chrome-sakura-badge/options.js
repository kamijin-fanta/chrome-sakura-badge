//// clear cache
async function cacheClear() {
    var len = Object.keys(await chrome.storage.local.get(null)).length;
    await chrome.storage.local.clear()
    alert(`${len}件のキャッシュを削除しました`);
}
document.getElementById('cacheClear').addEventListener('click', cacheClear);


//// show log
(async () => {
    var table = document.getElementById("cached");
    const allItems = await chrome.storage.local.get(null);
    for (var name in allItems) {
        var nameTd = document.createElement("td");
        nameTd.textContent = name;

        var asTd = document.createElement("td");
        var asn = JSON.parse(allItems[name]).asn;
        asTd.textContent = asn ? asn : "×";

        var tr = document.createElement("tr");
        tr.appendChild(nameTd);
        tr.appendChild(asTd);

        table.appendChild(tr);
    }
})();


//// option
const CONFIG_KEY = "emjemnfjellkddpigaggachjkfokfaal";
async function getShowName() {
    const config = await chrome.storage.sync.get([CONFIG_KEY]);
    const confObj = config[CONFIG_KEY] ? JSON.parse(config[CONFIG_KEY]) : undefined;
    return confObj?.opt_show_name ?? true;
}
async function setShowName(flag) {
    await chrome.storage.sync.set({
        [CONFIG_KEY]: JSON.stringify({ opt_show_name: flag }),
    });
}
async function changeNameShow() {
    await setShowName(!await getShowName());
    await renderButton();
}

const changeNameShowButton = document.getElementById('changeNameShow');
async function renderButton() {
    changeNameShowButton.innerText = await getShowName() ? "名前を表示" : "AS番号を表示";
}

(function () {
    renderButton();
    changeNameShowButton.addEventListener('click', changeNameShow);
})();
