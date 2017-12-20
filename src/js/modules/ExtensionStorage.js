var ExtensionStorage = function () {
//  var storageObj = undefined // Chrome Storage object
//  var fetching = false // Fetching variable. If true fetching is on-going

  this.getData = function () {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get(null, function (items) {
        if (chrome.runtime.lastError) { reject(chrome.runtime.lastError) }
        resolve(items)
      })
    })
  }
  //
  // storagePromisedGet().then(function (items) {
  //     console.log("then promise")
  //     return items
  // }, function (error) {
  //     console.log("error promise")
  //     return { 'error': error }
  //   })
  // }

  // this.getData = function _getData() {
  //   if (fetching) {
  //     // Set a timer and retry
  //     setTimeout(_getData, 100)
  //   } else if (!storageObj) {
  //     // we need to fetch it
  //   }
  // }

  this.setData = function () {
    // Set data
  }
}

window.extensionStorage = new ExtensionStorage()
