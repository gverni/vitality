function gradientGauge (size) {

	/* Constructor */ 
	this.size = size 

	/* Public */ 
	this.numBars = 80 
	this.animationStartDelay = 1
	this.animationSpeedStart = 1
	this.animationSpeedStop = 60
	this.points = 0 
	
	/* "Private" */ 
	var animationProgress = 0
	var svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg")
	var arGradient = tinygradient([
		{r: 255, g: 90, b: 205},
		{r: 251, g: 218, b: 97}
	]).rgb(this.numBars)
	
	/* Methods */ 
	function logGauge(logMessage)	{
		//console.log(logMessage)
	}
	
	this.buildGauge = function (domElement) {

		//svgOjb.setAttribute("id", this.svgId)
		svgElem.setAttribute("id", "pippo") 
		svgElem.setAttribute("version", "1.1") 
		svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg") 
		svgElem.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink")
		svgElem.setAttribute("x", "0px")
		svgElem.setAttribute("y", "0px")
		svgElem.setAttribute("width", this.size)
		svgElem.setAttribute("height", this.size)
		svgElem.setAttribute("viewBox", "0 0 " + this.size + " " + this.size)
		svgElem.setAttribute("xml:space","preserve")
		
		var outerCircleElem = document.createElementNS("http://www.w3.org/2000/svg", "circle")
		outerCircleElem.setAttribute("cx", this.size / 2)
		outerCircleElem.setAttribute("cy", this.size / 2)
		outerCircleElem.setAttribute("r", this.size / 2)
		outerCircleElem.setAttribute("fill", "rgb(240, 240, 240)")
		svgElem.appendChild(outerCircleElem)
		
		
		for (let i=0; i < this.numBars; i++) {
			let lineElem = document.createElementNS("http://www.w3.org/2000/svg", "line")
			let color = "grey"
			lineElem.setAttribute("stroke", "rgb(256, 256, 256)")
			lineElem.setAttribute("stroke-width", "2")
			lineElem.setAttribute("x1",this.size / 2) // 100
			lineElem.setAttribute("y1", this.size / 20) // 5
			lineElem.setAttribute("x2", this.size / 2) // 100 
			lineElem.setAttribute("y2", this.size / 8) // 25 
			//lineElem.setAttribute("transform", "rotate(" + 360/this.numBars * i + ", 100, 100)")
			lineElem.setAttribute("transform", "rotate(" + 360/this.numBars * i + ", " + this.size / 2 + ", " + this.size / 2 + ")")
			svgElem.appendChild(lineElem)
		} 

		var rewardIconElem = document.createElementNS("http://www.w3.org/2000/svg", "image")
		rewardIconElem.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "../images/coffecup_off.svg")
		rewardIconElem.setAttribute("height", this.size)
		rewardIconElem.setAttribute("width", this.size)
		rewardIconElem.setAttribute("x", (this.size - rewardIconElem.getAttribute("width")) / 2)
		rewardIconElem.setAttribute("y", (this.size - rewardIconElem.getAttribute("height")) / 2)
		// rewardIconElem.setAttribute("preserveAspectRatio", "")
		svgElem.appendChild(rewardIconElem)	
		
		domElement.appendChild(svgElem)
	
	}
	
	function animateGauge() {
		
		logGauge("animateGauge step " + animationProgress + " of " + this.points)
		svgElem.children[animationProgress + 1].setAttribute("stroke", arGradient[animationProgress].toHexString() )
		if (animationProgress === 26) {
			var rewardCircleElem = document.createElementNS("http://www.w3.org/2000/svg", "circle")
			rewardCircleElem.setAttribute("cx", this.size / 2)
			rewardCircleElem.setAttribute("cy", this.size / 2)
			rewardCircleElem.setAttribute("r", this.size / 5)
			rewardCircleElem.setAttribute("fill", "rgb(255, 255, 0)")
			svgElem.appendChild(rewardCircleElem)
			
			var rewardIconElem = document.createElementNS("http://www.w3.org/2000/svg", "image")
			rewardIconElem.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "../images/coffecup_on.svg")
			rewardIconElem.setAttribute("height", this.size)
			rewardIconElem.setAttribute("width", this.size)
			rewardIconElem.setAttribute("x", (this.size - rewardIconElem.getAttribute("width")) / 2)
			rewardIconElem.setAttribute("y", (this.size - rewardIconElem.getAttribute("height")) / 2)
			svgElem.appendChild(rewardIconElem)	

			
			/* rewardIconElem.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "../images/reward_on.jpg")
			rewardIconElem.innerHTML = '<animate attributeType="XML" attributeName="width" from="40" to="60" dur="2s" repeatCount="indefinite"/>' */
			

		}
		if (animationProgress <= this.points) {
			animationProgress++
			setTimeout(animateGauge.bind(this), this.animationSpeedStart + Math.floor((this.animationSpeedStop - this.animationSpeedStart) * animationProgress / this.points))
			logGauge(this.animationSpeedStart + Math.floor((this.animationSpeedStop - this.animationSpeedStart) * animationProgress / this.points))
		}

	}
	
	this.startAnimation = function (points) {
		this.points = points 
		logGauge("Start Animation for " + this.points + " delay " + this.animationStartDelay)
		setTimeout(animateGauge.bind(this), this.animationStartDelay);
	
	}
  
}