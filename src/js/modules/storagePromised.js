function storagePromisedGet() {
	
	return new Promise(function (resolve, reject) {
		chrome.storage.sync.get(null, function(items) {
			if (chrome.runtime.lastError) { reject(chrome.runtime.lastError) }
			resolve(items)	
        })
	})
	
}