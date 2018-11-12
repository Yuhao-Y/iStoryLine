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
      })
    d3.select(".storyBoard").selectAll("path").on("click", function(data) {
        console.log(this)
        curr = d3.select(this).attr("class")
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