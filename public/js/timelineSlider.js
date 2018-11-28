

function createTimelineSlider() {	

	sliderSvgContainer.append('line')
				.attr('x1', getScenesXCoordinate(1) - 10)
				.attr('x2', getScenesXCoordinate(largestScenseCount) + 10)
				.attr('y1', 10)
				.attr('y2', 10)
				.attr('class', 'timeline')
				.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    			.attr("class", "timeline-inset")
				.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    			.attr("class", "timeline-overlay")
    			.call(d3.drag()
    					.on("start", dragTimelineStarted)
    					.on("drag", draggedTimeline)
    					.on("end", dragTimelineended))
    			.on("click", function(data){
    				var point = d3.mouse(this);
    				sliderSvgContainer.select(".handle").attr("cx", point[0]);
    				extensionRestart(point[0]);
    			});


	sliderSvgContainer.insert("circle",".timeline-overlay")
            .attr("cx", getScenesXCoordinate(1) - 10)
            .attr("cy", 10)
            .attr("r",10)
            .attr('class', "handle")
}

function dragTimelineStarted() {
    d3.event.subject.active = true;
}

function draggedTimeline(d) {
	var moveX =  d3.event.x;
	if (moveX < getScenesXCoordinate(1)) {
		moveX = getScenesXCoordinate(1);
	} else if(moveX > getScenesXCoordinate(largestScenseCount)) {
		moveX = getScenesXCoordinate(largestScenseCount);
	}

	sliderSvgContainer.select(".handle").attr("cx", moveX);
	extensionRestart(moveX);
}

function extensionRestart(newX) {
	if(currentScene != parseInt((newX - getScenesXCoordinate(1)) / scenesLen)) {
		//console.log(document.getElementById('ext').contentWindow.circle_r)
		currentScene = parseInt((newX - getScenesXCoordinate(1)) / scenesLen);
		document.getElementById('ext').contentWindow.restart(currentScene + 1)
	}
}

function dragTimelineended() {
    d3.event.subject.active = false;
}

