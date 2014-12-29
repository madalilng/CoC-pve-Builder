<?php 
	include "config.php";	
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
			for($i = 0 ; $i <= 35 ;$i++ ){
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
	createObject('1000001-9-4', 4, 4, '187_10', '0', 1);
	loadObjectCoordinates('{"1000001-9-4-0":"g-17-18"}');
	loadWallCoordinates('');			
	fixMisplacedObjects();		
});
</script>
</div>
</div>
</body>
</html>