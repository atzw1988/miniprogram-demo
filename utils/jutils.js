const api = require('./api.js')
const { set } = require('../utils/storage.js')
const moment = require('./moment.js')

function getTimeInterval (st, et) {
  let timeLeft = ['00', '00', '00']
  let timeStr = ''
  let ts = (et > st) ? parseInt((et - st) / 1000) : 0
  // console.log(ts)
  timeLeft[0] = (ts > 3600) ? parseInt(ts / 3600) : '00'
  ts = ts - timeLeft[0] * 3600
  timeLeft[1] = (ts > 60) ? parseInt(ts / 60) : 0
  timeLeft[1] = timeLeft[1] < 10 ? ('0' + timeLeft[1]) : timeLeft[1]
  timeLeft[2] = ts - timeLeft[1] * 60
  timeLeft[2] = timeLeft[2] < 10 ? ('0' + timeLeft[2]) : timeLeft[2]
  timeStr = timeLeft[0] + ':' + timeLeft[1] + ':' + timeLeft[2]
  return timeStr
}

//计算两个点距离
function getDis (lat1, lng1, lat2, lng2) {
  let radLat1 = lat1 * Math.PI / 180.0
  let radLat2 = lat2 * Math.PI / 180.0
  let a = radLat1 - radLat2
  let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * 6378.137
  return s
}

// 图片压缩
function imageSizeIsLessLimitSize(imagePath, limitSize, lessCallBack, moreCallBack) {
  wx.getFileInfo({
    filePath: imagePath,
    success(res) {
      console.log("压缩前图片大小:", res.size / 1024, 'kb');
      if (res.size > 1024 * 1024 * limitSize) {
        moreCallBack();
      } else {
        lessCallBack();
      }
    }
  })
}
function getLessLimitSizeImage(canvasId, imagePath, limitSize = 1, drawWidth, callBack) {
  console.log(getApp().globalData.systemInfo);
  imageSizeIsLessLimitSize(imagePath, limitSize,
    (lessRes) => {
      callBack(imagePath);
    },
    (moreRes) => {
      wx.getImageInfo({
        src: imagePath,
        success: function (imageInfo) {
          var maxSide = Math.max(imageInfo.width, imageInfo.height);
          //画板的宽高默认是windowWidth
          var windowW = drawWidth;
          var scale = 1;
          if (maxSide > windowW) {
            scale = windowW / maxSide;
          }
          var imageW = Math.floor(imageInfo.width * scale);
          var imageH = Math.floor(imageInfo.height * scale);
          console.log('调用压缩', imageW, imageH);
          getCanvasImage(canvasId, imagePath, imageW, imageH,
            (pressImgPath) => {
              getLessLimitSizeImage(canvasId, pressImgPath, limitSize, drawWidth * 0.7, callBack);
            }
          );
        }
      })
    }
  )
}
function getCanvasImage(canvasId, imagePath, imageW, imageH, getImgsuccess) {
  const ctx = wx.createCanvasContext(canvasId);
  ctx.drawImage(imagePath, 0, 0, imageW, imageH);
  ctx.draw(false, () => {
    wx.canvasToTempFilePath({
      canvasId: canvasId,
      x: 0,
      y: 0,
      width: imageW,
      height: imageH,
      quality: 1,
      success(res) {
        getImgsuccess(res.tempFilePath);
      }
    });
  });
}


module.exports = {
  getTimeInterval,
  getDis,
  getLessLimitSizeImage
}