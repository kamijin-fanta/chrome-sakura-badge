function cacheClear(){
    var len = localStorage.length;
    localStorage.clear();
    alert(`${len}件のキャッシュを削除しました`);
}
document.getElementById('cacheClear').addEventListener('click', cacheClear);

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
