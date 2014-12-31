<?php
	$towerName = array("canonT", "archerT", "mortarT","airT","wizardT","teslaT","xbowT","infernoT","campT","elixpumpT","elixstorT","goldpumpT","goldstorT","barrackT","laboratoryT","castT","spellT","darkpumpT","darkstorT","darkbarrackT");
	$towerID = array("1000008", "1000009", "1000013","1000012","1000011","1000019","1000021","1000027","1000000","1000002","1000003","1000004","1000005","1000006","1000007","1000014","1000020","1000023","1000024","1000026");
	$towerMaxLVL = array(12,13,8,8,8,8,4,3,8,11,11,12,11,10,8,6,5,6,6,6);
	$towerIMG = array(158,159,160,161,162,163,164,165,180,176,175,173,174,181,183,188,184,177,178,182);  // assets\builder\objects w/o levels
	$towerSize = array(3,3,3,3,3,2,3,2,5,3,3,3,3,3,4,3,3,3,3,3,3); // 3x3
	function _getInfo($id) {
		$ret = array("0","0");
		global $towerID,$towerIMG,$towerSize;
		if($id == "1000010"){
			$ret[0] = "166";
			$ret[1] = "1";
		}
		if($id == "1000001"){
			$ret[0] = "187";
			$ret[1] = "4";
		}
		for($i = 0; $i < count($towerID);$i++){
			if($towerID[$i] == $id){
				$ret[0] = $towerIMG[$i];
				$ret[1] = $towerSize[$i];
			}
		}
		return $ret;
	}
	function js_str($s)
	{
		return '"' . addcslashes($s, "\0..\37\"\\") . '"';
	}
	
	function js_int($s)
	{
		return addcslashes($s, "\0..\37\"\\");
	}

	function js_array($array)
	{
		$temp = array_map('js_str', $array);
		return '[' . implode(',', $temp) . ']';
	}
	
	function js_intarray($array)
	{
		$temp = array_map('js_int', $array);
		return '[' . implode(',', $temp) . ']';
	}
?>