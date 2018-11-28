var curr
function mouseEvent(){
  d3.select("body").on("mouseover",function(data) {
    d3.select(".storyBoard").selectAll("rect").on("click", function(data) {
        console.log(this)
        curr = d3.select(this).attr("class")
      })
    d3.select(".storyBoard").selectAll("circle").on("click", function(data) {
        console.log(this)
        curr = d3.select(this).attr("class")

        //using to grouping
        var curCharacter = d3.select(this)
        var isSelectedCharacter = false
        selectedCharacter.forEach(function(character){
          character.attr("scenesNumber") 
          
          if(character.attr("class") == curCharacter.attr("class") && character.attr("scenesNumber") == curCharacter.attr("scenesNumber")) {
            isSelectedCharacter = true
          }
        })

        if(isSelectedCharacter == false) {
          console.log(curCharacter.attr("class"))
          selectedCharacter.push(curCharacter)
        }
       
        
      })
    d3.select(".storyBoard").selectAll("path").on("click", function(data) {
        console.log(this)
        curr = d3.select(this).attr("class")
      })
    d3.select(".panelBar").selectAll("#lineWidth").on("click", function(data) {
        temp1 = document.getElementById("lineWidth")
        lineWidth = temp1.value
        changeWidth(lineWidth);
      })
    d3.select(".panelBar").selectAll("#lineOpacity").on("click", function(data) {
        temp2 = document.getElementById("lineOpacity")
        lineOpacity = temp2.value
        changeOpacity(lineOpacity);
      })

  })
}

function changeColor(picker) {
  d3.selectAll("rect").selectAll(function(){
      if(d3.select(this).attr("class") == curr){
        d3.select(this).attr("fill", '#' + picker.toString())
      }
    })
    d3.selectAll("circle").selectAll(function(){
      if(d3.select(this).attr("class") == curr){
        d3.select(this).attr("fill", '#' + picker.toString())
      }
    })
    d3.selectAll("path").selectAll(function(){
      if(d3.select(this).attr("class") == curr){
        d3.select(this).style("stroke", '#' + picker.toString())
      }
    })
}

function changeWidth(lineWidth) {
  d3.selectAll("path").selectAll(function(){
    if(d3.select(this).attr("class") == curr){
      d3.select(this).style("stroke-width", parseInt(lineWidth))
    }
  })
}

function changeOpacity(lineOpacity) {
  d3.selectAll("path").selectAll(function(){
    if(d3.select(this).attr("class") == curr){
      d3.select(this).style("stroke-opacity", parseInt(lineOpacity))
    }
  })
}

function elementState(element_class,op){
d3.selectAll("circle").selectAll(function(){
  if(d3.select(this).attr("class") == element_class){
    d3.select(this).style("opacity", parseFloat(op))
  }
})
d3.selectAll("path").selectAll(function(){
  if(d3.select(this).attr("class") == element_class){
    d3.select(this).style("stroke-opacity", parseFloat(op))
  }
})
d3.selectAll("rect").selectAll(function(){
  if(d3.select(this).attr("class") == element_class){
    d3.select(this).style("opacity", parseFloat(op))
  }
})
d3.selectAll("text").selectAll(function(){
  if(d3.select(this).attr("class") == element_class){
    d3.select(this).style("opacity", parseFloat(op))
  }
})
}