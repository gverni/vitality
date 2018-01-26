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
    svgElem.setAttribute('width', this.size)
    svgElem.setAttribute('height', this.size + 10) // +10 for caption margin 
    svgElem.setAttribute('viewBox', '0 -10 ' + this.size + ' ' + this.size)
    svgElem.setAttribute('preserveAspectRatio','xMidYMin meet')

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
      var rewardIconHref = document.createElementNS('http://www.w3.org/2000/svg', 'a')
      rewardIconHref.setAttribute('href', 'https://member.vitality.co.uk/PartnersRewards/f/freecinematickets')
      rewardIconHref.setAttribute('target', '_blank')
      rewardIconHref.appendChild(rewardIconElem)
      svgElem.appendChild(rewardIconHref)
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
