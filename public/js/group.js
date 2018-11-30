//generate the group coordinate by the gourp info in the scenes
function generateGroup(duration, delay_time) {

    for(var i = 0; i < scenes.length; i++) {
        if(scenes[i].hasOwnProperty("groups")) {

            var groups = scenes[i].groups;
            
            groups.forEach(function(group){
                var sortedCharacterArr = new Array();

                //get the sorted character element in the group
                d3.select('.storyBoard').selectAll('rect').selectAll(function(){
                    var selectedCharacter = d3.select(this)
                    group.character.forEach(function(character){
                        if(selectedCharacter.attr('class') == character) {
                            sortedCharacterArr.push(selectedCharacter);
                        }
                    });
                });

                sortedCharacterArr.sort(sortByCharacterX);

                
                var startY = 0

                //select the first circle's y coordinate in this group as the upper bound y coordinate in the group
                d3.select('.storyBoard').selectAll('circle').selectAll(function(){
                    if(d3.select(this).attr('scenesNumber') == scenes[i].scenesNumber) {
                        if(d3.select(this).attr('class') == sortedCharacterArr[0].attr('class')) {
                            startY = characterMap.get(d3.select(this).attr('class')).y*1;
                        } 
                    }
                })

                //modify all circle's y coordiante in this group 
                d3.select('.storyBoard').selectAll('circle').selectAll(function(){
                    if(d3.select(this).attr('scenesNumber') == scenes[i].scenesNumber) {
                        for(var j = 0; j < sortedCharacterArr.length; j++) {
                            if(d3.select(this).attr('class') == sortedCharacterArr[j].attr('class')) {
                                var characterID = sortedCharacterArr[j].attr('class')

                                if(d3.select(this).attr('cy') != startY + j*circle_distance_group) {
                                    if(duration > 0) {
                                        d3.select(this).transition().delay(i*delay_time).tween('rearrange', function(){ return function(){removeOldLineAndGenerateNewLine(characterID)}}).attr('cy', startY + j*circle_distance_group).duration(duration)
                                    } else {
                                        d3.select(this).attr('cy', startY + j*circle_distance_group)
                                        removeOldLineAndGenerateNewLine(characterID)
                                    }
                                }                                
                            }
                        }
                    }
                })
            })
        }
    }
}

function group() {
    if(selectedCharacter.length <=1) {
        alert("Please select two or more characters")
        return;
    }

    var scenesNumber = selectedCharacter[0].attr("scenesNumber");


    for(var i = 1; i < selectedCharacter.length; i++) {
        if(selectedCharacter[i].attr("scenesNumber") != scenesNumber) {
            selectedCharacter = new Array()
            alert("Please select the characters at the same scenes")
            return;
        }
    }
 
    var newGroup = {};
    newGroup.type = "default"
    newGroup.character = new Array()

    selectedCharacter.forEach(function(character){
        var characterID = character.attr("class")
        if(scenes[scenesNumber].hasOwnProperty("groups") && newGroup.character.indexOf(characterID) == -1) {
            for(var i = 0; i < scenes[scenesNumber].groups.length; i++) {
                if (scenes[scenesNumber].groups[i].character.indexOf(characterID) > -1) {
                    newGroup.character = newGroup.character.concat(scenes[scenesNumber].groups[i].character)
                    scenes[scenesNumber].groups.splice(i, 1)
                    return;
                }
            }
        }

        newGroup.character.push(characterID)
    })

    if(scenes[scenesNumber].hasOwnProperty("groups") == false){
        scenes[scenesNumber].groups = new Array()
    }

    scenes[scenesNumber].groups.push(newGroup);


    generateGroup(duration_time, 0);

    selectedCharacter = new Array();
}

function ungroup() {

    selectedCharacter.forEach(function(character){

        var scenesNumber = character.attr("scenesNumber")
        var characterID = character.attr("class")

        selectedCharacter.forEach(function(character){
            var characterID = character.attr("class")
            if(scenes[scenesNumber].hasOwnProperty("groups")) {
                for(var i = 0; i < scenes[scenesNumber].groups.length; i++) {
                    var charGroupIndex = scenes[scenesNumber].groups[i].character.indexOf(characterID);
                    if ( charGroupIndex > -1) {
                        scenes[scenesNumber].groups[i].character.splice(charGroupIndex, 1);

                        var characterY = characterMap.get(characterID).y;
                        character.transition().tween('rearrange', function(){ return function(){removeOldLineAndGenerateNewLine(characterID)}}).attr('cy', characterY).duration(duration_time)
                        return;
                    }
                }
            }

        })

    })

    generateGroup(duration_time)

    selectedCharacter = new Array()
}

function resumeUngroupCharacter(scene) {
    

}