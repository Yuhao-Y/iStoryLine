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