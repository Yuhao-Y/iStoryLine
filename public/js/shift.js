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
