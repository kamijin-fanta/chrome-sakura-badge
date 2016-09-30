//// clear cache
function cacheClear(){
    var len = localStorage.length;
    localStorage.clear();
    alert(`${len}件のキャッシュを削除しました`);
}
document.getElementById('cacheClear').addEventListener('click', cacheClear);


//// show log
(function() {
    var table = document.getElementById("cached");
    for(var name in localStorage) {
        var nameTd = document.createElement("td");
        nameTd.textContent = name;

        var asTd = document.createElement("td");
        var asn = JSON.parse(localStorage.getItem(name)).asn;
        asTd.textContent = asn?asn:"×";

        var tr = document.createElement("tr");
        tr.appendChild(nameTd);
        tr.appendChild(asTd);

        table.appendChild(tr);
    }
})();


//// option
var extId = "emjemnfjellkddpigaggachjkfokfaal";
var changeNameShowButton = document.getElementById('changeNameShow');
function getShowName() {
    var myStorage = JSON.parse(localStorage.getItem(extId));
    return myStorage?myStorage.opt_show_name:true;
}
function setShowName(flag) {
    var myStorage = JSON.parse(localStorage.getItem(extId));
    if (!myStorage)
        myStorage =  {"isSakura":false,"asn":null};
    myStorage.opt_show_name = flag;
    localStorage.setItem(extId, JSON.stringify(myStorage));
}
function changeNameShow() {
    setShowName(!getShowName());
    buttonRend();
}
function buttonRend() {
    changeNameShowButton.innerText = getShowName()?"名前を表示":"AS番号を表示";
}

(function() {
    buttonRend();
    changeNameShowButton.addEventListener('click', changeNameShow);
})();
