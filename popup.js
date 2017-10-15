const urlStatement = 'https://member.vitality.co.uk/mvc/MyPoints/GetEventListByCategory?selectedIndexValue=&month=&member=&year=0'
var arrPoints = []  // Array that holds all the non-zero points in the statement 

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

function convertRecordsToObj ( strDOM ) {

	var elTmp = document.createElement('DIV') // Using a temporary DOM element to query results
	elTmp.innerHTML = strDOM 
	var elDates = elTmp.querySelectorAll('.date')
	var elFirstNames = elTmp.querySelectorAll('.firstname')
	var elPoints = elTmp.querySelectorAll('.points')
	elDates.forEach( function (elDate, index) {
		var elDateWeekNo = (new Date(elDate.textContent + " " + thisYear)).getWeek() 
		if  (elPoints[index].textContent !== '0') {
			arrPoints.push( { Name: elFirstNames[index].textContent, Date: elDate.textContent, WeekNo: parseInt(elDateWeekNo), Points: parseInt(elPoints[index].textContent) } )
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
				elOutput.innerHTML = "Done!"
				console.log(arrPoints)
			}
		}
		xhr.send()
		
	})
   
});
