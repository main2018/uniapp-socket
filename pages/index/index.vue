<template lang="pug">
  view.index
    scroll-view.msg-content(
      :scroll-top="0"
      scroll-y="true"
      :upper-threshold="30"
      :lower-threshold="30"
      @scrolltoupper="upper"
      )
      view.test(v-for="item, index in arr" :key="index") {{item}}
    button(type="primary" @tap="$navigateTo({url: `/pages/chat/list`})") 房源APP端置业顾问聊天列表
    <!-- button(type="warn" @tap="$navigateTo({url: `/pages/chat/chatting?did=1340&mu=39&sf=4&at=18`})") 房源H5端,向置业顾问发起聊天 -->
    button(type="warn" @tap="$navigateTo({url: `/pages/chat/chatting?did=1340&mu=68&sf=4&at=18`})") 房源H5端,向置业顾问发起聊天
</template>
<script>
  export default {
    data() {
      return {
        arr: []
      }
    },
    created() {
      const arr = [0,1,2,3,4,5,6,7,8,9]
      this.arr = [...arr, ...this.arr || []]
      console.log('this.arr', this.arr)
    },
    methods: {
      upper() {
        const arr = [10,11,12,13,14,15,16,17,18,19]
        this.arr = [...arr, ...this.arr || []]
      },
    }
  }
</script>
<style lang="scss" scoped>
  .index{
    padding: 40rpx;
  }
  button{
    margin-bottom: 60rpx;
  }
  
  scroll-view{
    height: 500px;
    border: 1px solid;
  }
  .test{
    line-height: 5;
  }
</style>