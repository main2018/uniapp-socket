// https://www.jianshu.com/p/203c9af4c3bf
import {getOpenid} from '@/api/weixin';

export default { 
  // 微信公众号授权
  wxAuthorize() {
    return new Promise(resolve => {
      if(!this.isWechat()) return resolve();
      
      let link = window.location.href;
      const code = this._getUrlParams('code');  // 地址解析
        
      // 已经授权登录过的就不用再授权了
      // if (store.state.token) return;
        
      // 如果拿到code，调用授权接口，没有拿到就跳转微信授权链接获取
      if (code) {
        // 调用后台接口，授权
        alert(`code:${code}`)
        // getOpenid(code).then(res => {
        //   const openid = res && res.openid
        //   resolve(openid)
        // })
      } else {
        let appid = 'wxcd56fa29c2da0f1b';
        let uri = encodeURIComponent(link);
        // alert('uri', uri)
        // let authURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${uri}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
        let authURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${uri}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
        // window.location.href = authURL;
        window.location.replace(authURL);
      }
    })
  },
  _getOpenidByCode(code) {
    // const code = '0114D7tR1TZ8J51M9twR1HGqtR14D7tX'
    let appid = 'wxcd56fa29c2da0f1b';
    const secret = '418b1735dde80f053dff7a4add5c77f0'
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
    // alert(url)
    // uni.request({
    //   method: 'get',
    //   url,
    //   success(res) {
    //     const res0 = (res && res.data) || {}
    //     const res1 = res || {}
    //     alert(JSON.stringify(res0))
    //     alert(JSON.stringify(res1))
    //   },
    //   fail(err) {
    //     alert(JSON.stringify(err || {}))
    //   }
    // })
    
    // var xhr = new XMLHttpRequest();
    
    // xhr.open('GET', url, true);
    // xhr.send(null);
    
    // xhr.onreadystatechange = function (e) {
    //   alert('onreadystatechange')
    //   if (xhr.readyState == 4 && xhr.status == 200) {
    //     console.log(xhr.responseText);
    //     alert(xhr.responseText)
    //   } else {
    //     alert(`Error ${xhr.status}`)
    //   }
    // };
    // location.href = url
  },
  _getUrlParams(key, url) {
    const paramsString = url || window.location.search
    const searchParams = new URLSearchParams(paramsString);
    return searchParams.get(key)
  },
  isWechat:function(){
    var ua = window.navigator.userAgent.toLowerCase();
    return ua.match(/micromessenger/i) == 'micromessenger';
  }
}