<!-- view.msg-item
  image.msg-avator(src="" alt="用户头像")
  view.msg-info
    text.msg-user 在这种
    p.msg-text 关于image-set()这个CSS新属性的学习，大家有什么不懂的直接在群里问唯我同学吧。
    p.msg-text dsfsd
view.msg-item(data-self v-for="item, index in 10" :id="`msg-item-${index}`")
  image.msg-avator(src="" alt="用户头像")
  view.msg-info
    view.msg-user 我自己
    p.msg-text 关于image-set()这个CSS新属性的学习，大家有什么不懂的直接在群里问唯我同学吧。
    p.msg-text dsfsd
    p.msg-text dsfsd
    p.msg-text dsfsd -->
<template lang="pug">
  view.msg-list(@keyup.enter="send")
    view.msg-header
      text.iconfont.iconfanhui(@tap.stop="$navigateBack")
      |正在和{{you && you.name}}聊天{{endIndex}}
    scroll-view.msg-content(
      :scroll-top="0"
      scroll-y="true"
      :scroll-into-view="`msg-item-${endIndex}`"
      :upper-threshold="threshold"
      :lower-threshold="threshold"
      @scrolltoupper="upper"
      @scrolltolower="lower"
      @scroll.passive="scroll"
      )
      .no-more(v-show="loadedDone") 没有更多历史了...
      .msg-loading(v-show="isLoading")
        <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
           <circle class="path" fill="none" stroke="red" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
      view.msg-item(
        :data-self="hasMid ? item.type == 1 : item.type == 2"
        v-for="item, index in msgList"
        :key="item.timestamp"
        :id="`msg-item-${item.timestamp}`"
        )
        image.msg-avator(src="" alt="用户头像")
        view.msg-info
          view.msg-user {{getUser(hasMid ? item.type == 1 : item.type == 2).name}}
          p.msg-text {{item.content}}
          <!-- p.msg-text dsfsd -->
    view.msg-footer
      <!-- view.msg-footer-input: input#msg(@input="autoSize" focus placeholder="说点什么吧...") -->
      view.msg-footer-input: textarea(@input.trim="setContent" :value="content" rows="1" fixed auto-height focus placeholder="新年快乐...")
      button(@tap.enter="send" type="primary" size="mini") 发送
</template>

<script>
  import {pageVisibility} from '@/common/js/tools'
  
	export default {
		data() {
			return {
        ws: null,
        threshold: 30,
        loadedDone: false,
        isLoading: false,
        needScroll: true,
        page: 0,
        endIndex: 0,
				title: 'Hello',
        content: '',
        msgList: null,
        option: null,
        detail: null,
        hasMid: false // 游客
        // userType: 1, // 用户身份， 1 客户 2 置业顾问
			}
		},
    computed: {
      openid() { return this.$store.state.openid },
      intoViewId() {
        const msgList = this.msgList || []
        const num = msgList.length - 1
        console.log('num', num)
        
        return `msg-item-${num >= 0 ? num : 0}`
      },
      you() {
        const {contact_info, c_info} = this.detail || {}
        return this.hasMid ? contact_info : c_info
      },
      me() {
        const {contact_info, c_info} = this.detail || {}
        return this.hasMid ? c_info : contact_info
      }
    },
    watch: {
      msgList() {
        // if (!this.needScroll) return
        const pageSize = 10
        const keepIndex = this.msgList.length - (this.page - 1) * pageSize
        const index = this.endIndex ? keepIndex : this.msgList.length - 1
        this.$nextTick(() => {
          this.endIndex = this.msgList[index].timestamp
        })
      }
    },
		onLoad(option) {
      // mu 39
      // const did = 1340
      // const cid = 6
      this.option = {...option}
      const hasMid = !!this.option.mu
      this.hasMid = hasMid
      console.log('openid', this.openid)
      
      this.initSocket()
      this.getMsgList()
      
      this.toggleUnloadEven(true)
      
      pageVisibility.visibilitychange(() => {
        const isShow = !pageVisibility.hidden
        console.log(isShow)
        this.closeChat()
      })
		},
		methods: {
      toggleUnloadEven(bind) {
        // #ifdef H5
        // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        if (bind) {
          if (this.unloadEven) retun
          this.unloadEven = e => {
            e = e || window.event;
            // 兼容IE8和Firefox 4之前的版本
            if (e) {
              e.returnValue = '关闭提示';
            }
            // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
            
            return '关闭提示';
          }
          window.addEventListener('beforeunload', this.unloadEven)
        } else {
          window.removeEventListener('beforeunload', this.unloadEven)
          this.ws && this.ws.close();
        }
        this.closeChat()
        // #endif
      },
      closeChat() {
        const {cid, mu} = this.option || {}
        this.$api.chatClose(cid, mu)
      },
      getUser(isSelf) {
        const {contact_info, c_info} = this.detail || {}
        const arr = [
          {name: contact_info && contact_info.name},
          {name: c_info && c_info.name},
        ]
        if (this.hasMid) {
          return isSelf ? arr[1] : arr[0]
        } else {
          return isSelf ? arr[0] : arr[1]
        }
      },
      upper() {
        this.getMsgList()
      },
      lower() {
      },
      scroll(e) {
        const {scrollTop, scrollHeight} = e.detail
        const query = uni.createSelectorQuery().in(this);
        query.select('.msg-content').boundingClientRect(data => {
          const h = data.height
          const bottom = scrollHeight - h - scrollTop
          const inBottom = bottom <= this.threshold // 是否在底部范围内
          this.needScroll = inBottom
        }).exec();
      },
      getMsgList() {
        if (this.isLoading) return
        if (this.loadedDone) return
        this.isLoading = true
        
        const {cid, mu, sf, at} = this.option
        this.$api.getChatList(this.hasMid ? this.openid : '', cid, this.page, mu, sf, at).then(data => {
          this.touser = data.data && data.data.c_info
          const _list = (data.data && data.data.lists) || []
          this.msgList = [..._list, ...this.msgList || []]
          console.log('this.msgList', this.msgList)
          this.detail = data
          this.isLoading = false
          this.page++
          if (this.page >= data.data.total) this.loadedDone = true
          if (!this.option.cid) this.option.cid = data.c_info && data.c_info.id
          // if (this.option.mu) this.option.cid = this.option.mu
        })
      },
      async send() {
        const {cid, did, mu} = this.option
        await this.$api.sendMsg(cid, did, this.content, mu)
        const data = {
          content: this.content,
          type: this.hasMid ? 1 : 2,
          timestamp: Date.now()
        }
        this.msgList.push(data)
        this.content = ''
      },
      setContent(e) {
        const content = e.detail.value
        this.content = content
      },
      initSocket() {
        // WebSocket('wss://echo.websocket.org/')
        // const url = 'ws://192.168.1.16:8282'
        let protocol = location.protocol === 'https:' ? 'wss' : 'wss'
        const url = `${protocol}://test.weiwo.info:8282`
        // var ws =  new WebSocket("ws://192.168.1.16:8282");
        this.createWebSocket(url)
        if (!this.ws) return
        this.ws.onmessage = e => {
          console.log('onmessage!!!!')
          const data = JSON.parse(e.data) || {}
          console.log('data!!!!', data)
          const { client_id } = data
          if (client_id) {
            this.$api.bindOpenid(client_id, this.hasMid ? this.openid : '')
          } else {
            const cid = this.option.mu || this.option.cid
            // if (data.cid != this.option.cid) return
            console.log('cid', cid)
            if (data.cid != cid) return
            const obj = {
              content: data.message,
              type: this.hasMid ? 2 : 1,
              timestamp: data.timestamp
            }
            console.log('obj', obj)
            this.msgList.push(obj)
          }
        }
        this.ws.onopen = e => {
          console.warn('socket 已开启')
          // ws.send('hello')
          // ws.send({openid: this.openid, text: 'hello'})
        }
        this.ws.onclose = e => {
          console.error('socket 已关闭:', e)
          setTimeout(this.initSocket, 1000); // 重连
        }
        this.ws.onerror = e => {
          console.error('socket 出错啦:', e)
        }
      },
      createWebSocket(url) {
        let ws = null
        if('WebSocket' in window){
          ws = new WebSocket(url);
        }else if('MozWebSocket' in window){  
          ws = new MozWebSocket(url);
        }else{
          uni.showModal({
            title: '⚠',
            content: '您的浏览器不支持websocket协议',
            showCancel: false
          })
        }
        this.ws = ws
      },
      autoSize() {
        console.log(11111111)
        // this.$nextTick(() => {
        //   el.style.cssText = 'height:auto;overflow:hidden;'
        //   el.style.cssText = 'height:' + el.scrollHeight + 'px'
        // })
        const query = uni.createSelectorQuery().in(this);
        const msgEl = query.select('#msg')
        msgEl.boundingClientRect(data => {
          console.log(data);
        }).exec();
      },
		},
    onPullDownRefresh() {
      uni.stopPullDownRefresh()
    },
    onHide() {
      // console.log(11111111111111)
    },
    onUnload() {
      this.toggleUnloadEven(false)
      console.log(22222222222222)
    }
	}
</script>

<style lang="scss">
  $color-primary: #9CE553;
  $input-height: 56rpx;
  
  $offset: 187;
  $duration: 1.4s;
  
  .no-more{
    text-align: center;
    color: #ccc;
    font-size: 26rpx;
  }
  .msg-loading{
    text-align: center;
  }
  .spinner {
    animation: rotator $duration linear infinite;
    zoom: 0.4;
  }
  @keyframes rotator {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(270deg); }
  }
  .path {
    stroke: $color-primary;
    stroke-dasharray: $offset;
    stroke-dashoffset: 0;
    stroke-width: 5;
    transform-origin: center;
    animation: dash $duration ease-in-out infinite;
  }
  
  @keyframes dash {
   0% { stroke-dashoffset: $offset; }
   50% {
     stroke-dashoffset: $offset/4;
     transform:rotate(135deg);
   }
   100% {
     stroke-dashoffset: $offset;
     transform:rotate(450deg);
   }
  }
  
  .msg-list{
    background-color: #ebebeb;
    font-size: medium;
    // height: calc(100vh - 88rpx);
    height: 100vh;
    display: flex;
    flex-direction: column;
    --color: #ebebeb;
    --color-line: #ccc;
    background:
    radial-gradient(circle farthest-side at 0% 50%,var(--color) 23.5%,rgba(240,166,17,0) 0)21px 30px,
    radial-gradient(circle farthest-side at 0% 50%,var(--color-line) 24%,rgba(240,166,17,0) 0)19px 30px,
    linear-gradient(var(--color) 14%,rgba(240,166,17,0) 0, rgba(240,166,17,0) 85%,var(--color) 0)0 0,
    linear-gradient(150deg,var(--color) 24%,var(--color-line) 0,var(--color-line) 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,var(--color-line) 0,var(--color-line) 76%,var(--color) 0)0 0,
    linear-gradient(30deg,var(--color) 24%,var(--color-line) 0,var(--color-line) 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,var(--color-line) 0,var(--color-line) 76%,var(--color) 0)0 0,
    linear-gradient(90deg,var(--color-line) 2%,var(--color) 0,var(--color) 98%,var(--color-line) 0%)0 0 var(--color);
    background-size: 40px 60px;
    .msg-header{
      line-height: 48px;
      color: #fff;
      font-weight: bold;
      // text-align: center;
      background-color: #222;
      margin-bottom: 10px;
      .iconfont{
        padding: 0 20rpx;
      }
    }
    .msg-content{
      flex: 1;
      overflow-y: auto;
    }
    .msg-footer{
      padding: 20rpx;
      display: flex;
      align-items: flex-end;
      border-top: 2rpx solid #ccc;
      box-sizing: border-box;
      background-color: #eee;
      &-input{
        margin-right: 20rpx;
        flex: 1;
        background-color: rgba(255,255,255,.6);
        border-radius: 6rpx;
        min-height: $input-height;
        display: flex;
        align-items: center;
        textarea, input{
          padding: 0 10rpx;
          width: 100%;
        }
      }
      button{
        height: $input-height;
        line-height: $input-height;
        background-color: $color-primary;
      }
    }
  }
  
  .msg-item{
    display: flex;
    padding: 7px;
    margin-bottom: 15px;
    &:after{
      content: '';
      display: inline-block;
      width: 44px;
    }
    .msg-avator{
      width: 88rpx;
      height: 88rpx;
      border-radius: 50%;
      object-fit: cover;
      position: relative;
      display: inline-block;
      color: transparent;
      overflow: hidden;
      &::before{
        content: "";
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f0f3f9;
      }
      &::after{
        content: '图片信息：'attr(alt);
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        line-height: 60rpx;
        background-color: rgba(0,0,0,.5);
        color: white;
        font-size: 28rpx;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .msg-info{
      flex: 1;
      text-align: start;
      padding: 0 10px;
      overflow: hidden;
      .msg-user{
        font-size: 13px;
        color: #949ead;
      }
    }
    .msg-text{
      position: relative;
      width: fit-content;
      background: #fff;
      border-color: #fff;
      font-size: 14px;
      line-height: 1.5;
      color: #000;
      padding: .6em 1em;
      text-align: left;
      margin: 5px 0 0;
      border-radius: 6px;
      direction: ltr;
      &:first-of-type::before{
        content: '';
        position: absolute;
        width: .75em;
        height: .75em;
        top: 2px;
        left: -3px;
        background-color: inherit;
        transform: skew(35deg, 12deg);
      }
    }
    
    &[data-self=true]{
      direction: rtl;
      .msg-text{
        background: #9CE553;
        border-color: #9CE553;
        color: #000;
        &::before{
          left: calc(100% - .575em);
          transform: skew(-35deg, -12deg);
        }
      }
    }
  }
</style>

