var wallName = '166_11';
	
$("#wallLevelSelect").change(function() {
	wallName = '166_' + $(this).val();
});
	
$('#build #embed').click(function() {
	$(this).select();	
});

var deleteToggle = false;
		
$('#toggleDelete').click(function() {
	if (!deleteToggle) {
		$('#toggleDelete').addClass('toggleOn');
		deleteToggle = true;
	} else {
		$('#toggleDelete').removeClass('toggleOn');
		deleteToggle = false;
	}
});
function ChangeLevel(t) {
	if(_levels[t] == _MAXlevels[t] )
		_levels[t] = 1;
	_levels[t]++;
	document.getElementById(_towerId[t]).src = src="assets/builder/objects/" + _towers[t] + "_" + _levels[t] + ".png";
}
$(window).bind("load", function() {
	$(document).ready(function(){
		
		function changeBaseLevel() {
			var baseLevel = $('#baseLevelSelect').val();
		}

		$('#loading').delay(loadingDelay).fadeOut(2000, "linear");
		
		var currentDraggedObject;
		var currentObjects = {};   // [grid location, grid size]
		var objectCoordinates = {};
		var gridCoordinates = {};
		var gridOffsets = {};
		var wallCoordinates = {};
		var spawnRestrictionCoordinates = [];
		spawnRestrictionCoordinates['wall'] = [];
		spawnRestrictionCoordinates['object'] = [];
		var coordinateToObjects = {}; 
		var objectOccupies = {};
		var gridSize = 20;
		var currentZIndex = 2000;
		var canRate = true;
		var togglePerimeter = false;
		
		// attack oriented
		var activeTool = false;
		var activeTroop = '';
		var troopLocations = {};
		
		// click / wall oriented		
		var mouseDown;
		var mouseXpos;
		var mouseYpos;
		var placeWalls = null;
		var allowWallChange = true;
		var buildingMovement = false;
		
		// the center grid elements need special treatment 
		var grayWallArray = ['g-19-19', 'g-19-20', 'g-20-19', 'g-20-20'];
		
		var blueWallArray = new Array;
		for (var i = 41; i< 55; i++) {
			for (var g = 0; g < 40; g++) {
				blueWallArray.push('g-' + i + '-' + g);
			}
		}
				
		// create the grid	
		$("#gridHouse div").each(function() {
			
			// create our grid coordinates for object saving / loading
			var containerPos = $(this).position();
			var elementName = $(this).attr('id');
			
			var gridCoordinateName = containerPos.top + '_' + containerPos.left;
			gridCoordinates[gridCoordinateName.replace('.', '')] = elementName;
			
			// creates an array that we can use to keep track of the coordinates
			// so we dont have to cycle through each individual element in the grid
			var offset = $(this).offset();
			gridOffsets[elementName] = offset;
		});
		
				
		$('#stage').droppable({

			drop: function(event, ui ) {
				
				// setup snapping coordinates
				var originCoordinates = $('#objects').position();
				var elementPos = $('#' + currentDraggedObject).position();
				var buildingNo = currentDraggedObject.split('-')[0];
				//console.log($('#objects').position());
				
				buildingMovement = false;
				
				if(deleteToggle && buildingNo != "1000001"){ //renpogi not TH
					mapGridUnderObject(currentDraggedObject, "g-2-17", 0, 0, true);
					$('#' + currentDraggedObject).css("background-image", "none");
					delete currentObjects[currentDraggedObject]; 
					delete objectCoordinates[currentDraggedObject];
				}else if (elementPos) {

					var elementTop = (Math.round(elementPos.top / gridSize) * gridSize) + originCoordinates.top;
					var elementLeft = (Math.round(elementPos.left / gridSize) * gridSize) + originCoordinates.left;
												
					var gridCoordinateName = elementTop.toString() + '_' + elementLeft.toString();
					var objectDestination = gridCoordinates[gridCoordinateName.replace('.', '')];
					
					//console.log('dest: '+ objectDestination, isGridOccupied(objectDestination, false));
					
					// we need to get the object's width/height
					var width = currentObjects[currentDraggedObject][1];
					var height = currentObjects[currentDraggedObject][2];
					
					//console.log('collision', wallCollision(currentDraggedObject, objectDestination, width, height));
					
					// lets ensure that there are no objects underneath
					if (objectDestination != undefined && !isGridOccupied(objectDestination, currentDraggedObject) && !isSurroundingGridOccupied(objectDestination, width, height, currentDraggedObject) && !wallCollision(currentDraggedObject, objectDestination, width, height)) {						
						
						// upon drop, snap the item into position
						$('#' + currentDraggedObject).offset({ top: elementTop, left: elementLeft });
						
						// save the coordinates of the newly snapped item
						saveCoordinates(currentDraggedObject, elementTop, elementLeft);
						currentObjects[currentDraggedObject][0] = objectDestination;
						mapGridUnderObject(currentDraggedObject, objectDestination, width, height, true);
						
						// update modification count
						modifications = modifications + 1;
					} else {
						// there was an object, lets reposition our dragged item back to where it was
						var originalPosition = $('#' + currentObjects[currentDraggedObject][0]).position();
						$('#' + currentDraggedObject).offset({ top: originalPosition.top, left: originalPosition.left });
					}
					$('#' + currentDraggedObject).removeClass('structurePickup');
					
					createObjectSpawnRestrictions();
					//alert(objectDestination);

					
				}
			}		
		});
		
			
		if (canEdit) {
			// click to add walls
			$("#objects").click(function(e) {
				
				if (mouseDown) {
					mouseX = mouseXpos;
					mouseY = mouseYpos;
					
					
				} else {
					var mouseX = e.pageX;
					var mouseY = e.pageY;
				}
				
				if (mobileDevice) {
					allowWallChange = true;
				}
				$.each(gridOffsets, function(elementName, values) {
					
					var offset = values;
					var element = $('#' + elementName);
					
					if (mouseX > offset.left && mouseX < offset.left + gridSize && mouseY > offset.top && mouseY < offset.top + gridSize && buildingMovement == false && allowWallChange) {						
						
						var elementName = element.attr('id');				
						var imageName = element.css("background-image");
						
						var replacement = /\"|\'|\)/g;
						
						imageName = imageName.split('/').pop().replace(replacement,'');
						imageName = imageName.replace('.png', '');						
						imagePng = imageName.split('_');
						if (imagePng[0] != "166") {
							updateWalls(1, elementName);
						} else {
							//alert(imageName);
							updateWalls(2, elementName);
						}
					}
				});
			});
		}
		// creates the objects but does not place them
		var NotSame = 0;
		 window.createObject = function (name, width, height, image, range, perimeter) {
			name += "-" + NotSame;
			NotSame++;
			// let's play with the range overlay
			var topMargin  = (((range * gridSize) - (gridSize * height)) / 2);
			var leftMargin = (((range * gridSize) - (gridSize * width)) / 2);
			var rangeSize = gridSize * range;
			var rangeDiv = (range != '0.00') ? '<div class="range" style="margin: -' + topMargin + 'px 0 0 -' + leftMargin + 'px; height: ' + rangeSize + 'px; width: ' + rangeSize + 'px; background-size: ' + rangeSize + 'px ' + rangeSize + 'px;"></div>' : '';
			
			
			$("#objects").append('<div id="' + name + '" class="object" style="background: url(\'assets/builder/objects/' + image + '.png\') no-repeat 0px 0px; width: ' + gridSize * width +'; height: ' + gridSize * height +';">' + rangeDiv + '</div>');
			
			currentObjects[name] = ['', width, height, perimeter];
			fixMisplacedObjects();
			//console.log(name, currentObjects[name]);
			if (canEdit) {
				$("#" + name).draggable({
					start: function() {
						buildingMovement = true;
						$('#' + name).css('z-index', currentZIndex);
						currentZIndex++;
						currentDraggedObject = name;
						
						//$('#' + name).addClass('structurePickup');
					}
				});
			}
		}
		
		 window.loadObjectCoordinates = function (json) {
			var jsonObject = jQuery.parseJSON(json);
			$.each(jsonObject, function(name, gridElement) {
				if (typeof currentObjects[name] != 'undefined') {
				
					currentObjects[name][0] = gridElement;
					mapGridUnderObject(name, gridElement, currentObjects[name][1], currentObjects[name][2], true);
					
					if ($('#' + gridElement).position()) {
						var containerPos = $('#' + gridElement).position();
						$('#' + name).offset({ top: containerPos.top, left: containerPos.left });
						saveCoordinates(name, containerPos.top, containerPos.left);
					}
				}
			});
		}
		
		window.loadWallCoordinates = function (json) {
			
			if (json) {
				var jsonObject = jQuery.parseJSON(json);
				
				$.each(jsonObject, function(name) {
					$('#' + name).css("background-image", "url(assets/builder/objects/" + wallName + ".png)");
					wallCoordinates[name] = 1;
				});
			}
			
			// update wall count
			updateWalls(0, 0);
		}
		
		function updateWalls(type, elementName) {
			// lets ensure that we are not placing walls on objects
			if (!isGridOccupied(elementName)) {
				if (type == 1 && (placeWalls || placeWalls == null) && !deleteToggle) {
					$('#' + elementName).css("background-image", "url(assets/builder/objects/" + wallName + ".png)");
					modifications++;
					wallCoordinates[elementName] = $("#wallLevelSelect").val();
					placeWalls = true;
					createWallSpawnRestrictions();
				} else if (type == 2 && (!placeWalls || placeWalls == null) && deleteToggle) {
										
					if (jQuery.inArray(elementName, grayWallArray) != -1) {
						$('#' + elementName).css("background-image", "url(themes/default/images/tile_background_gray.png)");	
					} else if (jQuery.inArray(elementName, blueWallArray) != -1) {
						$('#' + elementName).css("background-image", "url(themes/default/images/tile_background_blue.png)");				
					} else {
						$('#' + elementName).css("background-image", "none");
					}
					modifications++;
					placeWalls = false;
					delete wallCoordinates[elementName];
					createWallSpawnRestrictions();
				}
			}
		}
		
		function createObjectSpawnRestrictions()
		{
			if (togglePerimeter) {
				
				resetSpawnRestrictions('object');
				
				var coordinateArray = [];
				var objectCoordinatesOccupied = {};
				
				$.each(objectOccupies, function(key, arrayData) {
					$.each(arrayData, function(key, element) {
						objectCoordinatesOccupied[element] = true;
					});
				});
				
				coordinateArray.push ({ name: 'object', coordinates: objectCoordinatesOccupied });
			
				$.each(coordinateArray, function(key, data) {
					
					$.each(data.coordinates, function(gridElement) {
						
						var objectName = coordinateToObjects[gridElement];
						if (currentObjects[objectName][3]) {
							createSpawnRestriction(data.name, gridElement);
						}
					});
				});
			}		
		}
		
		function createWallSpawnRestrictions()
		{
			if (togglePerimeter) {
				
				resetSpawnRestrictions('wall');
				
				var coordinateArray = [];				
				coordinateArray.push ({ name: 'wall', coordinates: wallCoordinates });
			
				$.each(coordinateArray, function(key, data) {
					
					$.each(data.coordinates, function(gridElement) {
						createSpawnRestriction(data.name, gridElement);
					});
				});
			}
		}
		
		function createSpawnRestriction(name, gridElement)
		{
			var simplifiedLoc      = gridElement.split('-');
			var startingVertical   = +simplifiedLoc[1] - 1;
			var startingHorizontal = +simplifiedLoc[2] - 1;
			
			var width = 1;
			var height = 1;
			
			// We start with our horizontal checks first
			for (var g = startingHorizontal; g < (startingHorizontal + width + 2); g++) {
				
				var horizontalElement = 'g-' + startingVertical + '-' + g;
				if (!wallCoordinates[horizontalElement]) {
				
					spawnRestrictionCoordinates[name].push(horizontalElement);
					$('#' + horizontalElement).css("background-image", "url(themes/default/images/tile_background_gray.png)");
				}
				// we then iterate through our vertical grid checks
				for (var h = startingVertical; h < (startingVertical + height + 2); h++) {
					
					var verticalElement = 'g-' + h + '-' + g;
					if (!wallCoordinates[verticalElement]) {
						
						spawnRestrictionCoordinates[name].push(verticalElement);
						$('#' + verticalElement).css("background-image", "url(themes/default/images/tile_background_gray.png)");
					}
				}
			} 
		}
		
		function resetSpawnRestrictions(restrictionType)
		{
			if (spawnRestrictionCoordinates[restrictionType]) {
				
				$.each(spawnRestrictionCoordinates[restrictionType], function(coordinateType, gridElement) {
									
					if (!wallCoordinates[gridElement]) {
						
						if (jQuery.inArray(gridElement, grayWallArray) != -1) {
							$('#' + gridElement).css("background-image", "url(themes/default/images/tile_background_gray.png)");	
							$('#' + gridElement).css("background-image", "url(themes/default/images/tile_background_gray.png)");	
						} else if (jQuery.inArray(gridElement, blueWallArray) != -1) {
							$('#' + gridElement).css("background-image", "url(themes/default/images/tile_background_blue.png)");				
						} else {
							$('#' + gridElement).css("background-image", "none");
						}
					}
				});
				spawnRestrictionCoordinates[restrictionType] = [];
			}
		}
		
		$("#togglePerimeter").click(function() {
			
			if (!togglePerimeter) {
				togglePerimeter = true;
				resetSpawnRestrictions('wall');
				resetSpawnRestrictions('object');
				createWallSpawnRestrictions();
				createObjectSpawnRestrictions();
				$('#togglePerimeter').addClass('toggleOn');
			} else {
				togglePerimeter = false;
				resetSpawnRestrictions('wall');
				resetSpawnRestrictions('object');
				$('#togglePerimeter').removeClass('toggleOn');
			}
		});
		
		function saveCoordinates(name, top, left) {
			var gridCoordinateName = top.toString() + '_' + left.toString();
			objectCoordinates[name] = gridCoordinates[gridCoordinateName.replace('.', '')];
		}
		
		// looks for objects that aren't on the grid and places them back on the grid
		window.fixMisplacedObjects = function () {
			
			$.each(currentObjects, function(name, value) {
				
				var objectGridLocation = value[0];
				var objectWidth = value[1];
				var objectHeight = value[2];
				
				if (!objectGridLocation) {
					
					// let's go through each grid point in the excess storage and see if
					// it's being used. If not, we assign new coordinates to the current
					// object
					verticalLoop:
					for (var i = 0; i <= 55; i++) {
					
						horizontalLoop:	
						for (var j = 0; j <= 41; j++) {
							
							var currentGridElement = 'g-' + i + '-' + j;
							//console.log('beg: ' + currentGridElement);
							// check to see if any objects are using this gridlocation
							
							if (!isGridOccupied(currentGridElement, name) && !isSurroundingGridOccupied(currentGridElement, objectWidth, objectHeight)) {
								
								//console.log('found: ' + currentGridElement, objectSize);
								// assign coordinates;
								currentObjects[name][0] = currentGridElement;
								objectCoordinates[name] = currentGridElement;
								
								mapGridUnderObject(name, currentGridElement, objectWidth, objectHeight, true);
								
								// code also used in loadObjectCoordinates
								var containerPos = $('#' + currentGridElement).position();
								if (currentGridElement && containerPos != null && containerPos.top && containerPos.left) {
									$('#' + name).offset({ top: containerPos.top, left: containerPos.left });
									saveCoordinates(name, containerPos.top, containerPos.left);	
								}
								
								break verticalLoop;
							}
						}		
					}
				}
			});
		}
		
		// we use the objectOccupies array full of grid locations
		// and compare it to the given gridLocation to see
		// if that grid space is occupied.
		// name is an optional arg because objects are allowed to
		// be placed under their own current grid elements
		function isGridOccupied(gridLocation, objectName) {
			
			var gridOccupied = false;
			var occupiedAt = '';
			
			$.each(objectOccupies, function(name, locationArray) {
				
				$.each(locationArray, function(key, location) {
					if (gridLocation == location && name != objectName) {
						//console.log('conflict at: ' + name, objectName)
						gridOccupied = true;
					}
				});	
			});
			
			if (gridOccupied) {
				return true;
			} else {
				return false;
			}
		}
		
		function isSurroundingGridOccupied(gridLocation, width, height, objectName) {
			
			if (!gridLocation) return false;
			
			var simplifiedLoc      = gridLocation.split('-');
			var startingVertical   = +simplifiedLoc[1];
			var startingHorizontal = +simplifiedLoc[2];
			var conflict = false;
			
			// We start with our horizontal checks first
			for (var g = startingHorizontal; g < (startingHorizontal + width); g++) {
				if (isGridOccupied('g-' + startingVertical + '-' + g, objectName)) {
					conflict = true;
					//console.log('occupied by: '+ name);
					break;
				}
				
				// we then iterate through our vertical grid checks
				for (var h = startingVertical; h < (startingVertical + height); h++) {
					if (isGridOccupied('g-' + h + '-' + g, objectName)) {
						conflict = true;
						break;
					}
				}				
			} 
			return  (conflict) ? true : false;
		}
		
		// creates an array of values for a given object that maps
		// out the grid elements that it resides upon
		function mapGridUnderObject(name, gridElement, width, height, save)
		{
			var simplifiedLoc      = gridElement.split('-');
			var startingVertical   = +simplifiedLoc[1];
			var startingHorizontal = +simplifiedLoc[2];
			var tempOccupies = {};
			
			tempOccupies[name] = [];
			
			for (var i = startingHorizontal; i < (startingHorizontal + width); i++) {			
				
				for (var j = startingVertical; j < (startingVertical + height); j++) {
					tempOccupies[name].push('g-' + j + '-' + i);
					coordinateToObjects['g-' + j + '-' + i] = name;
				}
			}
			
			if (save) {
				objectOccupies[name] = tempOccupies[name];
			} else {
				return tempOccupies;
			}
		}
		
		// lets make sure no part of the element is touching walls
		function wallCollision(name, gridElement, width, height) {
			
			var coordinateArray = mapGridUnderObject(name, gridElement, width, height, false);
			var conflict = false;
			
			var wallArray = new Array;
			$.each(wallCoordinates, function(location, boolean) {
				wallArray.push(location);
			});
			
			$.each(coordinateArray[name], function(name, location) {
				
				if (jQuery.inArray(location, wallArray) != -1) {
					//console.log('wall conflict: ' + location);
					conflict = true;
				}	
			});
			
			return  (conflict) ? true : false;	
		}
		
		///////////////////////////////////////////////////////////////////////////////
		// functions concerning the holding down of a button for wall placement
		///////////////////////////////////////////////////////////////////////////////
		
		var timeout, clicker = $('#objects');
				
		clicker.mousedown(function(e){
			
			// we need these vars for the initial click to do something
			allowWallChange = true;
			placeWalls = null;
			mouseDown = true;
			mouseXpos = e.pageX;
			mouseYpos = e.pageY;
			
			clearInterval(timeout);	
			timeout = setInterval(function(){
				$("#objects").click();
			}, 25);
			
			return false;
		});
				
		clicker.mousemove(function(e){
			if (mouseDown) {
				mouseXpos = e.pageX;
				mouseYpos = e.pageY;
			}
		});
		
		$(document).mouseup(function(){
			allowWallChange = false;
			clearInterval(timeout);
			mouseDown = false;
			mouseXpos = null;
			mouseYpos = null;
			placeWalls = null;
			return false;
		});
		
		if (canEdit) {
			$("#saveBase").click(function() {
				$.ajax({
					url: "savePlan.php",
					type: 'POST',
					data: "plan=" + $("#plan").val() +
						"&objCoor=" + JSON.stringify(objectCoordinates) +
						"&wallCoor=" + JSON.stringify(wallCoordinates),
					success: function(data) {
						window.open(data,'_blank');
					}
				});
				
			});

		}
		var timeout, clicker = $('#objects');
	});
});