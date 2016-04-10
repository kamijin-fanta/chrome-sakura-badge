function cacheClear(){
    var len = localStorage.length;
    localStorage.clear();
    alert(`${len}件のキャッシュを削除しました`);
}
document.getElementById('cacheClear').addEventListener('click', cacheClear);
