<?php

ini_set("display_errors", 1);
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

$hosts = json_decode(file_get_contents("hosts.json"), true);

$ip = gethostbyname($_GET["host"]);

$match = null;
foreach($hosts as $route){
		list($maskAddr, $prefix) = explode("/", $route["prefix"]);
		$prefix = intval($prefix);
		// echo $maskAddr . " / " . $prefix . "\n";
		if(ip2long($ip) >> (32-$prefix) == ip2long($maskAddr) >> (32-$prefix)) {
				if ($match !== null || $match["mask"] < $prefix) {
						$match = $route;
						$match["mask"] = $prefix;
				}
		}
}

echo json_encode([
		"isSakura" => $match != NULL && $match["type"] === "sakura",
		"asn" => $match["as"],
]);
