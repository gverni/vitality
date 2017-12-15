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

}

function fetchStatement() {

			var xhrFetchData = new XMLHttpRequest()
			xhrFetchData.open('GET', urlStatement, true)
			xhrFetchData.onreadystatechange = function () {
				if (xhrFetchData.readyState === 4) {
					if (xhrFetchData.status === 200) {
						convertRecordsToObj(xhrFetchData.response)
						document.getElementById("userName").innerHTML  = Object.getOwnPropertyNames(objPoints)[0]
						document.getElementById("spinner").setAttribute("visibility", "hidden")
						
						bigGauge.startAnimation(getWeeklypoints(thisWeekNo) * 2)
						// TODO: Handle first week of the year 
						smallGauge.startAnimation(getWeeklypoints(thisWeekNo-1) * 2) 
						
						// Build past week graph
						let groupElem = animateElem = document.createElementNS("http://www.w3.org/2000/svg", "g")
						pastGraphBars = new gradientBar(0, 72, 40)
						pastGraphBars.animationStartDelay = 2000
						for (let barNo = 0; barNo < 30; barNo++) {
								
							groupElem.appendChild(pastGraphBars.generateBar(getWeeklypoints(thisWeekNo - barNo)))
									
						}
						document.getElementById("pastGraph").appendChild(groupElem)
					} else {
						document.getElementById("nameBaloonSvg").children[1].innerHTML = "Demo"
						document.getElementById("notifications").innerHTML = '<p>You are not logged into Vitality. Use the button below to open the login page.</p><p><a href="https://member.vitality.co.uk/Login" target="_blank" class="btn-pay-now"><span>LOG IN</span></a>'
						bigGauge.startAnimation(70)
						smallGauge.startAnimation(45) 
					
					}
					
				}
			}
			xhrFetchData.send()
	
}

function showModal() {

	var modal = document.getElementById('myModal');
	modal.style.display = "block"

}

function closeModal() {
	
	modal.style.display = "none";
	
}

function logIn() {
	
	var xhrLogin = new XMLHttpRequest()
	xhrLogin.open('POST', "https://member.vitality.co.uk/mvc/LogOn/LogOnUser?Username=****", true)
	xhrLogin.setRequestHeader("Content-type", "application/json;charset=UTF-8")
	xhrLogin.onreadystatechange = function () {
		if (xhrLogin.readyState === 4) {
			fetchStatement()
		}
	}
	xhrLogin.send('{UserName: "****", Password: "****", RememberMe: false, RedirectToItemPath: "/"}')
	
}


var bigGauge = new gradientGauge(190)
bigGauge.animationStartDelay = 300 // Delay needed because otherwise Pain event is not called everytime the interval event is fired 
bigGauge.buildGauge(document.getElementById("bigGauge"))

var smallGauge = new gradientGauge(100)
smallGauge.animationStartDelay = 500  
smallGauge.buildGauge(document.getElementById("smallGauge"))



showModal()


// logIn()

