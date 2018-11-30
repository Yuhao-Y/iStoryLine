var character_width = 5;
var character_height = 10;
var character_x = 80;
var character_y = 20;
var scenesLen = 20;
var svg_shift_y = 10
var scenseVerLineHeight = character_y + svg_shift_y + 1;
var circle_distance_group = 10;
var duration_time = 1000;
var delay_time = 100;
var circle_r = 8
var largestScenseCount = 0;
var scenes;
var characterMap = new Map();
var selectedCharacter = new Array();
var defaultPathWidth = 2;

var svgContainer;
var sliderSvgContainer;
var currentScene = 0;

var dataPath = "data/data.json";
//var dataPath = "data/data-test.json";

d3.json(dataPath, function(err, data){
    var characters = data.characters;
    
    svgContainer = d3.select("#story").append("svg")
                                        .attr("width", 20000)
                                        .attr("height", 300);

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
                .attr("y", i*character_y + svg_shift_y)
                .attr("width", character_width)
                .attr("height", character_height)
                .attr("name", characters[i].name)
                .attr("id", characters[i].id)
                .attr('fill', characters[i].color)
                .attr('class', characters[i].id);

        characterMap.set(characters[i].id, {x:character_width, y:getCharacterYCoordinate(i), profile:characters[i].profile,color:characters[i].color, startTimestamp:characters[i].startTimestamp, endTimestamp:characters[i].endTimestamp});
        
        //get the start point
        points.push({x:character_width, y:getCharacterYCoordinate(i)});

        //add text
        var text = svgContainer.append('g').attr('class','text');

        text.append('text').attr('text-anchor', 'end')
            .attr('x', character_x - 2)
            .attr('y', i*character_y + svg_shift_y + character_height/1.5)
            .attr("font-size",10)
            .attr('class', characters[i].id)
            .text(characters[i].name);
      
    }   

    scenes = getScenesList(data.scenes);

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

            point.x = getScenesXCoordinate(scenes[i].startTimestamp);
            point.y = character.y;

            //draws scenes
            var scene = svgContainer.append("circle")
            .attr("cx", point.x)
            .attr("cy", point.y)
            .attr("r",circle_r)
            .attr("name", scenes[i].name)
            .attr('fill', characters[j].color)
            .attr('class', characters[j].id)
            .attr('scenesNumber', scenes[i].scenesNumber)

            lines[j].points.push(point);
            scenesPoint[i].push(point);
        }    
    }

    

    drawCurveLines(lines);

    drawScienseVerticalLine(lines);

    //move up the circle over the line to make the circle selection easily
    d3.select(".storyBoard").selectAll("circle").remove();
    drawCircle(characters);
    generateGroup(duration_time, delay_time);

    //add drag event
    d3.select(".storyBoard").selectAll("circle").call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));
    d3.select(".storyBoard").selectAll("rect").call(d3.drag().on("start", shiftstarted).on("drag", shiftted).on("end",shiftended));

    createTimelineSlider();
});

function drawCircle(characters) {
    for(var i = 0; i < scenes.length; i++) { 

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
            .attr("r",circle_r)
            .attr("name", scenes[i].name)
            .attr('fill', characters[j].color)
            .attr('class', characters[j].id)
            .attr('scenesNumber', scenes[i].scenesNumber)
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
        svgContainer.insert('path', 'circle').attr('d', line(point)).style('stroke', '#6E7B8B').style("stroke-opacity", 0.1).style('stroke-width', 1).style('fill','none');
    }
}

function getScenesList(data) {
    var scenes = new Array();
    
    data.forEach(function(d) {

        for(var i = d.startTimestamp; i <= d.endTimestamp; i++) {

            var tmp = {};
            tmp.name = d.name;
            tmp.scenesNumber = i - 1;
            if(d.hasOwnProperty("groups")){
                tmp.groups = new Array();
                d.groups.forEach(function(group) {
                    var copyGroup = {};
                    copyGroup.character = new Array();
                    group.character.forEach(function(c){
                        console.log(c);
                        console.log(characterMap.get(c));
                        if(characterMap.get(c).endTimestamp >= i) {
                            copyGroup.character.push(c);
                        }
                    });
                    //copyGroup.character = group.character.slice();


                    copyGroup.type = group.type;
                    tmp.groups.push(copyGroup);
                });
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

function reArrangeCharacter() {
    var characterArr = getSortedCharacter()

    for(var i = 0; i < characterArr.length; i++) {
        shiftByCharacterID(characterArr[i].attr('class'), i*character_y + svg_shift_y, duration_time, i*delay_time)

        //update the y value in character map since this value would be used when comput the group
        characterMap.get(characterArr[i].attr('class')).y = i*character_y + svg_shift_y + character_height/2
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

function getCharacterYCoordinate(i) {
    return i*character_y + svg_shift_y + character_height/2;
}

function getScenesXCoordinate(sceneNumber) {
    return sceneNumber*scenesLen + character_x;
}
