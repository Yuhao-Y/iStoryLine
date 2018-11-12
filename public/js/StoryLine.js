//document.write("<script language=javascript src='/js/drag.js'><\/script>")
//document.write("<script language=javascript src='/js/shift.js'><\/script>")

var character_width = 8;
var character_height = 15;
var character_x = 100;
var character_y = 40;
var scenesLen = 25;
var scenseVerLineHeight = character_y + 1;
var largestScenseCount = 0;
var svgContainer;

d3.json('data.json', function(err, data){

	var characters = data.characters;
	var scenes = getScenesList(data.scenes);
	svgContainer = d3.select("#story").append("svg")
                                    	.attr("width", 20000)
                                    	.attr("height", 200);

    var characterMap = new Map();
    var lines = new Array();

    for(var i = 0; i < characters.length; i++) {
    	//lines
    	var points = new Array();
        var line = {};
        line.points = new Array();
        line.id = characters[i].id;
        line.color = characters[i].color;
        line.width = 2;
        line.opacity = 1;
    	lines.push(line);

    	//draw character
    	var character = svgContainer.append("rect")
                .attr("x", character_x)
                .attr("y", i*character_y)
                .attr("width", character_width)
                .attr("height", character_height)
                .attr("name", characters[i].name)
                .attr("id", characters[i].id)
                .attr('fill', characters[i].color)
                .attr('class', characters[i].id);

        characterMap.set(characters[i].id, {x:character_width, y:i*character_y + character_height/2, color:characters[i].color, startTimestamp:characters[i].startTimestamp, endTimestamp:characters[i].endTimestamp});
        
        //get the start point
        points.push({x:character_width, y:i*character_y + character_height/2});

        //add text
        var text = svgContainer.append('g').attr('class','text');

        // Apppend two actual 'text' nodes to fake an 'outside' outline.
        text.append('text').attr('text-anchor', 'end')
            .attr('x', character_x - 2)
            .attr('y', i*character_y + character_height)
            .attr("font-size",10)
            .attr('class', characters[i].id)
            .text(characters[i].name);

        // text.append('text').attr('class', 'color').attr('text-anchor', 'end')
        //     .attr('x', character_x - 2)
        //     .attr('y', i*character_y + character_height)
        //     .attr("font-size",10)
        //     .text(characters[i].name); 
      
    }   

    var scenesPoint = new Array();

    for(var i = 0; i < scenes.length; i++) {
        largestScenseCount = Math.max(largestScenseCount, scenes[i].endTimestamp);

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

 			point.x = scenes[i].startTimestamp*scenesLen + character_x;
 			point.y = character.y;

        	//draws scenes
        	var scene = svgContainer.append("circle")
            .attr("cx", point.x)
            .attr("cy", point.y)
            .attr("r",3)
            .attr("name", scenes[i].name)
            .attr('fill', characters[j].color)
            .attr('class', characters[j].id)

        	lines[j].points.push(point);
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

    drawCurveLines(lines);

    drawScienseVerticalLine(lines);

    //add drag event
    d3.select(".storyBoard").selectAll("circle").call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));
    d3.select(".storyBoard").selectAll("rect").call(d3.drag().on("start", shiftstarted).on("drag", shiftted).on("end",shiftended));
});




function generateLineByCharacterID(characterID, color, opacity, width) {
    var line = {};
    line.points = new Array();
    line.id = characterID;
    line.color = color;
    line.opacity = opacity;
    line.width = width;
    d3.select(".storyBoard").select("svg").selectAll("circle").selectAll(
        function() {
            if(d3.select(this).attr('class') == characterID) {
                var point = {};
                point.x = d3.select(this).attr('cx');
                point.y = d3.select(this).attr('cy');
                line.points.push(point);
            }
        }
    )

    return line;
}

function renderCurveLine(characterID) {

}

function drawScienseVerticalLine(data) {

    for(var i = 1; i <= largestScenseCount; i++) {
        
        var line = d3.svg.line()
                 .x(function(d) { return d['x']})
                 .y(function(d) { return d['y']});
        var point = new Array();
        point.push({x:i*scenesLen + character_x, y:0});
        point.push({x:i*scenesLen + character_x, y:scenseVerLineHeight * data.length});
        svgContainer.append('path').attr('d', line(point)).style('stroke', '#6E7B8B').style("stroke-opacity", 0.2).style('stroke-width', 1).style('fill','none');
    }
}

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

function drawRect(character) {

}

function drawCurveLines(lines) {
    //draw the curve lines
    lines.forEach(function(line){
        drawCurveLine(line);
    });
}

function drawCurveLine(line) {
    var lineGenerator = d3.line()
        .curve(d3.curveCardinal);

    var path = new Array();

    line.points.forEach(function(point) {
        path.push([point.x,point.y]);
    });
        
    var pathData = lineGenerator(path);
        
    svgContainer.append('path').attr('d', pathData).attr('class', line.id).style('stroke', line.color).style("stroke-opacity", line.opacity).style('stroke-width', line.width)
}

function removeOldLineAndGenerateNewLine(characterID) {

    //get the attribute from the old line and remove the old line
    var color;
    var opacity;
    var width;
    d3.select(".storyBoard").select("svg").selectAll("path").selectAll(
        function() {
            if(d3.select(this).attr('class') == characterID) {
                color = d3.select(this).style('stroke');
                opacity = d3.select(this).style('stroke-opacity');
                width = d3.select(this).style('stroke-width');
                d3.select(this).remove();
            }
        }
    )

    //generate the new line with the coodinate from the circle
    var line = generateLineByCharacterID(characterID, color, opacity, width)

    drawCurveLine(line);
}

///////////////////drag///////////////
//drag event
function dragstarted() {
    d3.event.subject.active = true;
}

function dragged(d) {

    d3.select(this).attr("cy", d3.event.y);

    var characterID = d3.select(this).attr("class");

    removeOldLineAndGenerateNewLine(characterID);
}

function dragended() {
    d3.event.subject.active = false;
}


//////////////////shift///////////////
function shiftstarted() {
    d3.event.subject.active = true;
}

function shiftted() {
    var characterID = d3.select(this).attr("class");
    var moveLen = d3.event.y - d3.select(this).attr("y");

    d3.select(this).attr("y", d3.event.y);

    d3.select(".storyBoard").select("svg").selectAll("circle").selectAll(
        function() {
            if(d3.select(this).attr('class') == characterID) {
                d3.select(this).attr("cy", d3.select(this).attr("cy")*1 + moveLen);
            }
        }
    )

    d3.select(".storyBoard").select("svg").selectAll("text").selectAll(
        function() {
            if(d3.select(this).attr('class') == characterID) {
                d3.select(this).attr("y", d3.select(this).attr("y")*1 + moveLen);
            }
        }
    )

    removeOldLineAndGenerateNewLine(characterID)
}

function shiftended() {
    d3.event.subject.active = false;
}