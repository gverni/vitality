
const urlStatement = 'https://member.vitality.co.uk/mvc/MyPoints/GetEventListByCategory?year=0&member='
var objPoints = {}

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
  var date = new Date(this.getTime())
  date.setHours(0, 0, 0, 0)
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4)
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 -
    3 + (week1.getDay() + 6) % 7) / 7)
}

const thisWeekNo = (new Date()).getWeek()

function httpRequestPromise (url) {
  return new Promise(function (resolve, reject) {
    var xhrFetchData = new XMLHttpRequest()
    xhrFetchData.open('GET', url, true)
    xhrFetchData.onreadystatechange = function () {
      if (xhrFetchData.readyState === 4) {
        if (xhrFetchData.status === 200) {
          resolve(xhrFetchData)
        } else {
          reject(xhrFetchData)
        }
      }
    }
    xhrFetchData.send()
  })
}

function getWeeklypoints (weekNo) {
  var totWeek = 0
  if (weekNo <= 0) {
    // WeekNo negative = go backwards to last year
    weekNo += 52
  }
// TODO: plot more than one user. Currently this is plotting only the first user
  let user = Object.getOwnPropertyNames(objPoints)[0]
  if (objPoints[user].hasOwnProperty(weekNo)) {
    totWeek = objPoints[user][weekNo].reduce(function (a, b) { return { Points: a['Points'] + b['Points'] } })['Points']
  }
  return totWeek
}

function convertRecordsToObj (strDOM) {
  var elTmp = document.createElement('DIV') // Using a temporary DOM element to query results
  elTmp.innerHTML = strDOM
  var elDates = elTmp.querySelectorAll('.date')
  var elFirstNames = elTmp.querySelectorAll('.firstname')
  var elPoints = elTmp.querySelectorAll('.points')
  elDates.forEach(function (elDate, index) {
    // Vitality page returns date without year. Calculate the year checking if applying current year makes the date in the future
    let fullDate = elDate.textContent + ((new Date(elDate.textContent + (new Date()).getFullYear()) > new Date()) ? (new Date()).getFullYear() - 1 : (new Date()).getFullYear())
    var dateWeekNo = (new Date(fullDate)).getWeek()
    var firstName = elFirstNames[index].textContent
    if (!objPoints.hasOwnProperty(firstName)) { objPoints[firstName] = {} }
    if (!objPoints[firstName].hasOwnProperty(dateWeekNo)) { objPoints[firstName][dateWeekNo] = [] }
    if ((parseInt(elPoints[index].textContent) > 0) && (parseInt(elPoints[index].textContent) <= 10)) {
      // We consider only points between 1 and 10. More than 10 are 
      // non-active points (e.g. health check)
      objPoints[firstName][dateWeekNo].push({ Name: firstName, Date: fullDate, WeekNo: parseInt(dateWeekNo), Points: parseInt(elPoints[index].textContent) })
    }
  })
}

function fetchTotalPoints () {
  httpRequestPromise('https://member.vitality.co.uk/mvc/vitalityglobal/RefreshHeaderData').then((data) => {
    var responseJSON = JSON.parse(data.response)
    document.getElementById('pointsTotal').innerHTML = responseJSON['VitalityPoints'] +
    ' <span style="font-size: 16px;">(' + responseJSON['VitalityPointsStatus'] + ')</span>'
  })
}

function fetchMembershipInfo () {
  return new Promise(function (resolve, reject) {
    httpRequestPromise('https://member.vitality.co.uk').then(function (data) {
      var results = /<label id="membershipnumberlabel" class="per-info">([0-9]*)<\/label>/.exec(data.response)
      if (results) {
        resolve(results[1])
      } else {
        reject('Membership number not found')
      }
    })
  })
}

function fetchStatement (memberNumber) {
  var xhrFetchData = new XMLHttpRequest()
  xhrFetchData.open('GET', urlStatement + memberNumber, true)
  xhrFetchData.onreadystatechange = function () {
    if (xhrFetchData.readyState === 4) {
      if (xhrFetchData.status === 200) {
        closeModal()
        convertRecordsToObj(xhrFetchData.response)
        document.getElementById('userName').innerHTML = Object.getOwnPropertyNames(objPoints)[0]
        document.getElementById('memberNumber').innerHTML = memberNumber
        ;(function autoFitName () {
          const maxWidth = 100
          var nameBox = document.getElementById('userName').getBBox()
          if (nameBox.width > maxWidth) {
            var ratio = maxWidth / nameBox.width
            var svgTransformMatrix = 'matrix(' + ratio + ' 0 0 ' + ratio + ' ' + (0 - nameBox.x) + ' ' + (nameBox.height * ratio / 2) + ' )'
            document.getElementById('userName').setAttribute('transform', svgTransformMatrix)
          }
        })()
        /* Hide the spinner to show the name */
        document.getElementById('spinner').setAttribute('visibility', 'hidden')

        /* Update the total points */ 
        fetchTotalPoints()

        /* Start gauges aninamtion */
        bigGauge.startAnimation(getWeeklypoints(thisWeekNo) * 2)
        smallGauge.startAnimation(getWeeklypoints(thisWeekNo - 1) * 2)

        // Build past week graph
        let groupElem = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        let pastGraphBars = new GradientBar(0, 28, 40)
        pastGraphBars.animationStartDelay = 2000
        for (let barNo = 0; barNo < 30; barNo++) {
          groupElem.appendChild(pastGraphBars.generateBar(getWeeklypoints(thisWeekNo - barNo)))
        }
        document.getElementById('pastGraph').appendChild(groupElem)
      } else {
        showModal()
      }
    }
  }
  xhrFetchData.send()
}

function showModal () {
  document.getElementById('myModal').style.display = 'block'
}

function closeModal () {
  document.getElementById('myModal').style.display = 'none'
}

function logIn (credentials) {
  var xhrLogin = new XMLHttpRequest()
  xhrLogin.open('POST', 'https://member.vitality.co.uk/mvc/LogOn/LogOnUser?Username=' + credentials['username'], true)
  xhrLogin.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
  xhrLogin.onreadystatechange = function () {
    if (xhrLogin.readyState === 4) {
      if (JSON.parse(xhrLogin.response)['Status'] === 200) {
        // Authenitcation suucesful. Save credentials
        if (document.getElementById('chkrememberme').checked) {
          extensionStorage.setData(credentials)
        }
        fetchMembershipInfo().then((memberNumber) => {
          fetchStatement(memberNumber)
        })
      } else {
        showModal()
      }
    }
  }
  xhrLogin.send('{UserName: "' + credentials['username'] + '", Password: "' + credentials['password'] + '", RememberMe: false, RedirectToItemPath: "/"}')
}

document.getElementsByClassName('modal-btn')[0].onclick = function () {
  if (document.getElementsByClassName('modal-password')[0].value && document.getElementsByClassName('modal-user')[0].value) {
    logIn({username: document.getElementsByClassName('modal-user')[0].value,
      password: document.getElementsByClassName('modal-password')[0].value,
      autologin: document.getElementById('autologin').checked
    })
    closeModal()
  }
}

var bigGauge = new GradientGauge(190)
// Delay needed because otherwise paint event is not called everytime the interval event is fired
bigGauge.animationStartDelay = 300
bigGauge.buildGauge(document.getElementById('bigGauge'))
bigGauge.setCaption('this week', '20%')

var smallGauge = new GradientGauge(100)
smallGauge.animationStartDelay = 500
smallGauge.buildGauge(document.getElementById('smallGauge'))
smallGauge.setCaption('last week', '55%')

document.getElementById('btn-close').onclick = function () { window.close() }
document.getElementById('btn-options').onclick = function () {
  window.close()
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage()
  } else {
    window.open(chrome.runtime.getURL('options.html'))
  }
}

extensionStorage.getData().then(function (items) {
  if (items['username'] && items['password'] && items['autologin']) {
    logIn(items)
  } else {
    showModal()
    if (items['username']) { document.getElementsByClassName('modal-user')[0].value = items['username'] }
    if (items['password']) { document.getElementsByClassName('modal-password')[0].value = items['password'] }
    if (items['autologin']) { document.getElementById('autologin').checked = true }
  }
}, function (error) {
  console.log('Storage error' + error)
})
