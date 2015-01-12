<?php
error_reporting(0);

if(isset($_POST['objCoor']) && isset($_POST['wallCoor'])){
	$wall = $_POST['wallCoor'];
	$obj = $_POST['objCoor'];

	$json_a = json_decode($wall, true);
	$wdata = "{\"buildings\":[";
	$objecCount = 0;
	//Wall
	for($i = 0 ; $i < 41 ; $i++){
		for($x = 0 ; $x < 41 ; $x++){
			if($json_a["g-".$i."-".$x.""] >0){
				$wdata = $wdata . ($objecCount == 0 ? "" : ",") . "{\"data\":1000010,\"lvl\":".($json_a["g-".$i."-".$x.""]-1).",\"x\":".($i+3).",\"y\":".((40-$x)+2)."}";
				$objecCount++;
			}
		}
	}
	//Building
	$building = explode(",", $obj);
	$building = str_replace("{","",$building);$building = str_replace("}","",$building);$building = str_replace("\"","",$building);
	if($obj != "{}"){
		foreach($building as $objs){
			$objs = explode(":",$objs);
			$objType = $objs[0];
			$objType = explode("-",$objType);
			$objPos = str_replace("g-","",$objs[1]);
			$objPos = explode("-",$objPos);
			$wdata = $wdata . ($objecCount == 0 ? "" : ",") . '{"data":' . $objType[0] . ',"lvl":'.($objType[1]-1).',"x":' . ($objPos[0]+3) . ',"y":' . (((41-$objType[2])-$objPos[1])+2) . ($objType[0] == "1000027" ? ",\"ammo\":750" : "") . ($objType[0] == "1000021" ? ",\"ammo\":1500" : ""). "}";
			$objecCount++;
		}
	}
	$wdata = $wdata ."],\"traps\":[],\"decos\":[]}";
	$file = 'output/'.generateRandomString(15).'.txt';
	$current = file_get_contents($file);
	$current = $wdata;
	file_put_contents($file, $current);
	echo $file;
}
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
?>