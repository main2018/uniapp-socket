const jweixin = require('jweixin-module');

// console.log('jweixin', jweixin)

import {wxConfig} from '@/api/weixin';

export default {
  //判断是否在微信中
  isWechat:function(){
    var ua = window.navigator.userAgent.toLowerCase();
    return ua.match(/micromessenger/i) == 'micromessenger';
  },  
      //初始化sdk配置  
  initJssdk: async function(url){
    if(!this.isWechat()) throw new Error('非微信环境无法分享');
    
    //服务端进行签名 ，可使用uni.request替换。 签名算法请看文档
    // const href = location.hash ? `${location.href.split('#')[0]}?${location.href.split('?')[1]}` : location.href
    const href = window.location.href.split('#')[0];
    // const href = location.href
    // const href = 'https://test.weiwo.info';
    // alert(`href: ${href}`)
    // let resConfig = await wxConfig(window.location.href);
    // let resConfig = await wxConfig(encodeURIComponent(href));
    let resConfig = await wxConfig(encodeURIComponent(href));
    
    let apiList = [
      // 'updateAppMessageShareData', // 分享给朋友和分享到QQ
      // 'updateTimelineShareData', // 分享到朋友圈和分享到QQ空间
      'onMenuShareAppMessage', // 分享给朋友
      'onMenuShareTimeline', // 分享到朋友圈
      'onMenuShareQQ', // 分享到QQ
      'onMenuShareQZone', // 分享到QQ空间
      // 'onMenuShareWeibo', // 分享到腾讯微博
      // 'hideOptionMenu',  // 可能需要用到的能力
      // 'showOptionMenu',  // 可能需要用到的能力
      // 'chooseWXPay'  // 可能需要用到的能力
    ];

    let info = {
      debug: false, // 调试，发布的时候改为false
      appId: resConfig.appId,
      timestamp: resConfig.timestamp,
      nonceStr: resConfig.nonceStr,
      signature: resConfig.signature,
      jsApiList: apiList
    };
    // alert(JSON.stringify(info))
    
    jweixin.config(info);
    return jweixin
  },
  // 如需每个页面都用到,在main.js里加这段
  // Vue.mixin({
  //   onShow() {
  //     jwx.configWeiXin(jweixin => {
  //       jweixin.hideOptionMenu();
  //     });
  //   }
  // });
  _checkJsApi() {
    const jsApiList = [
      'onMenuShareAppMessage'
    ]
    jweixin.checkJsApi({
      jsApiList,
      success: function(res) {
        alert(JSON.stringify(res))
      // 以键值对的形式返回，可用的api值true，不可用为false
      // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
      }
    });
  },
  //在需要自定义分享的页面中调用  
  share: async function(data = {}, callback){
    // console.log('data', data)
    //每次都需要重新初始化配置，才可以进行分享
    await this.initJssdk()
    
    let config = {
      title: document.title,
      desc: '大夫萨芬的身份',
      link: window.location.href.replace(window.location.search, ''),
      imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574153459148&di=aa8c0bbb7f822cea1812ff137c6bb419&imgtype=0&src=http%3A%2F%2Fi8.qhimg.com%2Ft014c0bef2485acc973.jpg',
    }
    Object.assign(config, data)
    // alert(`config:${JSON.stringify(config)}`)
    const shareData = {
      ...config,
      success: function (res) {
        setTimeout(() => {
          callback()
          // alert('分享成功 >>>')
        }, 1000) // 延迟以解决ios无法触发回调问题
        // 配置成功后的回调
      },
      cancel: function (res) {}
    };  
    jweixin.ready(function(){
      //分享给朋友, QQ好友 接口
      // jweixin.updateAppMessageShareData(shareData);
      //分享到朋友圈, QQ空间 接口
      // jweixin.updateTimelineShareData(shareData);
      //分享给朋友(即将废弃)
      jweixin.onMenuShareAppMessage(shareData);
      //分享到朋友圈(即将废弃)
      jweixin.onMenuShareTimeline(shareData);
      //分享到QQ(即将废弃)
      jweixin.onMenuShareQQ(shareData);
      //分享到QQ空间(即将废弃)
      jweixin.onMenuShareQZone(shareData);
    })
    jweixin.error(err => {
      console.log('微信分享配置失败', err);
    });
  },
  async pay() {
    await this.initJssdk()
    
    let payRes = await api.wxPay(params);
    jweixin.chooseWXPay({
      nonceStr: payRes.nonceStr,
      timestamp: payRes.timeStamp,
      package: payRes.package,
      signType: payRes.signType,
      paySign: payRes.paySign,
      success: () => {
          // 支付成功后
      },
      fail: err => {
          // 支付失败
      },
      cancel: err => {
          // 支付取消
      }
    });
  }
}