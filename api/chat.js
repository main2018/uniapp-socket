import http from '@/config/http'
import {generateGetUrl} from './index'

/**
 * 聊天记录
 * @params {openid: 当前用户openid, mid: 置业顾问mid, terminal: 1 房产 2 房源}
 */
function getChatHistory(isH5) {
  const classname = isH5 ? 'ClientChat' : 'ConsultantChat'
  if (isH5) return Promise.reject()
  
  return http.request({
    method: 'get',
    url: generateGetUrl(`site/client_list`, {classname})
  })
}

/**
 * 聊天数据列表
 * @params {openid: 当前用户openid, mid: 置业顾问mid, terminal: 1 房产 2 房源}
 */
function getChatList(openid, cid = 6, page = 0, mu, sf, at) {
  const classname = openid ? 'ClientChat' : 'ConsultantChat'
  const terminal = openid ? 2 : ''
  const baseData = {page, classname}
  
  return http.request({
    method: 'get',
    url: generateGetUrl(`site/chat_list`, openid ? {...baseData, mu, sf, at, openid, terminal} : {...baseData, cid})
  })
}

// 绑定openid
function bindOpenid(client_id, openid) {
  const classname = openid ? 'ClientChat' : 'ConsultantChat'
  const baseData = {
    client_id,
    classname
  }
  return http.request({
    method: 'post',
    url: 'site/bind_chat',
    data: openid ? {...baseData, openid} : baseData
  })
}

/**
 * 发送消息
 * @params {openid: 当前用户openid, mid: 置业顾问mid, terminal: 1 房产 2 房源}
 */
function sendMsg(cid, did, content, mu, terminal = 2) {
  const classname = mu ? 'ClientChat' : 'ConsultantChat'
  content = content.trim()
  if (!content) {
    uni.showToast({
      title: '信息不能为空',
      icon: 'none'
    })
    return Promise.reject()
  }
  
  const baseData = {
    cid,
    did,
    content,
    classname
  }
  return new Promise((resolve, reject) => {
    http.request({
      method: 'post',
      url: 'site/send',
      data: mu ? Object.assign({mu, terminal}, baseData) : baseData
    })
      .then(resolve)
      .catch(() => {
        uni.showToast({
          title: '消息发送失败',
          icon: 'none'
        })
        reject()
      })
  })
}

function chatClose(cid, mu) {
  const classname = mu ? 'ClientChat' : 'ConsultantChat'
  const baseData = {cid, classname}
  
  return http.request({
    method: 'put',
    url: generateGetUrl(`site/chat_close`, mu ? {...baseData, mu} : baseData)
  })
}

export {
  getChatHistory,
  getChatList,
  bindOpenid,
  sendMsg,
  chatClose,
}