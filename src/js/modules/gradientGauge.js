function gradientGauge (size) {

	/* Constructor */ 
	this.size = size 

	/* Public */ 
	this.numBars = 80 
	this.animationStartDelay = 1000
	this.animationSpeedStart = 1
	this.animationSpeedStop = 60
	this.points = 0 
	
	/* "Private" */ 
	var animationProgress = 0
	var svgObj = document.createElementNS("http://www.w3.org/2000/svg", "svg")
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
		svgObj.setAttribute("id", "pippo") 
		svgObj.setAttribute("version", "1.1") 
		svgObj.setAttribute("xmlns", "http://www.w3.org/2000/svg") 
		svgObj.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink")
		svgObj.setAttribute("x", "0px")
		svgObj.setAttribute("y", "0px")
		svgObj.setAttribute("width", this.size)
		svgObj.setAttribute("height", this.size)
		svgObj.setAttribute("viewBox", "0 0 " + this.size + " " + this.size)
		svgObj.setAttribute("enable-background", "new 0 0 " + this.size + " " + this.size)
		svgObj.setAttribute("xml:space","preserve")
		
		var outerCircleObj = document.createElementNS("http://www.w3.org/2000/svg", "circle")
		outerCircleObj.setAttribute("cx", this.size / 2)
		outerCircleObj.setAttribute("cy", this.size / 2)
		outerCircleObj.setAttribute("r", this.size / 2)
		outerCircleObj.setAttribute("fill", "rgb(240, 240, 240)")
		svgObj.appendChild(outerCircleObj)
		
		for (let i=0; i < this.numBars; i++) {
			let lineObj = document.createElementNS("http://www.w3.org/2000/svg", "line")
			let color = "grey"
			lineObj.setAttribute("stroke", "rgb(256, 256, 256)")
			lineObj.setAttribute("stroke-width", "2")
			lineObj.setAttribute("x1",this.size / 2) // 100
			lineObj.setAttribute("y1", this.size / 40) // 5
			lineObj.setAttribute("x2", this.size / 2) // 100 
			lineObj.setAttribute("y2", this.size / 8) // 25 
			//lineObj.setAttribute("transform", "rotate(" + 360/this.numBars * i + ", 100, 100)")
			lineObj.setAttribute("transform", "rotate(" + 360/this.numBars * i + ", " + this.size / 2 + ", " + this.size / 2 + ")")
			svgObj.appendChild(lineObj)
		}

		domElement.appendChild(svgObj)
	
	}
	
	function animateGauge() {
		
		logGauge("animateGauge step " + animationProgress + " of " + this.points)
		svgObj.children[animationProgress + 1].setAttribute("stroke", arGradient[animationProgress].toHexString() )
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