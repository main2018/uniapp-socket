export * from './chat.js'

export function generateGetUrl (url, obj = {}) {
  if (!isJson(obj)) return ''
  return `${url}?${Object.entries(obj).map(item => item.join('=')).join('&')}`
}

function isJson (obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
}
