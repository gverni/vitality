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

function createWeekStats(weekNo) {
	
	var tmpDiv = document.createElement('DIV')
	Object.getOwnPropertyNames(objPoints).forEach( function (key) {
		var totWeek = objPoints[key][weekNo].reduce( function (a, b) { return { Points: a['Points'] + b['Points'] }} )['Points']
		var newP = document.createElement('P') 
		tmpDiv.appendChild(newP) 
		newP.innerHTML = key + ": week " + weekNo + ": " + totWeek + " point(s)"
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

}

document.addEventListener('DOMContentLoaded', function() {
    
	chrome.tabs.executeScript({
		code: '(function () {return document.getElementById("membershipnumberlabel").textContent})()' 
	}, function (result) {
		var elOutput = document.getElementById('output')
		var xhr = new XMLHttpRequest()
		xhr.open('GET', urlStatement.replace('&member=', '&member=' + result ), true)
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				convertRecordsToObj(xhr.response) 
				elOutput.appendChild(createWeekStats(thisWeekNo))
				console.log(objPoints)
			}
		}
		xhr.send()
		
	})
   
});
