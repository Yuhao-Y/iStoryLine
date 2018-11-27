
var character_width = 10;
var character_height = 30;
var character_x = 150;
var character_y = 100;
var scenesLen = 70;
var scenseVerLineHeight = character_y + 1;
var circle_distance_group = 30;
var duration_time = 1000;
var circle_r = 8
var largestScenseCount = 0;
var svgContainer;
var scenes;
var characterMap = new Map();
var selectedCharacter = new Array();
var defaultPathWidth = 10;
var svgContainer;
var sliderSvgContainer;
var currentScene = 0;

var dataPath = "data/data.json";

d3.json(dataPath, function(err, data){
	var characters = data.characters;
	scenes = getScenesList(data.scenes);
	svgContainer = d3.select("#story").append("svg")
                                    	.attr("width", 20000)
                                    	.attr("height", 1500);

    sliderSvgContainer = d3.select("#timelineSlider").append("svg").attr("width", 20000).attr("height", 50);
    
    var lines = new Array();

    for(var i = 0; i < characters.length; i++) {
    	//lines
    	var points = new Array();
        var line = {};
        line.points = new Array();
        line.id = characters[i].id;
        line.color = characters[i].color;
        line.width = defaultPathWidth;
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


        characterMap.set(characters[i].id, {x:character_width, y:getCharacterYCoordinate(i), profile:characters[i].profile,color:characters[i].color, startTimestamp:characters[i].startTimestamp, endTimestamp:characters[i].endTimestamp});
        
        //get the start point
        points.push({x:character_width, y:i*character_y + character_height/2});

        //add text
        var text = svgContainer.append('g').attr('class','text');

        text.append('text').attr('text-anchor', 'end')
            .attr('x', character_x - 2)
            .attr('y', i*character_y + character_height/1.5)
            .attr("font-size",20)
            .attr('class', characters[i].id)
            .text(characters[i].name);
      
    }   

    var scenesPoint = new Array();

    for(var i = 0; i < scenes.length; i++) {
        largestScenseCount = Math.max(largestScenseCount, scenes[i].endTimestamp);   

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
            .attr('scenesNumber', scenes[i].scenesNumber)

        	lines[j].points.push(point);
        	scenesPoint[i].push(point);
    	}    
    }

    generateGroup(duration_time);

    drawCurveLines(lines);

    drawScienseVerticalLine(lines);

    //add drag event
    d3.select(".storyBoard").selectAll("circle").call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));
    d3.select(".storyBoard").selectAll("rect").call(d3.drag().on("start", shiftstarted).on("drag", shiftted).on("end",shiftended));
});


function generateGroup(duration) {

    for(var i = 0; i < scenes.length; i++) {
        if(scenes[i].hasOwnProperty("groups")) {

            var groups = scenes[i].groups;
            
            groups.forEach(function(group){
                var sortedCharacterArr = new Array();

                d3.select('.storyBoard').selectAll('rect').selectAll(function(){
                    var selectedCharacter = d3.select(this)
                    group.character.forEach(function(character){
                        if(selectedCharacter.attr('class') == character) {
                            sortedCharacterArr.push(selectedCharacter);
                        }
                    });
                });

                sortedCharacterArr.sort(sortByCharacterX);
                var startY = characterMap.get(sortedCharacterArr[0].attr('class')).y

                d3.select('.storyBoard').selectAll('circle').selectAll(function(){
                    if(d3.select(this).attr('scenesNumber') == scenes[i].scenesNumber) {
                        if(d3.select(this).attr('class') == sortedCharacterArr[0].attr('class')) {
                            startY = d3.select(this).attr('cy')*1
                        } 
                    }
                })

                d3.select('.storyBoard').selectAll('circle').selectAll(function(){
                    if(d3.select(this).attr('scenesNumber') == scenes[i].scenesNumber) {
                        for(var j = 0; j < sortedCharacterArr.length; j++) {
                            if(d3.select(this).attr('class') == sortedCharacterArr[j].attr('class')) {
                                var characterID = sortedCharacterArr[j].attr('class')
                                if(duration > 0) {
                                    d3.select(this).transition().tween('rearrange', function(){ return function(){removeOldLineAndGenerateNewLine(characterID)}}).attr('cy', startY + j*circle_distance_group).duration(duration)
                                } else {
                                    d3.select(this).attr('cy', startY + j*circle_distance_group)
                                    removeOldLineAndGenerateNewLine(characterID)
                                }
                                
                            }
                        }
                    }
                })
            })
        }
    }
}

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
        svgContainer.insert('path', 'circle').attr('d', line(point)).style('stroke', '#6E7B8B').style("stroke-opacity", 0.2).style('stroke-width', 1).style('fill','none');
    }
}

function getScenesList(data) {
	var scenes = new Array();
	
	data.forEach(function(d) {

		for(var i = d.startTimestamp; i <= d.endTimestamp; i++) {

			var tmp = {};
			tmp.name = d.name;
            tmp.scenesNumber = i;
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
        
    svgContainer.insert('path', 'circle').attr('d', pathData).attr('class', line.id).style('stroke', line.color).style("stroke-opacity", line.opacity).style('stroke-width', line.width)
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

    //TO-DO this cause the non-first circle in a group cannot drag
    generateGroup(0);
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

    shiftByCharacterID(characterID, d3.event.y, 0)
}

function shiftended() {
    d3.event.subject.active = false;
    reArrangeCharacter();
    generateGroup(duration_time);
}

//if duration > 0 , the shift action will have animation
function shiftByCharacterID(characterID, newY, duration) {
    var moveLen = 0;

    d3.select(".storyBoard").select("svg").selectAll("rect").selectAll(
        function() {
            if(d3.select(this).attr('class') == characterID) {
                moveLen = newY - d3.select(this).attr("y");
                if (duration > 0) {
                    d3.select(this).transition().attr("y", newY).duration(duration);
                } else {
                   d3.select(this).attr("y", newY); 
                }
                
                
            }
        }
    )

    d3.select(".storyBoard").select("svg").selectAll("circle").selectAll(
        function() {
            if(d3.select(this).attr('class') == characterID) {
                if (duration > 0) {
                    d3.select(this).transition().tween('text', function(){ return function(){removeOldLineAndGenerateNewLine(characterID)}}).attr("cy", d3.select(this).attr("cy")*1 + moveLen).duration(duration);
                } else {
                    d3.select(this).attr("cy", d3.select(this).attr("cy")*1 + moveLen);
                    removeOldLineAndGenerateNewLine(characterID)
                }
                
            }
        }
    )

    d3.select(".storyBoard").select("svg").selectAll("text").selectAll(
        function() {
            if(d3.select(this).attr('class') == characterID) {
                if (duration > 0) {
                    d3.select(this).transition().attr("y", d3.select(this).attr("y")*1 + moveLen).duration(duration);
                } else {
                    d3.select(this).attr("y", d3.select(this).attr("y")*1 + moveLen);
                }
            }
        }
    )

    
}

function reArrangeCharacter() {
    var characterArr = getSortedCharacter()

    for(var i = 0; i < characterArr.length; i++) {
        shiftByCharacterID(characterArr[i].attr('class'), i*character_y, duration_time)

        //update the y value in character map since this value would be used when comput the group
        characterMap.get(characterArr[i].attr('class')).y = i*character_y + character_height/2
    }
}

function getSortedCharacter() {
    var characterArr = new Array();

    d3.select('.storyBoard').selectAll('rect').selectAll(function(){
        characterArr.push(d3.select(this));
    });

    
    characterArr.sort(sortByCharacterX);

    return characterArr
}

function sortByCharacterX(a, b) {
        return a.attr('y') - b.attr('y')
}