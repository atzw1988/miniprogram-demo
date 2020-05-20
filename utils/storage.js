const dTime = '_deadtime'
function set (key, value, time) {
  wx.setStorageSync(key, value)
  const seconds = parseInt(time)
  if (seconds > 0) {
    let timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000 + seconds
    wx.setStorageSync(key + dTime, timestamp + '')
  } else {
    wx.removeStorageSync(key + dTime)   
  }
}

function get (key, def) {
  const deadtime = parseInt(wx.getStorageSync(key + dTime))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) {
        return def
      } else {
        return
      }
    }
  }
  const res = wx.getStorageSync(key) 
  if (res) {
    return res
  } else {
    return def
  }
}

function remove (key) {
  wx.removeStorageSync(key)
  wx.removeStorageSync(key + dTime)
}

function clear () {
  wx.clearStorageSync()
}

module.exports = {
  set: set,
  get: get,
  remove: remove,
  clear: clear
}