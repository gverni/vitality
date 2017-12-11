function gradientBar (startPosX, startPosY, maxPoints) {
	
	this.maxPoints = maxPoints
	this.startPosX = startPosX
	this.startPosY = startPosY
	var barNo = 0 
	var arGradient = tinygradient([
		{r: 255, g: 90, b: 205},
		{r: 251, g: 218, b: 97}
	]).rgb(this.maxPoints)

	this.generateBar = function (points) {
		
		let weeklyPoints = getWeeklypoints(thisWeekNo-barNo)
		let barElem = document.createElementNS("http://www.w3.org/2000/svg", "line")
		barElem.setAttribute("stroke", arGradient[0].toHexString())
		barElem.setAttribute("stroke-width", "4")
		barElem.setAttribute("x1", startPosX + barNo * 10 + 2) 
		barElem.setAttribute("y1", this.startPosY) 
		barElem.setAttribute("x2", startPosX + barNo * 10 + 2) 
		barElem.setAttribute("y2", this.startPosY) 
		let animateElem = document.createElementNS("http://www.w3.org/2000/svg", "animate")
		animateElem.setAttribute("attributeType", "XML")
		animateElem.setAttribute("attributeName", "y1")
		animateElem.setAttribute("from", this.startPosY)
		animateElem.setAttribute("to", this.startPosY - points) 
		animateElem.setAttribute("dur", "2s") 
		animateElem.setAttribute("repeatCount", "0") 
		animateElem.setAttribute("begin", ((barNo * 100) + 1000) + "ms") 
		animateElem.setAttribute("fill", "freeze") 
		let animateColor = document.createElementNS("http://www.w3.org/2000/svg", "animate")
		animateColor.setAttribute("attributeType", "XML")
		animateColor.setAttribute("attributeName", "stroke")
		animateColor.setAttribute("from", arGradient[0].toHexString())
		animateColor.setAttribute("to", arGradient[points-1].toHexString()) 
		animateColor.setAttribute("dur", "2s") 
		animateColor.setAttribute("repeatCount", "0") 
		animateColor.setAttribute("begin", ((barNo * 100) + 1000) + "ms") 
		animateColor.setAttribute("fill", "freeze") 
		
		barElem.appendChild(animateElem)
		barElem.appendChild(animateColor)
		barNo++
		return barElem
		
	}
	
	this.resetBarCount = function () {
		barNo = 0		
	}
	
}


/* 

<line stroke="rgb(255, 130, 182)" stroke-width="4" x1="2" y1="72" x2="2" y2="72"><animate attributeType="XML" attributeName="y1" from="72" to="32" dur="2s" repeatCount="0" begin="1000ms" fill="freeze">
</animate>
		  <animate attributeType="XML" attributeName="stroke" from="rgb(255, 130, 182)" to="rgb(251, 218, 97)" dur="2s" repeatCount="0" begin="1000ms" fill="freeze"> 
      
		</line



*/ 