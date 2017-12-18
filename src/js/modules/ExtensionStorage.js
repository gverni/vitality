window.ExtensionStorage = function () {
  function storagePromisedGet () {
    console.log("created promise")
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get(null, function (items) {
        if (chrome.runtime.lastError) { reject(chrome.runtime.lastError) }
        resolve(items)
      })
    })
  }

  this.getData = function () {
    storagePromisedGet().then(function (items) {
      console.log("then promise")
      return items
    }, function (error) {
      console.log("error promise")
      return { 'error': error }
    })
  }

  this.setData = function () {
    // Set data
  }
}
