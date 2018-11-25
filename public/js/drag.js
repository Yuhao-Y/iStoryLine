///////////////////drag///////////////
//drag event
function dragstarted() {
    d3.event.subject.active = true;
}

function dragged(d) {

    var moveLen = d3.event.y - d3.select(this).attr("cy")
    d3.select(this).attr("cy", d3.event.y);

    var characterID = d3.select(this).attr("class");

    var scenesNumber = d3.select(this).attr("scenesNumber")

    //move the whole group if this character is in one group in this scene
    if(scenes[scenesNumber*1].hasOwnProperty("groups")) {
        var groups = scenes[scenesNumber*1].groups

        groups.forEach(function(group){

            if ( isCharacterInGroup(group, characterID) == true) {
            
                group.character.forEach(function(characterIDInGroup){

                    if (characterIDInGroup != characterID) {

                        d3.select('.storyBoard').selectAll('circle').selectAll(function(){

                            if (d3.select(this).attr('scenesNumber')*1 == scenesNumber && d3.select(this).attr('class') == characterIDInGroup) {
                            
                                d3.select(this).attr("cy", d3.select(this).attr('cy')*1 + moveLen);
                            }
                        })

                        removeOldLineAndGenerateNewLine(characterIDInGroup);
                    }
                })
            }
        })
    }

    removeOldLineAndGenerateNewLine(characterID);
}

function isCharacterInGroup(group, characterID) {
    var result = false
    group.character.forEach(function(characterIDInGroup) {

        if (characterIDInGroup == characterID) {
            result = true
        }
    })

    return result
}

function dragended() {
    d3.event.subject.active = false;
}