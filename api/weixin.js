import http from '@/config/http'

function wxConfig(addr) {
  return new Promise((resolve, reject) => {
    http.request({
      method: 'get',
      url: 'site/agency_get_package',
      data: {
        addr
      },
    })
      .then(res => {
        const sign_package = res && res.sign_package
        sign_package ? resolve(JSON.parse(sign_package)) : reject()
      })
      .catch(reject)
  })
}
function getOpenid(code) {
  return http.request({
    method: 'get',
    url: `site/agency_get_openid?code=${code}`
  })
}

export {
  wxConfig,
  getOpenid
}

function generateGetUrl (url, obj = {}) {
  if (!isJson(obj)) return ''
  return `${url}?${Object.entries(obj).map(item => item.join('=')).join('&')}`
}

function isJson (obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
}
