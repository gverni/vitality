function Vitality () {
  var vitalityInfo = {
    membershipNumber: '',
    fullName: '', /* This is the name of the user not the username */
    totalPoints: '',
    status: ''
  }
  var objPoints /* This is the point statement object */

    /* Login to Vitality */
  function LogIn (username, password) {

  }

    /* Update <info> itemt in cache */
  function updateCache (info) {
    extensionStorage.setData({'vitalityInfo': vitalityInfo})
  }

    /* Fetch all the data from cache */
  function fetchDataFromCache () {
    return new Promise((resolve, reject) => {
      extensionStorage.getData().then((items) => {
        if (items['vitalityInfo']) {
          vitalityInfo = items['vitalityInfo']
        }
        resolve()
      }).catch(() => {
        reject('Error accessing local storage')
      })
    })
  }

  /* Fetch total points and memebership status */
  function fetchStatusFromWeb () {
    httpRequestPromise('https://member.vitality.co.uk/mvc/vitalityglobal/RefreshHeaderData').then((data) => {
      var responseJSON = JSON.parse(data.response)
      vitalityInfo.totalPoints = responseJSON['VitalityPoints']
      vitalityInfo.status = responseJSON['VitalityPointsStatus']
    })
  }

  /* Fetch membership info from web */
  function fetchInfoFromWeb () {
    return new Promise(function (resolve, reject) {
      httpRequestPromise('https://member.vitality.co.uk').then(function (data) {
        var results = /<label id="membershipnumberlabel" class="per-info">([0-9]*)<\/label>/.exec(data.response)
        if (results) { vitalityInfo.membershipNumber = results[1] }
        // Fetch the fullName from the first page. It will be updated again with call below 
        results = /<a title="UserName".*?>(.*?)\s*?<\/a>/s.exec(data.response)
        if (results) {vitalityInfo.fullName = results[1]}
        httpRequestPromise('https://member.vitality.co.uk/mvc/vitalityglobal/RefreshHeaderData').then((data) => {
          var responseJSON = JSON.parse(data.response)
          vitalityInfo.fullName = responseJSON['FullName']
          vitalityInfo.totalPoints = responseJSON['VitalityPoints']
          vitalityInfo.status = responseJSON['VitalityPointsStatus']
          updateCache()
        })
        updateCache()
        resolve(vitalityInfo)
      })
    })
  }

    /* Fetch point statement from web */
  function fetchStatmentFromWeb () {

  }

  this.getMembershipNumber = function () {
    return new Promise((resolve, reject) => {
      if (!vitalityInfo.membershipNumber) {
        fetchDataFromCache().then(() => {
          if (!vitalityInfo.membershipNumber) {
            fetchInfoFromWeb().then(() => {
              resolve(vitalityInfo.membershipNumber)
            }).catch(() => {
              reject('Error fetching info from web')
            })
          } else {
            resolve(vitalityInfo.membershipNumber)
          }
        })
      } else {
        resolve(vitalityInfo.membershipNumber)
      }
    })
  }

  function getNameOfUser () {

  }

  ;(function init () {

  })()
}

window.vitality = new Vitality()
