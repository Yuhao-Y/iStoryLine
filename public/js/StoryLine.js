var character_width = 8;
var character_height = 8;
var character_y = 20;
var scenesLen = 20;

d3.json('data.json', function(err, data){

	var characters = data.characters;
	var scenes = getScenesList(data.scenes);
	var svgContainer = d3.select("#story").append("svg")
                                    	.attr("width", 20000)
                                    	.attr("height", 200);

    var characterMap = new Map();
    var lines = new Array();

    for(var i = 0; i < characters.length; i++) {
    	//lines
    	var points = new Array();

    	lines.push(new Array());

    	//draw character
    	var character = svgContainer.append("rect")
                .attr("x", 0)
                .attr("y", i*character_y)
                .attr("width", character_width)
                .attr("height", character_height)
                .attr("name", characters[i].name)
                .attr("id", characters[i].id)
                .attr('fill', characters[i].color)
                .attr('class', 'character');

        characterMap.set(characters[i].id, {x:character_width, y:i*character_y + character_height/2, color:characters[i].color, startTimestamp:characters[i].startTimestamp, endTimestamp:characters[i].endTimestamp});
        
        //get the start point
        points.push({x:character_width, y:i*character_y + character_height/2});    
    }   

    var scenesPoint = new Array();

    for(var i = 0; i < scenes.length; i++) {

    	//move the character in one group more close
    	if(scenes[i].hasOwnProperty("groups")) {
    			var groups = scenes[i].groups;

    			groups.forEach(function(group){
    				
    				var groupCharacter = group.character;

    				//the mid character in the group would not move
    				var mid = parseInt(groupCharacter.length/2);

    				for(var k = 0; k < groupCharacter.length; k++) {
    					if(k < mid) { //the upper character move down
    						var character = characterMap.get(groupCharacter[k]);
    						character.y = character.y + character_height
    						characterMap.set(groupCharacter[k], character);
    					} else if( k > mid) { //the under character move up
    						var character = characterMap.get(groupCharacter[k]);
    						character.y = character.y - character_height
    						characterMap.set(groupCharacter[k], character);
    					}
    				}
    			});
 		}     

    	scenesPoint.push(new Array());

    	for(var j = 0; j < characters.length; j++) {
    		var character = characterMap.get(characters[j].id);
    		if(character.startTimestamp > i+1 || character.endTimestamp < i+1) {
    			
    			continue;
    		}

    		var point = {};

 			point.x = scenes[i].startTimestamp*scenesLen;
 			point.y = character.y;

        	//draws scenes
        	var scene = svgContainer.append("rect")
            .attr("x", point.x)
            .attr("y", point.y )
            .attr("width", 1)
            .attr("height", 1)
            .attr("name", scenes[i].name)
            .attr('fill', characters[j].color)
            .attr('class', 'character');

        	lines[j].push(point);
        	scenesPoint[i].push(point);
    	}

    	//restore the coordinate of the character in the group
    	if(scenes[i].hasOwnProperty("groups")) {
    			var groups = scenes[i].groups;

    			groups.forEach(function(group){
    				
    				var groupCharacter = group.character;
    				var mid = parseInt(groupCharacter.length/2);

    				for(var k = 0; k < groupCharacter.length; k++) {
    					if(k < mid) {
    						var character = characterMap.get(groupCharacter[k]);
    						character.y = character.y - character_height
    						characterMap.set(groupCharacter[k], character);
    					} else if( k > mid) {
    						
    						var character = characterMap.get(groupCharacter[k]);
    						character.y = character.y + character_height
    						characterMap.set(groupCharacter[k], character);
    					}
    				}
    			});
 		}     
    }

    //draw the lines
    lines.forEach(function(points){
    	    //draw lines
        var line = d3.svg.line()
                 .x(function(d) { return d['x']})
                 .y(function(d) { return d['y']});
        svgContainer.append('path').datum(points).attr('d', line);
    });

});

function getScenesList(data) {
	var scenes = new Array();
	
	data.forEach(function(d) {

		for(var i = d.startTimestamp; i <= d.endTimestamp; i++) {

			var tmp = {};
			tmp.name = d.name;
			if(d.hasOwnProperty("groups")){
				tmp.groups = d.groups;
			}
			
			tmp.startTimestamp = i;
			tmp.endTimestamp = i;
			scenes.push(tmp);
		}

	});

	return scenes;
}