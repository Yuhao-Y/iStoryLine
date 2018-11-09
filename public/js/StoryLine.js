var character_width = 8;
var character_height = 15;
var character_x = 200;
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
                .attr("x", character_x)
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

        //add text
        var text = svgContainer.append('g').attr('class','text');

        // Apppend two actual 'text' nodes to fake an 'outside' outline.
        text.append('text').attr('text-anchor', 'end')
            .attr('x', character_x - 2)
            .attr('y', i*character_y + character_height)
            .attr("font-size",10)
            .text(characters[i].name); 
        text.append('text').attr('class', 'color').attr('text-anchor', 'end')
            .attr('x', character_x - 2)
            .attr('y', i*character_y + character_height)
            .attr("font-size",10)
            .text(characters[i].name); 

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

 			point.x = scenes[i].startTimestamp*scenesLen + character_x;
 			point.y = character.y;

        	//draws scenes
        	var scene = svgContainer.append("circle")
            .attr("cx", point.x)
            .attr("cy", point.y)
            .attr("r",3)
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

    //draw the curve lines
    lines.forEach(function(points){

        var lineGenerator = d3.line()
            .curve(d3.curveCardinal);

        var line = new Array();

        points.forEach(function(point) {
            line.push([point.x,point.y]);
        });
        
        var pathData = lineGenerator(line);
        
        svgContainer.append('path').attr('d', pathData);
    });

    drawScienseVerticalLine(lines[0], 100, svgContainer);

    d3.selectAll("circle").call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));
});



function dragstarted() {
  //circles.splice(circles.indexOf(d3.event.subject), 1);
  //circles.push(d3.event.subject);
  console.log("drag start");
  d3.event.subject.active = true;
}

function dragged(d) {
    console.log("draging");

  d3.select(this).attr("cy", d3.event.y);
}

function dragended() {
    console.log("drag end");
  d3.event.subject.active = false;
}

function drawScienseVerticalLine(data, height, svgContainer) {
    data.forEach(function(pointData) {
        var line = d3.svg.line()
                 .x(function(d) { return d['x']})
                 .y(function(d) { return d['y']});
        var point = new Array();
        point.push({x:pointData.x, y:0});
        point.push({x:pointData.x, y:height});
        svgContainer.append('path').attr('d', line(point)).style('stroke', '#6E7B8B').style("stroke-opacity", 0.2).style('stroke-width', 1).style('fill','none');
    });
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