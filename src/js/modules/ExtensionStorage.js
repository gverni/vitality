var ExtensionStorage = function () {
  this.getData = function () {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get(null, function (items) {
        if (chrome.runtime.lastError) { reject(chrome.runtime.lastError) }
        resolve(items)
      })
    })
  }

  this.setData = function (items) {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.set(items, function () {
        resolve()
      })
    })
  }
}

window.extensionStorage = new ExtensionStorage()
