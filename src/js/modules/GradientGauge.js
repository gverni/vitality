// Using window.GradientBar to avoid eslint-standard error
window.GradientGauge = function (size) {
  /* Constructor */
  this.size = size

  /* Public */
  this.numBars = 80
  this.animationStartDelay = 1
  this.animationSpeedStart = 1
  this.animationSpeedStop = 60
  this.points = 0

  /* "Private" */
  var animationProgress = 1
  var svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  var arGradient = tinygradient([
    {r: 255, g: 90, b: 205},
    {r: 251, g: 218, b: 97}
  ]).rgb(this.numBars)
  var captionElem 

  /* Methods */
  function logGauge (logMessage) {
     // console.log(logMessage)
  }

  this.setCaption = function (text, offset) {
    captionElem.children[0].textContent = text
    captionElem.children[0].setAttribute('startOffset', offset)
  }

  function appendSVGElement (parent, stringTag, attributes, stringHTML) {
    var tmpElem = document.createElementNS('http://www.w3.org/2000/svg', stringTag)
    for (var key in attributes) {
      tmpElem.setAttribute(key, attributes[key])
    }
    tmpElem.innerHTML = stringHTML
    parent.appendChild(tmpElem)
    return tmpElem
  }
  // function matrix(scale, transX, transY ) {
  //   return 'matrix( ${scale} 0 0 ${scale} ${transX} ${transY})'
  // }
  this.buildGauge = function (domElement) {
    svgElem.setAttribute('version', '1.1')
    svgElem.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svgElem.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
   // svgElem.setAttribute('x', '0px')
    //svgElem.setAttribute('y', '0px')
    svgElem.setAttribute('width', this.size)
    svgElem.setAttribute('height', this.size + 10) // +10 for caption margin 
    svgElem.setAttribute('viewBox', '0 -10 ' + this.size + ' ' + this.size)
    //svgElem.setAttribute('xml:space', 'preserve')
    svgElem.setAttribute('preserveAspectRatio','xMidYMin meet')

    // var circleRatio = this.size / 200
    // appendSVGElement(svgElem, 'g', {}, '<text id="gaugeCaption" transform="translate(6 6)" font-family="Mukta Malar"><textPath xlink:href="#path0_fill" startOffset="58%"></textPath></text><use xlink:href="#path0_fill" fill="#F7F7F9" transform="' + matrix(circleRatio, 10 * circleRatio, 10 * circleRatio) + '"/>')
    // appendSVGElement(svgElem, 'g', {'filter': 'url(#filter0_f)'}, '<use xlink:href="#path1_fill" transform="' + matrix(circleRatio, 35 * circleRatio, 35 * circleRatio) + '" fill="#E0E0E0"/>')
    // appendSVGElement(svgElem, 'g', {}, '<use xlink:href="#path1_fill" transform="' + matrix(circleRatio, 35 * circleRatio, 35 * circleRatio) + '" fill="#FFFFFF"/>')
    // appendSVGElement(svgElem, 'defs', {}, '<filter id="filter0_f" filterUnits="userSpaceOnUse" x="' + 25 * circleRatio + '" y="' + 25 * circleRatio + '" width="' + 156 / 200 * this.size + '" height="' + 156 / 200 * this.size + '" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur"/></filter><path id="path0_fill" d="M 186 93C 186 144.362 144.362 186 93 186C 41.6375 186 0 144.362 0 93C 0 41.6375 41.6375 0 93 0C 144.362 0 186 41.6375 186 93Z"/><path id="path1_fill" d="M 136 68C 136 105.555 105.555 136 68 136C 30.4446 136 0 105.555 0 68C 0 30.4446 30.4446 0 68 0C 105.555 0 136 30.4446 136 68Z"/></defs>')
    var circlesElem = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    circlesElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '../images/cerchio.svg')
    circlesElem.setAttribute('height', this.size)
    circlesElem.setAttribute('width', this.size)
    circlesElem.setAttribute('x', (this.size - circlesElem.getAttribute('width')) / 2)
    circlesElem.setAttribute('y', (this.size - circlesElem.getAttribute('height')) / 2)
    svgElem.appendChild(circlesElem)

    // Caption
    const captionCircleRadius = (this.size / 2) * (1.05 + (0.015 * 200 / this.size)) 
    appendSVGElement(svgElem, 'defs', {}, '<path id="pathCircle' + this.size + '"  d="' + `M${(this.size / 2) - captionCircleRadius},${this.size/2} a${captionCircleRadius},${captionCircleRadius} 0 0 1 ${captionCircleRadius*2},0` + '"/>')
    captionElem = appendSVGElement(svgElem, 'text', {
      id: 'gaugeCaption',
      'font-family': 'Mukta Malar'
    }, '<textPath xlink:href="#pathCircle' + this.size + '" startOffset="20%"></textPath></text>')
    // appendSVGElement(svgElem, 'path', {stroke: "black", d: `M${(this.size / 2) - captionCircleRadius},${this.size/2} a${captionCircleRadius},${captionCircleRadius} 0 0 1 ${captionCircleRadius*2},0`},'')
    // var outerCircleElem = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    // outerCircleElem.setAttribute('cx', this.size / 2)
    // outerCircleElem.setAttribute('cy', this.size / 2)
    // outerCircleElem.setAttribute('r', this.size / 2)
    // outerCircleElem.setAttribute('fill', '#F7F7F9')
    // svgElem.appendChild(outerCircleElem)
    //
    // var innerShadowGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    // var innerShadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    //
    // // Inner circle = outer circle * 0.7311
    // var innerCircleElem = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    // outerCircleElem.setAttribute('cx', this.size * 0.7311 / 2)
    // outerCircleElem.setAttribute('cy', this.size * 0.7311 / 2)
    // outerCircleElem.setAttribute('r', this.size * 0.7311 / 2)
    // outerCircleElem.setAttribute('fill', '#FFFFFF')
    // svgElem.appendChild(innerCircleElem)

    for (let i = 0; i < this.numBars; i++) {
      let lineElem = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      lineElem.setAttribute('stroke', 'rgb(256, 256, 256)')
      lineElem.setAttribute('stroke-width', '2')
      lineElem.setAttribute('x1', this.size / 2) // 100
      lineElem.setAttribute('y1', (this.size / 2) / 9.3) // 5 =
      lineElem.setAttribute('x2', this.size / 2) // 100
      lineElem.setAttribute('y2', (this.size / 2) / 6.2) // 25
      lineElem.setAttribute('transform', 'rotate(' + 360 / this.numBars * i + ', ' + this.size / 2 + ', ' + this.size / 2 + ')')
      svgElem.appendChild(lineElem)
    }

    var rewardIconElem = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    rewardIconElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '../images/coffecup_off.svg')
    rewardIconElem.setAttribute('height', this.size)
    rewardIconElem.setAttribute('width', this.size)
    rewardIconElem.setAttribute('x', (this.size - rewardIconElem.getAttribute('width')) / 2)
    rewardIconElem.setAttribute('y', (this.size - rewardIconElem.getAttribute('height')) / 2)
    svgElem.appendChild(rewardIconElem)

    domElement.appendChild(svgElem)
  }

  function animateGauge () {
    logGauge('animateGauge step ' + animationProgress + ' of ' + this.points)
    var svgLines = svgElem.querySelectorAll('line')
    svgLines[ animationProgress - 1 ].setAttribute('stroke', arGradient[ animationProgress - 1 ].toHexString())
    if (animationProgress === 26) {
      var rewardCircleElem = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      rewardCircleElem.setAttribute('cx', this.size / 2)
      rewardCircleElem.setAttribute('cy', this.size / 2)
      rewardCircleElem.setAttribute('r', this.size / 5)
      rewardCircleElem.setAttribute('fill', '#FDF780')
      svgElem.appendChild(rewardCircleElem)

      var rewardIconElem = document.createElementNS('http://www.w3.org/2000/svg', 'image')
      rewardIconElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '../images/coffecup_on.svg')
      rewardIconElem.setAttribute('height', this.size)
      rewardIconElem.setAttribute('width', this.size)
      rewardIconElem.setAttribute('x', (this.size - rewardIconElem.getAttribute('width')) / 2)
      rewardIconElem.setAttribute('y', (this.size - rewardIconElem.getAttribute('height')) / 2)
      svgElem.appendChild(rewardIconElem)
    }
    if (animationProgress < this.points) {
      animationProgress++
      setTimeout(animateGauge.bind(this), this.animationSpeedStart + Math.floor((this.animationSpeedStop - this.animationSpeedStart) * animationProgress / this.points))
      logGauge(this.animationSpeedStart + Math.floor((this.animationSpeedStop - this.animationSpeedStart) * animationProgress / this.points))
    }
  }

  this.startAnimation = function (points) {
    if (points > 0) {
      this.points = points
      logGauge('Start Animation for ' + this.points + ' delay ' + this.animationStartDelay)
      setTimeout(animateGauge.bind(this), this.animationStartDelay)
    }
  }
}
