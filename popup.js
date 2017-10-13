const urlStatement = 'https://member.vitality.co.uk/mvc/MyPoints/GetEventListByCategory?selectedIndexValue=&month=&member=&year=0'

document.addEventListener('DOMContentLoaded', function() {
    
	chrome.tabs.executeScript({
		code: '(function () {return document.getElementById("membershipnumberlabel").textContent})()' 
	}, function (result) {
		console.log(result) 
		var elOutput = document.getElementById('output')
		var xhr = new XMLHttpRequest()
	    xhr.open('GET', urlStatement.replace('&member=', '&member=' + result ), true)
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				elOutput.innerHTML = xhr.response
			}
		}
		xhr.send()
		
	})
   
});
