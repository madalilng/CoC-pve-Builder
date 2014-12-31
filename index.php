<?php 
	include "config.php";
	$lobj = "loadObjectCoordinates('{";
	$lwll = "loadWallCoordinates('{";
	$objs = "";
	$i = 0;
	$w = 0;
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
	   if (!empty($_POST["decrypt"])) {
		$json_a = json_decode($_POST["decrypt"], true);
		foreach($json_a['buildings'] as $v){
			$id = $v['data'];
			$data = _getInfo($id);
			$lvl = $v['lvl']+1;
			$img = $data[0];
			$size = $data[1];
			$x = $v['x']-3;
			$y = 0;
			
			if ($id == "1000010"){
				$y = (40-$v['y'])+2;
			}elseif($id== "1000001"){
				$y = (41-$v['y']-4);
			}else{
				$y = (41-$data[1]-$v['y']);
			}
			
			if($id != "1000010"){
				$objs = $objs. "createObject('".$id."-".$lvl."-".$size."', ".$size.", ".$size.", '".$data[0]."_".($lvl)."', '0', 1);";
				$lobj = $lobj.($i == 0 ? "" : ",").'"'.$id.'-'.$lvl.'-'.$size.'-'.$i.'":"g-'.$x.'-'.($y+2).'"';
				$i++;
			}else{
				$lwll = $lwll.($w == 0 ? "" : ",").'"g-'.$x.'-'.($y).'":1';
				$w++;
			}
		}
		$lobj = $lobj."}');";
		$lwll = $lwll."}');";
		}
   }
?>
<html>
<head>
	<title>Clash of Clans PVE Builder</title>
	<script src="scripts/jquery-and-jquery.tools.min.js"></script>
	<script src="scripts/jquery-ui-1.9.2.custom.min.js"></script>
	<link href="builder.css" rel="stylesheet" type="text/css" />
</head>
<body oncontextmenu="return false;">
<!-- INFOLINKS_ON -->
<div id="wrapper">
<div id="build">

<div class="clear"></div>		
	</div>
	<div id="contentTop">
<input type="hidden" id="baseImage" value="" />
<!-- INFOLINKS_OFF -->
<div id="toolOptions">
	<div id="toggleDelete" class="optionsButton noSelect">Erase Mode</div>
	<div id="togglePerimeter" class="optionsButton noSelect">Toggle Perimeter</div>
	<div id="toggleLevel" class="optionsButton noSelect">Toggle Level</div>
	<div id="saveBase" class="optionsButton noSelect">Export</div>
	<div id="baseLevel">
	<select id="wallLevelSelect">
			<option value="11" selected>Wall level 11</option>
			<option value="10">Wall level 10</option>
			<option value="9" >Wall level 9</option>
			<option value="8" >Wall level 8</option>
			<option value="7" >Wall level 7</option>
			<option value="6" >Wall level 6</option>
			<option value="5" >Wall level 5</option>
			<option value="4" >Wall level 4</option>
			<option value="3" >Wall level 3</option>
			<option value="2" >Wall level 2</option>
			<option value="1" >Wall level 1</option>
	</select>
	</div>
	<br><br>
	<?php for($i = 0 ; $i < count($towerName); $i++){ ?>
		<div id="#" class="buildingButton" ><img id="<?php echo $towerName[$i]; ?>" onclick="createObject('<?php echo $towerID[$i]."-".$towerMaxLVL[$i]."-".$towerSize[$i]; ?>',<?php echo $towerSize[$i].",".$towerSize[$i]; ?>, '<?php echo $towerIMG[$i]."_".$towerMaxLVL[$i]; ?>', '0', 1);" src="assets/builder/objects/<?php echo $towerIMG[$i]."_".$towerMaxLVL[$i]; ?>.png" width="50" height="50"></div>
	<?php } ?>	
	<br><br><br><br>
	</div>
<!-- INFOLINKS_ON -->
<div id="toolWrapper">
	<div class="toolWindowWrapper">
		<div class="windowLeft"></div><div class="windowRight"></div>
	</div>
	<div id="objects"></div>
	<div id="stage"></div>
	<div class="gridHouseWrapper">
		<div id="gridHouse">
		<?php
			for($i = 0 ; $i <= 39 ;$i++ ){
				for($x = 0 ; $x<=39 ;$x++){
					?>
					<div id="g-<?php echo $i; ?>-<?php echo $x; ?>" class="gridElement <?php if ($i < 21 && $i > 18 && $x < 21 && $x > 18) { echo "grayGrid"; }?>"></div>
					<?php
				}
			}
		
		?>
			
		</div>
	</div>
	<!-- INFOLINKS_ON -->
</div>
<div class="clear"></div>
<div class="randomBottomAd">
	
</div>
<script type="text/javascript">
	var contentId       = "";
	var type            = 1;
	var modifications   = 0;
	var newBase         = 1;
	var loadingDelay    = 7000;
	var canEdit         = 1;
	var hideWallCount   = 0;
	var isAttack        = false;
	var maxDeployable   = 240; 
	var troopsDeployed  = 0;
	var mobileDevice = 0;
	
	<?php
		echo 'var _levels = ', js_intarray($towerMaxLVL), ';';
		echo 'var _MAXlevels = ', js_intarray($towerMaxLVL), ';';
		echo 'var _towers = ', js_array($towerIMG), ';';
		echo 'var _towerId = ', js_array($towerName), ';';
		echo 'var _towerRid = ', js_array($towerID), ';';
	?>

var ToggleLevel = false;
$('#toggleLevel').click(function() {
	if (!ToggleLevel) {
		$('#toggleLevel').addClass('toggleOn');
		<?php 
			for($i = 0 ; $i < count($towerName) ; $i++){
				echo 'document.getElementById(_towerId['.$i.']).onclick = function() { ChangeLevel('.$i.') };';
			}
		?>
		ToggleLevel = true;
	} else {
		$('#toggleLevel').removeClass('toggleOn');
		
		<?php 
			for($i = 0 ; $i < count($towerName); $i++){
				echo "document.getElementById(_towerId[".$i."]).onclick = function(){ createObject(_towerRid[".$i."] + '-' + _levels[".$i."], 3, 3,_towers[".$i."] + '_' + _levels[".$i."], '0', 1); } ;";
			}
		?>
		ToggleLevel = false;
	}
});

</script>
<script type="text/javascript" src="scripts/html2canvas.js"></script>	
<script type="text/javascript" src="scripts/jquery.plugin.html2canvas.js"></script>
<script type="text/javascript" src="scripts/builder.js?v=2"></script>
<script type="text/javascript">
$(window).bind("load", function() {	
	<?php if ($objs == "" ) {?>
	createObject('1000001-10-4', 4, 4, '187_10', '0', 1);
	loadObjectCoordinates('{"1000001-10-4-0":"g-17-18"}');
	<?php }else{ ?>
	<?php 
		echo $objs;
		echo $lobj;
		echo $lwll;
	}?>
	fixMisplacedObjects();		
});
</script>
</div>
</div>
</body>
</html>