<template lang="pug">
  view.chat-item-list
    view.chat-item(v-for="item in list" @tap="$navigateTo({url: `./chatting?cid=${item.id}&did=${item.did}`})")
      view.chat-item-head
        image.chat-item-avatar(src="" alt="用户头像")
        text.chat-num(v-show="item.number") {{item.number}}
      view.chat-item-info
        view.username {{item.name}}
        view.msg {{item.content}}
      view.chat-item-hint
        view.time {{weixinTime(item.timestamp || 0)}}
</template>
<script>
  import {_getTimeStringAutoShort2 as weixinTime} from '@/common/js/tools'
  
  export default {
    data() {
      return {
        weixinTime,
        list: null,
      }
    },
    async onLoad(option) {
      // mu 39
      const did = 1340
      const cid = 6
      this.option = {...option, did, cid}
      
      this.getList()
    },
    methods: {
      async getList() {
        const hasMid = !!this.option.mu
        this.hasMid = hasMid
        const res = await this.$api.getChatHistory(hasMid)
        const _list = res.lists
        this.list = _list
      },
    },
    onShow() {
      console.log(8888888888888)
      this.getList()
    },
    onHide() {
      console.log(666666666666)
    },
  }
</script>
<style lang="scss" scoped>
  .chat-item-list{
    padding-left: 40rpx;
  }
  .chat-item{
    position: relative;
    padding: 16rpx 0;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    &::before{
      content: '';
      position: absolute;
      left: calc(88rpx + 20rpx);
      right: 0;
      bottom: 0;
      border-bottom: 2rpx solid #ccc;
      transform: scaleY(0.5);
    }
    &-head{
      position: relative;
      .chat-num{
        padding: 0 8rpx;
        text-align: center;
        position: absolute;
        width: auto;
        min-width: 18px;
        height: 18px;
        line-height: 18px;
        border-radius: 9px;
        top: -10rpx;
        right: -18rpx;
        font-size: 28rpx;
        background-color: #f43531;
        box-sizing: border-box;
        color: #fff;
      }
    }
    .msg{
      color: #ccc;
    }
    &-info{
      margin-left: 20rpx;
      flex: 1;
      .username{
        font-size: 32rpx;
      }
    }
    &-hint{
      padding-right: 20rpx;
      color: #ccc;
      align-self: flex-start;
    }
  }
  .chat-item-avatar{
    width: 96rpx;
    height: 96rpx;
    border-radius: 10rpx;
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
</style>
