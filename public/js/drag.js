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