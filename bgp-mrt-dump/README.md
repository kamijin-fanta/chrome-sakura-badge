# IPリスト更新用コード

MRTファイルはこのあたりから取得する

- http://www.routeviews.org/routeviews/
- http://archive.routeviews.org/route-views.wide/bgpdata/

```shell
wget http://archive.routeviews.org/route-views.wide/bgpdata/2020.11/RIBS/rib.rib.20201112.0600.bz2
bunzip2 rib.20201112.0600.bz2

# プレフィックスの取得
go run ./cmd/mrt-dump/. data/rib.20201112.0600 > prefixes

# JSON出力
go run ./cmd/extract-sakura/. prefixes > ../sakura-checker/hosts.json
```


