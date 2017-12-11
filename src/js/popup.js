const urlStatement = 'https://member.vitality.co.uk/mvc/MyPoints/GetEventListByCategory?selectedIndexValue=&month=&member=&year=0'
var objPoints = {}

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {

  var date = new Date(this.getTime());
   date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

const thisWeekNo = (new Date()).getWeek()
const thisYear = (new Date()).getFullYear()

function getWeeklypoints(weekNo) {

	var totWeek = 0 

	// TODO: plot more than one user. Currently this is plotting only the first user  
	let user = Object.getOwnPropertyNames(objPoints)[0]
	if (objPoints[user].hasOwnProperty(weekNo)) {
		totWeek = objPoints[user][weekNo].reduce( function (a, b) { return { Points: a['Points'] + b['Points'] }} )['Points']
	} 

	console.log("Point for week " + weekNo + "= " + totWeek)
	return totWeek 

}

function createWeekStats(weekNo) {
	
	var tmpDiv = document.createElement('DIV')
	Object.getOwnPropertyNames(objPoints).forEach( function (user) {
		if (objPoints[user].hasOwnProperty(weekNo)) {
			var totWeek = objPoints[user][weekNo].reduce( function (a, b) { return { Points: a['Points'] + b['Points'] }} )['Points']
			var newP = document.createElement('P') 
			tmpDiv.appendChild(newP) 
			newP.innerHTML = user + ": week " + weekNo + ": " + totWeek + " point(s)"
		} else {
			var newP = document.createElement('P') 
			tmpDiv.appendChild(newP) 
			newP.innerHTML = user + ": week " + weekNo + ": 0 point(s)"
		}
	})

	return tmpDiv
}

function convertRecordsToObj ( strDOM ) {

	var elTmp = document.createElement('DIV') // Using a temporary DOM element to query results
	elTmp.innerHTML = strDOM 
	var elDates = elTmp.querySelectorAll('.date')
	var elFirstNames = elTmp.querySelectorAll('.firstname')
	var elPoints = elTmp.querySelectorAll('.points')
	elDates.forEach( function (elDate, index) {
		var dateWeekNo = (new Date(elDate.textContent + " " + thisYear)).getWeek()
		var firstName =  elFirstNames[index].textContent
		if (!objPoints.hasOwnProperty(firstName)) { objPoints[firstName] = {} }
		if (!objPoints[firstName].hasOwnProperty(dateWeekNo)) { objPoints[firstName][dateWeekNo] = [] }		
		if  (elPoints[index].textContent !== '0') {
			objPoints[firstName][dateWeekNo].push({ Name: firstName, Date: elDate.textContent + ' ' + thisYear, WeekNo: parseInt(dateWeekNo), Points: parseInt(elPoints[index].textContent) })
		}
	})
	console.log(objPoints)

}


document.addEventListener('DOMContentLoaded', function() {
    
	chrome.tabs.executeScript({
		code: '(function () {return document.getElementById("membershipnumberlabel").textContent})()' 
	}, function (result) {
		var xhr = new XMLHttpRequest()
		xhr.open('GET', urlStatement.replace('&member=', '&member=' + result ), true)
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					convertRecordsToObj(xhr.response)
					document.getElementById("nameBaloonSvg").children[1].innerHTML  = Object.getOwnPropertyNames(objPoints)[0]
					bigGauge.startAnimation(getWeeklypoints(thisWeekNo) * 2)
					// TODO: Handle first week of the year 
					smallGauge.startAnimation(getWeeklypoints(thisWeekNo-1) * 2) 
					
					// Build past week graph
					let pastWeekGraphSvg = document.getElementById("pastGraph") 
					var bootomGraphInterval = setInterval(function() {
							let barNo = document.getElementById("pastGraph").querySelectorAll("line").length
							if ( barNo < 30 ) {
								
								let weeklyPoints = getWeeklypoints(thisWeekNo-barNo)
															
								let barElem = document.createElementNS("http://www.w3.org/2000/svg", "line")
								barElem.setAttribute("stroke", "rgb(255, 130, 182)")
								barElem.setAttribute("stroke-width", "4")
								barElem.setAttribute("x1", barNo * 10 + 2) 
								barElem.setAttribute("y1", 72 - weeklyPoints) 
								barElem.setAttribute("x2", barNo * 10 + 2) 
								barElem.setAttribute("y2", 72) 
								let animateElem = document.createElementNS("http://www.w3.org/2000/svg", "animate")
								/* animateElem.setAttributeNS("http://www.w3.org/2000/svg", "attributeType", "XML")
								animateElem.setAttributeNS("http://www.w3.org/2000/svg", "attributeName", "y1")
								animateElem.setAttributeNS("http://www.w3.org/2000/svg", "from", "71")
								animateElem.setAttributeNS("http://www.w3.org/2000/svg", "to", 72 - getWeeklypoints(thisWeekNo-barNo)) 
								animateElem.setAttributeNS("http://www.w3.org/2000/svg", "dur", "2s") 
								animateElem.setAttributeNS("http://www.w3.org/2000/svg", "repeatCount", "1") */ 
								animateElem.setAttribute("attributeType", "XML")
								animateElem.setAttribute("attributeName", "y1")
								animateElem.setAttribute("from", "71")
								animateElem.setAttribute("to", 72 - weeklyPoints) 
								animateElem.setAttribute("dur", "4s") 
								animateElem.setAttribute("repeatCount", "0") 
								animateElem.setAttribute("begin", (barNo) + "s") 
								
								barElem.appendChild(animateElem)
								document.getElementById("pastGraph").appendChild(barElem)
								
							} else {
								clearInterval(bootomGraphInterval)
							}

					}, 100)
									
				} else {
					document.getElementById("nameBaloonSvg").children[1].innerHTML = "Demo"
					document.getElementById("notifications").innerHTML = '<p>You are not logged into Vitality. Use the button below to open the login page.</p><p><a href="https://member.vitality.co.uk/Login" target="_blank" class="btn-pay-now"><span>LOG IN</span></a>'
					bigGauge.startAnimation(70)
					smallGauge.startAnimation(45) 
					
				}

			}
		}
		xhr.send()
		
	})
   
});

	var bigGauge = new gradientGauge(190)
	bigGauge.buildGauge(document.getElementById("bigGauge"))
	
	var smallGauge = new gradientGauge(100)
	smallGauge.buildGauge(document.getElementById("smallGauge"))


