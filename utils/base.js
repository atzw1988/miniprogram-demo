const { $Toast, $Message } = require('../dist/base/index.js')

function sM (text) {
  $Message({
    content: text,
    type: 'success'
  })
}
function dM(text) {
  $Message({
    content: text
  })
}
function eM(text) {
  $Message({
    content: text,
    type: 'error'
  })
}
function wM(text) {
  $Message({
    content: text,
    type: 'warning'
  })
}
function dT (text) {
  $Toast({
    content: text
  })
}
function sT(text) {
  $Toast({
    content: text,
    type: 'success'
  })
}
function wT(text) {
  $Toast({
    content: text,
    type: 'warning'
  })
}
function eT(text) {
  $Toast({
    content: text,
    type: 'error'
  })
}
function lT(text) {
  $Toast({
    content: text,
    type: 'loading'
  })
}
function iT(text, img) {
  $Toast({
    content: text,
    image: img
  })
}
function mT(text, time) {
  $Toast({
    content: text,
    icon: 'prompt',
    duration: 0,
    mask: false
  });
  setTimeout(() => {
    $Toast.hide();
  }, time)
}

module.exports = {
  sM,
  dM,
  eM,
  wM,
  dT,
  sT,
  wT,
  eT,
  lT,
  iT,
  mT
}