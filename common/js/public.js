function $showToast(obj) {
  return new Promise(resolve => {
    const baseObj = {
      icon: 'none',
      duration: 2000
    }
    
    uni.showToast(Object.assign(baseObj, obj))
    setTimeout(resolve, baseObj.duration)
  })
}

function $setTitle(title) {
  // ifdef H5
  document.title = title
  // endif
}



export default {
  $showToast,
  
  $setTitle
}