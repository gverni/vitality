
document.getElementById('btnSave').onclick = function () {
  extensionStorage.setData({autologin: document.getElementById('autologin').checked})
  window.close()
}

document.getElementById('btnForget').onclick = function () {
  extensionStorage.setData({username: '', password: ''}).then(function () {
    window.alert('Credentials deleted!')
  })
}

extensionStorage.getData().then(function (items) {
  console.log(JSON.stringify(items))
  document.getElementById('autologin').checked = items['autologin']
}, function (error) {
  console.log(error)
})
