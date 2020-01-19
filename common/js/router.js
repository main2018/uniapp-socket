function $navigateTo(obj) {
  const baseObj = {
    animationType: 'pop-in',
    animationDuration: 200
  }
  uni.navigateTo(Object.assign(baseObj, obj));
}
function $navigateBack(obj = {}) {
  const baseObj = {
    delta: 1
    // animationType: 'pop-in',
    // animationDuration: 200
  }
  uni.navigateBack(Object.assign(baseObj, obj));
}

export default {
  $navigateTo,
  $navigateBack
}