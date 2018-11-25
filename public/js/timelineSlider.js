function createTimelineSlider() {	

	sliderSvgContainer.append('line')
				.attr('x1', getScenesXCoordinate(1) - 10)
				.attr('x2', getScenesXCoordinate(largestScenseCount) + 10)
				.attr('y1', 15)
				.attr('y2', 15)
				.attr('class', 'timeline')
				.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    			.attr("class", "timeline-inset")
				.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    			.attr("class", "timeline-overlay")
    			.call(d3.drag()
    					.on("start", dragTimelineStarted)
    					.on("drag", draggedTimeline)
    					.on("end", dragTimelineended));


	sliderSvgContainer.insert("circle",".timeline-overlay")
            .attr("cx", getScenesXCoordinate(1) - 10)
            .attr("cy", 15)
            .attr("r",9)
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
}

function dragTimelineended() {
    d3.event.subject.active = false;
}

